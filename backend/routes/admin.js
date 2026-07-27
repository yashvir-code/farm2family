const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const kavach = require("../middleware/auth");

const SECRET_KEY = '012012';
console.log("admin routes loaded");

router.post("/login-admin", (req, res) => {
    const { email, password } = req.body;
    connection.query("SELECT * FROM admin WHERE email = ?", [email], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(400).json({
                success: false,
                message:"Admin does not exist"
            });
        }
        

        const user = result[0];
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                return res.status(500).json({ success: false, message: "data base error" });
            }
            if (!match) {
                return res.status(400).json({
                    success: false, message: "wrong password"
                });
            }
            const token = jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                SECRET_KEY,
                {
                    expiresIn: "1h"
                }
            );
            res.json({
                success: true,
                message: "admin login successful",
                token
            });
        });
    });
});


// profile 
router.get("/profile", kavach, (req, res) => {

    const sql = "SELECT id, name, email FROM admin WHERE id = ?";

    connection.query(sql, [req.user.id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin Not Found"
            });
        }

        res.json({
            success: true,
            admin: result[0]
        });

    });

});

// verified 

router.put("/verify-farmer/:id", kavach, (req, res) => {

    const farmerId = req.params.id;

    const sql = `
        UPDATE farmer
        SET status = 'Verified'
        WHERE id = ?
    `;

    connection.query(sql, [farmerId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Farmer Not Found"
            });
        }

        res.json({
            success: true,
            message: "Farmer Verified Successfully"
        });

    });

});

// pending farmer 
router.get("/pending-farmers", kavach, (req, res) => {

    const sql = `
    SELECT
        id,
        name,
        email,
        phone,
        address
    FROM farmer
    WHERE status = 'Pending'
    ORDER BY id DESC
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
            farmers: result
        });

    });

});

// verified farmer 
router.get("/verified-farmers", kavach, (req, res) => {

    const sql = `
    SELECT
        id,
        name,
        email,
        phone,
        address
    FROM farmer
    WHERE status = 'Verified'
    ORDER BY id DESC
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
            farmers: result
        });

    });

});

// get all plans
router.get("/plans", kavach, (req, res) => {

    const sql = `
        SELECT *
        FROM membership
        ORDER BY id ASC
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

router.put("/update-plan/:id", kavach, (req, res) => {

    const id = req.params.id;

    const {
        plan_name,
        duration,
        price,
        description,
        status
    } = req.body;

    const sql = `
        UPDATE membership
        SET
            plan_name = ?,
            duration = ?,
            price = ?,
            description = ?,
            status = ?
        WHERE id = ?
    `;

    connection.query(
        sql,
        [
            plan_name,
            duration,
            price,
            description,
            status,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Plan Not Found"
                });
            }

            res.json({
                success: true,
                message: "Plan Updated Successfully"
            });

        }
    );

});

router.delete("/delete-plan/:id", kavach, (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM membership
        WHERE id = ?
    `;

    connection.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Plan Not Found"
            });
        }

        res.json({
            success: true,
            message: "Plan Deleted Successfully"
        });

    });

});

// get all subscribers
router.get("/subscribers", kavach, (req, res) => {

    const sql = `
        SELECT
            c.id,
            c.name,
            c.email,
            c.phone,
            c.subscription_status,
            c.subscription_start,
            c.subscription_end,
            m.plan_name,
            m.price
        FROM customer c
        LEFT JOIN membership m
        ON c.subscription_plan = m.id
        WHERE c.subscription_status = 'Active'
        ORDER BY c.id DESC
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
            subscribers: result
        });

    });

});
// get single sub:[id]
router.get("/subscriber/:id", kavach, (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            c.id,
            c.name,
            c.email,
            c.phone,
            c.subscription_status,
            c.subscription_start,
            c.subscription_end,
            m.plan_name,
            m.duration,
            m.price,
            m.description
        FROM customer c
        LEFT JOIN membership m
        ON c.subscription_plan = m.id
        WHERE c.id = ?
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
                message: "Subscriber Not Found"
            });
        }

        res.json({
            success: true,
            subscriber: result[0]
        });

    });

});

// total counting 

router.get("/dashboard-stats",(req,res)=>{

    const sql = `
    SELECT
    (SELECT COUNT(*) FROM farmer) AS totalFarmers,
    (SELECT COUNT(*) FROM farmer WHERE status='Pending') AS pendingFarmers,
    (SELECT COUNT(*) FROM farmer WHERE status='Verified') AS verifiedFarmers,
    (SELECT COUNT(*) FROM customer) AS totalSubscribers
    `;


    connection.query(sql,(err,result)=>{

        if(err){
            return res.status(500).json({
                message:"Database error"
            });
        }


        res.json(result[0]);

    });

});
module.exports = router;