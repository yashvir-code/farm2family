const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const connection = require("../db");
const kavach = require("../middleware/auth");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// CREATE RAZORPAY ORDER


router.post("/create-order", kavach, async (req, res) => {

    try {

        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });

    } catch (error) {

        console.log("Razorpay Create Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to create Razorpay order"
        });
    }

});



// VERIFY RAZORPAY PAYMENT

router.post("/verify-payment", kavach, (req, res) => {

    const customerId = req.user.id;

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        items,
        delivery_address
    } = req.body;


    // Check payment details
    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
    ) {

        return res.status(400).json({
            success: false,
            message: "Payment details are missing"
        });

    }


    // CREATE SIGNATURE

    const generatedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
        .update(
            razorpay_order_id + "|" + razorpay_payment_id
        )
        .digest("hex");


    // VERIFY SIGNATURE

    if (generatedSignature !== razorpay_signature) {

        console.log("Invalid Razorpay Signature");

        return res.status(400).json({
            success: false,
            message: "Payment verification failed"
        });

    }


    console.log("Payment verified successfully");

    // CHECK ITEMS

    if (!Array.isArray(items) || items.length === 0) {

        return res.status(400).json({
            success: false,
            message: "Cart is empty"
        });

    }



    // INSERT ORDERS

    let completedOrders = 0;


    items.forEach((item) => {

        connection.query(
            `SELECT farmer_id, price, status
             FROM packets
             WHERE id = ?`,
            [item.id],

            (err, packetResult) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }


                if (packetResult.length === 0) {

                    return res.status(404).json({
                        success: false,
                        message: `Packet ${item.id} not found`
                    });

                }


                const packet = packetResult[0];


                // Check basket status

                if (packet.status === "Disabled") {

                    return res.status(400).json({
                        success: false,
                        message: "One of the baskets is unavailable"
                    });

                }


                const farmerId = packet.farmer_id;

                const price = packet.price;

                // INSERT ORDER
                connection.query(
                    `INSERT INTO orders
                    (
                        customer_id,
                        packet_id,
                        farmer_id,
                        price,
                        delivery_address,
                        payment_method,
                        payment_status,
                        order_status,
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    
                    [
                        customerId,
                        item.id,
                        farmerId,
                        price,
                        delivery_address,
                        "Razorpay",
                        "Paid",
                        "Pending",
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature
                    ],

                    (err, result) => {

                        if (err) {

                            console.log(
                                "Order Insert Error:",
                                err
                            );

                            return res.status(500).json({
                                success: false,
                                message: "Unable to save order"
                            });

                        }


                        completedOrders++;

                        // ALL ORDERS INSERTED

                        if (completedOrders === items.length) {

                            res.json({
                                success: true,
                                message:
                                    `${completedOrders} basket(s) ordered successfully.`,
                                orderCount: completedOrders
                            });

                        }

                    }
                );

            }
        );

    });

});


module.exports = router;