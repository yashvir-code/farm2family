const express = require("express");
const router = express.Router();
const connection = require("../db");
const kavach = require("../middleware/auth");


router.get("/my-packet", kavach, (req, res) => {
    const farmerId = req.user.id;
    console.log("Logged in Farmer ID:", farmerId);
    const sql = `
       SELECT
                p.id,
                p.farmname,
                p.listing_title,
                p.basket_size,
                p.farm_address,
                p.pincode,
                p.price,
                p.created_at,
                p.image,
                pv.vegetable_name,
                pv.quantity
            FROM packets p
            JOIN packet_vegetables pv
            ON p.id = pv.packet_id
            WHERE p.farmer_id = ?
            ORDER BY p.id
    `;
    console.log("Fetching packets of Farmer ID:", farmerId);
    connection.query(sql, [farmerId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        const groupbasket = {};

        result.forEach((row) => {

            if (!groupbasket[row.id]) {

                groupbasket[row.id] = {
                    id: row.id,
                    farmname: row.farmname,
                    listing_title: row.listing_title,
                    basket_size: row.basket_size,
                    farm_address: row.farm_address,
                    pincode: row.pincode,
                    price: row.price,
                    image: row.image,
                    created_at: row.created_at,
                    vegetable: []
                };

            }

            groupbasket[row.id].vegetable.push({
                vegetable_name: row.vegetable_name,
                quantity: row.quantity
            });

        });

        res.json(Object.values(groupbasket));

    });

});
router.get("/test", (req, res) => {
    res.send("Fetch Route Working");
});

// yaha se customer side API h sare 

router.get("/all-packets", kavach, (req, res) => {
    const sql = `SELECT 
                p.id,
                p.farmname,
                p.listing_title,
                p.basket_size,
                p.farm_address,
                p.area,
                p.pincode,
                p.organic,
                p.price,
                p.image,
                pv.vegetable_name,
                pv.quantity
                FROM packets p
                JOIN packet_vegetables pv
                ON p.id = pv.packet_id
                ORDER BY p.id DESC 
                `;

    connection.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "database m error h " });
        }
        if (result.length === 0) {
            return res.json([]);
        }

        const groupbasket = {};
        result.forEach((row) => {
            if (!groupbasket[row.id]) {
                groupbasket[row.id] = {
                    id: row.id,
                    farmname: row.farmname,
                    listing_title: row.listing_title,
                    basket_size: row.basket_size,
                    farm_address: row.farm_address,
                    area: row.area,
                    pincode: row.pincode,
                    image: row.image,
                    organic: row.organic,
                    price: row.price,

                    vegetable: []
                };

            }
            groupbasket[row.id].vegetable.push({
                vegetable_name: row.vegetable_name,
                quantity: row.quantity
            });

        });
        res.json(Object.values(groupbasket));

    });
});

// ye API customer side k my_order ki h 

router.get("/my-order", kavach, (req, res) => {
    const customerId = req.user.id;
    const sql = `SELECT 
                        o.id,
                        o.packet_id,
                        o.price,
                        o.delivery_address,
                        o.payment_method,
                        o.payment_status,
                        o.order_status,
                        o.ordered_at,
                        
                        p.listing_title,
                        p.farmname,
                        p.image,
                        p.basket_size

                        FROM orders o
                        JOIN packets p
                        ON o.packet_id = p.id
                        WHERE o.customer_id =?
                        ORDER BY o.ordered_at DESC
                `;
    connection.query(sql, [customerId], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.json([]);
        }

        res.json(result);

    });

})

// ye API farmer orders k liye h , logedin farmer hi dekha payenge 

router.get("/farmer-order",kavach,(req,res)=>{
    const farmerId = req.user.id;
    const sql = `
                SELECT 
                o.id,
                o.price,
                o.order_status,
                o.payment_status,
                o.ordered_at,

                c.name,
                c.phone,
                c.address,

                p.listing_title,
                p.image,
                p.basket_size,

                pv.vegetable_name,
                pv.quantity

                FROM orders o

                JOIN customer c
                ON o.customer_id = c.id

                JOIN packets p
                ON o.packet_id = p.id

                JOIN packet_vegetables pv
                ON p.id = pv.packet_id

                WHERE o.farmer_id = ?  
                `;

    connection.query(sql,[farmerId],(err,result)=>{
        //  console.log(result);

         if(err){
            return res.status(500).json(err);
         }
         if(result.length === 0){
            return res.json({
                message:"database m error h",

            });
         }

        const grouporder = {};
        result.forEach((row)=>{
            if(!grouporder[row.id]) {
                grouporder[row.id]={
                    id:row.id,
                    name:row.name,
                    phone: row.phone,
                    address:row.address,
                    listing_title:row.listing_title,
                    image:row.image,
                    basket_size:row.basket_size,
                    price:row.price,
                    payment_status:row.payment_status,
                    order_status:row.order_status,
                    ordered_at:row.ordered_at,
                    vegetables:[]
                };
            }

            grouporder[row.id].vegetables.push({
                vegetable_name:row.vegetable_name,
                quantity:row.quantity
            });
        });
        res.json(Object.values(grouporder));

    })
})

// yaha total ernig of farmer , delivered , panding order count karne ki API 

router.get("/farmer-earnings",kavach,(req,res)=>{

    const farmerId = req.user.id;

    const sql = `SELECT 
                    COUNT(*) AS totalorders,
                    IFNULL (SUM( CASE WHEN order_status = "Delivered" THEN price ELSE 0 END ),0 )AS totalearning,
                    SUM(CASE WHEN order_status = "Delivered" THEN 1 ELSE 0 END ) AS deliveredorders,
                    SUM (CASE WHEN order_status = "Pending" THEN 1 ELSE 0 END ) AS pendingorders
                    FROM orders
                    WHERE farmer_id = ?;
                    `;
    connection.query(sql,[farmerId],(err,result)=>{
        if(err){
            return res.status(500).json(err);
        }
        if(result.length === 0){
            return res.status(404).json({message:"data not found"});
        }
        res.json(result[0]);
    });


});

module.exports = router;