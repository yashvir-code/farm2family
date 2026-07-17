const express = require("express");
const router = express.Router();
const connection = require("../db");
const kavach = require("../middleware/auth");

console.log("Order route is loaded");

router.post("/place-order", kavach, (req, res) => {
    // console.log("Packet ID:", packetId);
    const customerId = req.user.id;
    const packetId = req.body.packet_id;


    console.log("Customer ID:", customerId);
    console.log("Packet ID:", packetId);
    connection.query(`SELECT farmer_id , price FROM packets WHERE id = ?`, [packetId], (err, packetresult) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (packetresult.length === 0) {

            return res.status(404).json({
                message: "Packet not found"
            });

        }
        const farmerId = packetresult[0].farmer_id;
        const price = packetresult[0].price;

        connection.query(`SELECT address FROM customer WHERE id=?`, [customerId], (err, customerResult) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (customerResult.length === 0) {

                return res.status(404).json({
                    message: "Customer not found"
                });

            }
            const deliveryAddress = customerResult[0].address;

            connection.query(`INSERT INTO orders (customer_id , packet_id ,farmer_id , price , delivery_address) VALUES (?,?,?,?,?)`, [customerId, packetId, farmerId, price, deliveryAddress], (err, result) => {
                if (err) {
                    return res.status(500).json(err);
                }
                res.json({
                    success: true,
                    message: "order place succesfully",
                    orderId: result.insertId
                });
            });
        });
    });


});


// ye API order_status ko update karne k liye h like accepted

router.put("/update-status",kavach,(req,res)=>{
    const farmerId = req.user.id;
    const {order_id,status}=req.body;
    const sql =`UPDATE orders
                            SET order_status =? 
                            WHERE id = ?
                            AND farmer_id = ? 
                            `;
    connection.query(sql,[status, order_id, farmerId],(err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        if(result.affectedRows === 0){
            return res.status(404).json({message:"order not found"});
        }
        res.json({
            success:true,
            message:"order status updated successfully "
        });
    });
});


// agar customer cancle kar de order ko to vo apne aap cancel ho jaye agar order pending h abhi to 
router.put("/cancel-order",kavach,(req,res)=>{
    const customerId = req.user.id;
    const {order_id} = req.body;
    const sql =` UPDATE orders 
                    SET order_status = "Cancelled"
                    WHERE id = ?
                    AND customer_id = ?
                    AND order_status = "Pending"`;

    connection.query(sql,[order_id,customerId],(err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        if(result.affectedRows === 0){
            return res.status(400).json({message:"Order can not be canclled"});
        }
            
        res.json({success:true,message:"Order canclled successfully."});
    });
});
module.exports = router;


