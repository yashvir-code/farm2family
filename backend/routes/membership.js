const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const kavach = require("../middleware/auth");

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