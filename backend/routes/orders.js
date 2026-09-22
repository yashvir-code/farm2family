const express = require("express");
const router = express.Router();
const connection = require("../db");
const kavach = require("../middleware/auth");

console.log("Order route is loaded");

router.post("/place-order", kavach, (req, res) => {

    const customerId = req.user.id;
    const packetId = req.body.packet_id;

    console.log("Customer ID:", customerId);
    console.log("Packet ID:", packetId);

    // Packet Details + Status Check
    connection.query(
        "SELECT farmer_id, price, status FROM packets WHERE id = ?",
        [packetId],
        (err, packetResult) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (packetResult.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Packet not found"
                });
            }

            const farmerId = packetResult[0].farmer_id;
            const price = packetResult[0].price;
            const status = packetResult[0].status;

            // Basket Disabled
            if (status === "Disabled") {
                return res.status(400).json({
                    success: false,
                    message: "This basket is currently unavailable."
                });
            }

            // Customer Address
            connection.query(
                "SELECT address FROM customer WHERE id = ?",
                [customerId],
                (err, customerResult) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    if (customerResult.length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: "Customer not found"
                        });
                    }

                    const deliveryAddress = customerResult[0].address;
                      // Place Order
                    connection.query(
                        `INSERT INTO orders
                        (customer_id, packet_id, farmer_id, price, delivery_address)
                        VALUES (?,?,?,?,?)`,
                        [
                            customerId,
                            packetId,
                            farmerId,
                            price,
                            deliveryAddress
                        ],
                        (err, result) => {
                            if (err) {
                                return res.status(500).json(err);
                            }
                            res.json({
                                success: true,
                                message: "Order placed successfully",
                                orderId: result.insertId
                            });
                        }
                    );
                }
            );
        }
    );
});

// ye API order_status ko update karne k liye h like accepted

router.put("/update-status", kavach, (req, res) => {
    const farmerId = req.user.id;
    const { order_id, status } = req.body;
    const sql = `UPDATE orders
                            SET order_status =? 
                            WHERE id = ?
                            AND farmer_id = ? 
                            `;
    connection.query(sql, [status, order_id, farmerId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "order not found" });
        }
        res.json({
            success: true,
            message: "order status updated successfully "
        });
    });
});


// agar customer cancle kar de order ko to vo apne aap cancel ho jaye agar order pending h abhi to 
router.put("/cancel-order", kavach, (req, res) => {
    const customerId = req.user.id;
    const { order_id } = req.body;
    const sql = ` UPDATE orders 
                    SET order_status = "Cancelled"
                    WHERE id = ?
                    AND customer_id = ?
                    AND order_status = "Pending"`;

    connection.query(sql, [order_id, customerId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Order can not be canclled" });
        }

        res.json({ success: true, message: "Order canclled successfully." });
    });
});

// Place COD order from Cart
router.post("/place-cod-order", kavach, (req, res) => {

    const customerId = req.user.id;
    const { items, delivery_address } = req.body;

    console.log("COD Order Customer:", customerId);
    console.log("COD Order Items:", items);

    // Validate cart
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Cart is empty"
        });
    }

    // Validate address
    if (!delivery_address || delivery_address.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Delivery address is required"
        });
    }

    // First check all packets
    const packetIds = items.map((item) => item.id);

    const placeholders = packetIds.map(() => "?").join(",");

    const sql = `
        SELECT 
            id,
            farmer_id,
            price,
            status
        FROM packets
        WHERE id IN (${placeholders})
    `;

    connection.query(
        sql,
        packetIds,
        (err, packetResults) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    error: err.sqlMessage
                });
            }

            // Check all packets exist
            if (packetResults.length !== packetIds.length) {
                return res.status(400).json({
                    success: false,
                    message: "One or more baskets are not available"
                });
            }

            // Check disabled baskets
            const disabledPacket = packetResults.find(
                (packet) => packet.status === "Disabled"
            );

            if (disabledPacket) {
                return res.status(400).json({
                    success: false,
                    message: "One or more baskets are currently unavailable"
                });
            }

            // Create order values
            const orderValues = items.map((item) => {

                const packet = packetResults.find(
                    (p) => p.id === item.id
                );

                const quantity = Number(item.quantity) || 1;

                const totalPrice =
                    Number(packet.price) * quantity;

                return [
                    customerId,
                    packet.id,
                    packet.farmer_id,
                    totalPrice,
                    delivery_address,
                    "Cash on Delivery",
                    "Pending",
                    "Pending"
                ];
            });

            const insertSQL = `
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

            connection.query(
                insertSQL,
                [orderValues],
                (err, result) => {

                    if (err) {
                        console.log("ORDER INSERT ERROR:", err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to place order",
                            error: err.sqlMessage
                        });
                    }

                    const firstOrderId = result.insertId;
                    const orderCount = result.affectedRows;

                    res.json({
                        success: true,
                        message: "COD Order placed successfully",
                        orderId: firstOrderId,
                        orderCount: orderCount
                    });
                }
            );
        }
    );
});
module.exports = router;


