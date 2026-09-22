const express = require("express");
const router = express.Router();

const connection = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const kavach = require("../middleware/auth");

const SECRET_KEY = "012012";

router.post("/register", (req, res) => {
    const { name, password, phone, email, address, apin } = req.body;

    bcrypt.hash(password, 10, (err, hashedpassword) => {
        if (err) {
            console.log("Password hashing error:", err);
            return res.status(500).json({
                success: false,
                message: "Unable to process password"
            });
        }

        const sql = `
            INSERT INTO farmer
            (name, email, password, address, phone, apin)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        connection.query(
            sql,
            [name, email, hashedpassword, address, phone, apin],
            (err, result) => {

                if (err) {
                    console.log("Registration Error:", err);

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            success: false,
                            message: "Email already registered"
                        });
                    }

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                console.log("The user is registered");

                return res.status(201).json({
                    success: true,
                    message: "Farmer registered successfully"
                });
            }
        );
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
            id,name,email,address,phone,apin
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


// profile CRUD operation 

router.put("/update-profile",kavach,(req,res)=>{
    const farmerId = req.user.id;
    const { name , phone , address ,apin} = req.body;
    const sql = ` UPDATE farmer SET name = ? , phone = ? , address = ? , apin = ? WHERE id = ? `;
    connection.query(sql, [name, phone, address , apin,farmerId], (err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        if(result.affectedRows === 0){
            return res.status(400).json({message :"the data is not found"});
        }
        res.json({succes:true, message :"profile update successfully"});
    }) ;
});

// verify hua h kinahi farmer us k liye

router.get("/check-status", kavach, (req, res) => {

    const sql = `
        SELECT status
        FROM farmer
        WHERE id = ?
    `;

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
                message: "Farmer Not Found"
            });
        }

        res.json({
            success: true,
            status: result[0].status
        });

    });

});
module.exports = router;