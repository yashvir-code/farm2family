"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./my-packet.css";
import { useRouter } from "next/navigation";

function page() {
    const [packets, setPackets] = useState<any[]>([]);
    const router = useRouter();
    const handleFetch = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/fetch/my-packet",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(res.data);
            setPackets(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);




    const handledelete = async (id: number) => {
        const confirmdelete = window.confirm("Are you sure want to delete this packet ?");
        if (!confirmdelete) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`http://localhost:5000/listing/delete-packet/${id}`,
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert(res.data.message);
            // list ko refresh karne k liye
            handleFetch();
        }
        catch (err) {
            console.log(err);
            alert("Deletion failed")
        }
    };

    return (
        <div className="container">

            {packets.map((packet) => (

                <div className="packet-card" key={packet.id}>

                    <img
                        src={`http://localhost:5000/uploads/${packet.image}`}
                        width="200"
                    />

                    <div className="packet-info">

                        <h2>{packet.listing_title}</h2>

                        <h3>{packet.farmname}</h3>

                        <p><b>Basket Size :</b> {packet.basket_size} Kg</p>

                        <p><b>Address :</b> {packet.farm_address}</p>

                        <p><b>Pincode :</b> {packet.pincode}</p>

                        <div className="price">₹ {packet.price}</div>

                        <div className="vegetables">

                            <h4>Vegetables</h4>

                            {packet.vegetable.map((vegetable, index) => (

                                <p key={index}>
                                    • {vegetable.vegetable_name} - {vegetable.quantity} Kg
                                </p>

                            ))}

                        </div>

                        <button className="edit-btn" onClick={() => router.push(`/farmer/dashboard/edit-packet/${packet.id}`)}>Edit</button>
                        <button className="delete-btn" onClick={() => handledelete(packet.id)}>Delete</button>
                    </div>

                </div>

            ))}

        </div>
    );
} export default page;