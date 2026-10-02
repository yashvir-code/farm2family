const express = require("express");
const router = express.Router();
const connection = require("../db");
const upload = require("../utils/upload");
const kavach = require("../middleware/auth");
const { json } = require("body-parser");



router.post("/add-packet", kavach, upload.single("image"), (req, res) => {

    console.log("API HIT");
    const farmerId = req.user.id;
    const farmername = req.body.farmname;
    const listing_title = req.body.title;
    const farm_address = req.body.farmadd;
    const area = req.body.area;
    const pincode = req.body.pincode;
    const organic = req.body.org.toLowerCase();
    const price = req.body.price;

    const vegetables = JSON.parse(req.body.vegitables);

    const image = req.file ? req.file.filename : null;

    let basket_size = 0;

    vegetables.forEach((v) => {
        basket_size += Number(v.quantity);
    });

    const sql = `
        INSERT INTO packets
        (farmer_id,farmname, listing_title, basket_size, farm_address, area, pincode, organic, price, image)
        VALUES (?,?,?,?,?,?,?,?,?,?)
    `;

    connection.query(
        sql,
        [
            farmerId,
            farmername,
            listing_title,
            basket_size,
            farm_address,
            area,
            pincode,
            organic,
            price,
            image
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            const packetId = result.insertId;

            vegetables.forEach((veg) => {

                connection.query(
                    `INSERT INTO packet_vegetables
                    (packet_id, vegetable_name, quantity)
                    VALUES (?,?,?)`,
                    [
                        packetId,
                        veg.vegitable,
                        veg.quantity
                    ]
                );

            });

            res.json({
                success: true,
                message: "Packet Created Successfully"
            });

        }
    );

});

// this API for fetching the id wise packet full details for Edit packet , when we need to Pre fill the the form 

router.get("/packet/:id", kavach, (req, res) => {
    const id = req.params.id;
    const sql = `SELECT 
                        p.*,
                        pv.vegetable_name,
                        pv.quantity
                        FROM packets p
                        JOIN packet_vegetables pv
                        ON p.id = pv.packet_id
                        WHERE p.id = ?;

                        `;
    connection.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json(err)
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: "packet not found"
            });
        }
        const packet = {
            id: result[0].id,
            farmname: result[0].farmname,
            listing_title: result[0].listing_title,
            basket_size: result[0].basket_size,
            farm_address: result[0].farm_address,
            area: result[0].area,
            pincode: result[0].pincode,
            organic: result[0].organic,
            price: result[0].price,
            image: result[0].image,
            vegetables: []
        };
        result.forEach((row) => {
            packet.vegetables.push({
                vegetable_name: row.vegetable_name,
                quantity: row.quantity
            });
        });
        res.json(packet);
    });
});


//UPDATE PACKET API

router.put(
    "/update-packet/:id", kavach, upload.single("image"),
    (req, res) => {

        // URL se packet ki id and loged in farmer id aayegi
        const packetId = req.params.id;
        const farmerId = req.user.id;

        const farmname = req.body.farmname;
        const listing_title = req.body.title;
        const farm_address = req.body.farmadd;
        const area = req.body.area;
        const pincode = req.body.pincode;
        const organic = req.body.org;
        const price = req.body.price;

        const vegetables = JSON.parse(req.body.vegitables);

        let basket_size = 0;

        vegetables.forEach((v) => {
            basket_size += Number(v.quantity);
        });

        // Agar new image upload hui hai to uska naam
        let image = null;

        if (req.file) {
            image = req.file.filename;
        }

        // Agar image upload hui hai tabhi image update hogi

        let sql = `
            UPDATE packets
            SET
                farmname = ?,
                listing_title = ?,
                basket_size = ?,
                farm_address = ?,
                area = ?,
                pincode = ?,
                organic = ?,
                price = ?
        `;
        const values = [
            farmname,
            listing_title,
            basket_size,
            farm_address,
            area,
            pincode,
            organic,
            price
        ];

        // Agar image upload hui hai
        if (image) {
            sql += `, image = ?`;
            values.push(image);
        }
        // Sirf isi farmer ka packet update hoga
        sql += `
            WHERE id = ? AND farmer_id = ?
        `;

        values.push(packetId);
        values.push(farmerId);

        // Packet Table Update

        connection.query(sql, values, (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            console.log("Packet Updated");

            // Purani vegetables delete
            connection.query(
                "DELETE FROM packet_vegetables WHERE packet_id = ?",
                [packetId],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }
                    // Nayi vegetables insert
                    vegetables.forEach((veg) => {

                        connection.query(
                            `INSERT INTO packet_vegetables
                            (packet_id, vegetable_name, quantity)
                            VALUES (?,?,?)`,
                            [
                                packetId,
                                veg.vegetable_name,
                                veg.quantity
                            ]
                        );

                    });
                    res.json({
                        success: true,
                        message: "Packet Updated Successfully"
                    });

                }
            );

        });

    }
);



// delecte API 

router.delete("/delete-packet/:id", kavach, (req, res) => {
    const packetId = req.params.id;
    const farmerId = req.user.id;

    connection.query(
        "DELETE FROM packet_vegetables WHERE packet_id =? ",
        [packetId], (err) => {
            if (err) {
                return res.status(500).json(err);
            }
            connection.query("DELETE FROM packets WHERE id =? AND farmer_id=?", [packetId, farmerId], (err, result) => {
                if (err) {
                    return res.status(500).json(err)
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: true, message: "packet not found" });
                }
                res.json({
                    success: true,
                    message: "Packet Deleted Successfully"
                });
            });
        }
    );
});

// status change API 
router.put("/change-status",kavach,(req,res)=>{
    const farmerId = req.user.id;
    const {packet_id , status} = req.body;
    const sql = `UPDATE packets SET status = ? WHERE id = ? AND farmer_id = ? `;
    connection.query(sql,[status,packet_id,farmerId],(err,result)=>{
        if(err){
            return res.status(500).json(err)
        }
        if(result.affectedRows === 0 ){
             return res.status(404).json({
                    success: false,
                    message: "Basket not found"
                });
        }
         res.json({
                success: true,
                message: `Basket ${status} successfully`
            });
    }); 
});
module.exports = router;