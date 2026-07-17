const express = require("express");
const router = express.Router();

const connection = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const kavach = require("../middleware/auth");

const SECRET_KEY = "001122";

router.post("/register", (req, res) => {const { name, password, phone, email, address, apin } = req.body;
    console.log(name, apin);
    bcrypt.hash(password, 10, function (err, hashedpassword) {
        if (err) throw err;
        console.log("password hashed", hashedpassword);
        const sql = `
            INSERT INTO farmer
            ( name, email, password ,address,phone , apin )
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        connection.query(sql, [name, email, hashedpassword, address, phone, apin], function (err, result) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "database error",
                    success: false,
                    error: err.message
                });
            }
            console.log("the user is registered");
            res.json({ message: "data inserted successfully", data: req.body });
        });
    });
});

router.post("/login", (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    connection.query(
        "SELECT * FROM farmer WHERE email = ?",
        [email],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }
            if (!result || result.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "user not exist"
                });
            }
            const user = result[0];
            bcrypt.compare(password, user.password, (err, match) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });
                }
                if (!match) {
                    return res.status(400).json({
                        success: false,
                        message: "wrong password"
                    });
                }
                const token = jwt.sign(
                    {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    },
                    SECRET_KEY,
                    { expiresIn: "1h" }
                );
                res.json({
                    success: true,
                    message: "user login success",
                    token: token
                });
            });
        }
    );
});

router.get("/dashboard",kavach, (req, res) => { res.json({
        success: true,
        message: "welcome to farmer page",
        user: req.user
    });
});


// profile

router.get("/profile", kavach, (req, res) => {

    const farmerId = req.user.id;

    connection.query(
        `SELECT
            id,
            name,
            email,
            address,
            phone,
            apin
        FROM farmer
        WHERE id = ?`,
        [farmerId],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Farmer not found"
                });
            }

            res.json(result[0]);

        }
    );

});
module.exports = router;