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
module.exports = router;