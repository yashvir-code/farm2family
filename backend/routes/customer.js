const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const kavach = require("../middleware/auth");

const SECRET_KEY = "012012";
console.log("Customer Routes Loaded");

router.post("/register_cust", (req, res) => {
                    console.log("Register API Hit");
                    console.log(req.body);
                    const { name, email, password, phone, areapin, address } = req.body;

                     bcrypt.hash(password, 10, (err, hashedPassword) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Password hashing failed"
            });
        }

        const sql = `
            INSERT INTO customer
            (name, email, password, phone, areapin, address)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        connection.query(
            sql,
            [name, email, hashedPassword, phone, areapin, address],
            (err, result) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Database Error",
                        error:err.sqlMessage,
                    });
                }

                res.json({
                    success: true,
                    message: "Customer Registered Successfully"
                });

            }
        );

    });

});


router.post("/login", (req, res) => {

    const { email, password } = req.body;

    connection.query(
        "SELECT * FROM customer WHERE email = ?",
        [email],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (result.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "User does not exist"
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
                        message: "Wrong Password"
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
                    message: "Customer Login Successful",
                    token
                });

            });

        }
    );

});



router.get("/dashboard", kavach, (req, res) => {
      console.log("Customer Route Working");
    res.json({
        success: true,
        message: "Welcome to Customer Dashboard",
        user: req.user
    });

});

router.get("/test", (req, res) => {
    res.send("Customer Route Working");
});


// customer profile API 


router.get("/profile", kavach, (req, res) => {

    const id = req.user.id;

    const sql = `
        SELECT
            id,
            name,
            email,
            phone,
            address,
            areapin
        FROM customer
        WHERE id = ?
    `;

    connection.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json(result[0]);

    });

});
// profile details update APi 

router.put("/update-profile-cust",kavach,(req,res)=>{
    const customerId = req.user.id;
    const {name,phone,address,areapin} = req.body;
    const sql = `UPDATE customer SET name=? , phone =?, address =? , areapin = ? WHERE id = ?`;
    connection.query(sql,[name,phone,address,areapin,customerId],(err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        if(result.affectedRows === 0){
            return res.status(400).json({message:"data not found"});
        }
        res.json({success:true,message:"profile update successfully"})
    });
});

router.get("/check-membership", kavach, (req, res) => {

    const customerId = req.user.id;

    const sql = `
        SELECT
            subscription_status,
            subscription_plan,
            subscription_end
        FROM customer
        WHERE id = ?
    `;

    connection.query(sql, [customerId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer Not Found"
            });
        }

        const customer = result[0];

        // Membership active hai aur expiry date future me hai
        if (
            customer.subscription_status === "Active" &&
            customer.subscription_end &&
            new Date(customer.subscription_end) >= new Date()
        ) {
            return res.json({
                success: true,
                member: true,
                planId: customer.subscription_plan,
                expiry: customer.subscription_end
            });
        }

        // Membership nahi hai ya expire ho chuki hai
        res.json({
            success: true,
            member: false
        });

    });

});

// Customer Membership Details

router.get("/my-membership", kavach, (req, res) => {

    const customerId = req.user.id;

    const sql = `
        SELECT
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

    connection.query(sql, [customerId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer Not Found"
            });
        }

        res.json({
            success: true,
            membership: result[0]
        });

    });

});

router.get("/membership-details", kavach, (req, res) => {

    const customerId = req.user.id;

    const sql = `
        SELECT
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

    connection.query(sql, [customerId], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer Not Found"
            });
        }

        res.json({
            success: true,
            membership: result[0]
        });

    });

});

// Create COD Orders
router.post("/create-cod-order", kavach, (req, res) => {
    const customerId = req.user.id;
    const {
        items,
        delivery_address
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Cart is empty"
        });
    }

    if (!delivery_address) {
        return res.status(400).json({
            success: false,
            message: "Delivery address is required"
        });
    }

    const orderValues = [];

    items.forEach((item) => {
        orderValues.push([
            customerId,
            item.id,
            item.farmer_id,
            Number(item.price) * Number(item.quantity),
            delivery_address,
            "Cash on Delivery",
            "Pending",
            "Pending"
        ]);
    });

    const sql = `
        INSERT INTO orders
        (
            customer_id,
            packet_id,
            farmer_id,
            price,
            delivery_address,
            payment_method,
            payment_status,
            order_status
        )
        VALUES ?
    `;

    connection.query(sql, [orderValues], (err, result) => {
        if (err) {
            console.log("COD ORDER ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to create order",
                error: err.sqlMessage
            });
        }

        res.json({
            success: true,
            message: "COD Order Placed Successfully",
            orderIds: Array.from(
                { length: result.affectedRows },
                (_, index) => result.insertId + index
            )
        });
    });
});


module.exports = router;