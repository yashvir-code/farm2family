const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const kavach = require("../middleware/auth");
const Razorpay = require("razorpay");
const crypto = require("crypto");

router.post("/add-plan", kavach, (req, res) => {

    const {
        plan_name,
        duration,
        price,
        description
    } = req.body;

    const sql = `
        INSERT INTO membership
        (plan_name, duration, price, description)
        VALUES (?,?,?,?)
    `;

    connection.query(
        sql,
        [
            plan_name,
            duration,
            price,
            description
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            res.json({
                success: true,
                message: "Membership Plan Added Successfully"
            });

        }
    );

});


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// Get All Active Membership Plans

router.get("/plans", (req, res) => {

    const sql = `
        SELECT
            id,
            plan_name,
            duration,
            price,
            description,
            status
        FROM membership
        WHERE status = 'Active'
        ORDER BY price ASC
    `;

    connection.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            plans: result
        });

    });

});

router.post("/create-payment-order", kavach, async (req, res) => {

    try {

        const { planId } = req.body;

        if (!planId) {
            return res.status(400).json({
                success: false,
                message: "Plan ID is required"
            });
        }

        const sql = `
            SELECT
                id,
                plan_name,
                duration,
                price,
                description
            FROM membership
            WHERE id = ? AND status = 'Active'
        `;

        connection.query(sql, [planId], async (err, result) => {

            if (err) {
                console.log("Plan Fetch Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Membership plan not found"
                });
            }

            const plan = result[0];

            const options = {
                amount: Math.round(Number(plan.price) * 100),
                currency: "INR",
                receipt: `membership_${plan.id}_${Date.now()}`
            };

            try {

                const order = await razorpay.orders.create(options);

                return res.json({
                    success: true,
                    order: order
                });

            } catch (error) {

                console.log("Razorpay Order Error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Unable to create Razorpay order"
                });

            }

        });

    } catch (error) {

        console.log("Create Membership Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});


router.post("/verify-payment", kavach, (req, res) => {

    const customerId = req.user.id;

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId
    } = req.body;

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !planId
    ) {
        return res.status(400).json({
            success: false,
            message: "Payment details are missing"
        });
    }

    const generatedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
        .update(
            razorpay_order_id + "|" + razorpay_payment_id
        )
        .digest("hex");

    if (generatedSignature !== razorpay_signature) {

        console.log("Invalid Razorpay Signature");

        return res.status(400).json({
            success: false,
            message: "Payment verification failed"
        });

    }

    const sql = `
        SELECT
            id,
            plan_name,
            duration,
            price
        FROM membership
        WHERE id = ? AND status = 'Active'
    `;

    connection.query(sql, [planId], (err, result) => {

        if (err) {

            console.log("Plan Fetch Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Membership plan not found"
            });

        }

        const plan = result[0];

        const startDate = new Date();

        const endDate = new Date();

        endDate.setDate(
            endDate.getDate() + Number(plan.duration)
        );

        const updateSql = `
            UPDATE customer
            SET
                subscription_plan = ?,
                subscription_status = 'Active',
                subscription_start = ?,
                subscription_end = ?
            WHERE id = ?
        `;

        connection.query(
            updateSql,
            [
                plan.id,
                startDate,
                endDate,
                customerId
            ],
            (err) => {

                if (err) {

                    console.log(
                        "Membership Activation Error:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Unable to activate membership"
                    });

                }

                console.log(
                    "Membership payment verified and activated"
                );

                return res.json({
                    success: true,
                    message: "Membership activated successfully"
                });

            }
        );

    });

});

router.post("/buy-plan", kavach, (req, res) => {

    const customerId = req.user.id;
    const { planId } = req.body;

    const sql = `
        SELECT *
        FROM membership
        WHERE id = ? AND status='Active'
    `;

    connection.query(sql, [planId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Plan Not Found"
            });
        }

        const plan = result[0];

        const startDate = new Date();

        const endDate = new Date();

        endDate.setDate(
            endDate.getDate() + Number(plan.duration)
        );

        const updateSql = `
            UPDATE customer
            SET
                subscription_plan=?,
                subscription_status='Active',
                subscription_start=?,
                subscription_end=?
            WHERE id=?
        `;

        connection.query(
            updateSql,
            [
                plan.id,
                startDate,
                endDate,
                customerId
            ],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Database Error"
                    });
                }

                res.json({
                    success: true,
                    message: "Membership Activated Successfully"
                });

            }
        );

    });

});

router.get("/plan/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            id,
            plan_name,
            duration,
            price,
            description
        FROM membership
        WHERE id = ?
    `;

    connection.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Plan Not Found"
            });
        }

        res.json({
            success: true,
            plan: result[0]
        });

    });

});

module.exports = router;