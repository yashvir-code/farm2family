"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";

function page() {
    const [search, setSearch] = useState("");
    const [packets, setPackets] = useState<any[]>([]);
    const [filteredpackets, setFilteredpackets] = useState<any[]>([]);

    const handlefatch = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/fetch/all-packets",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(res.data);
            setPackets(res.data);
            setFilteredpackets(res.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handlefatch();
    }, []);


    const handleBuy = async (packetId: number) => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:5000/orders/place-order",

                {
                    packet_id: packetId
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(res.data.message);

        }
        catch (err: any) {

            console.log(err);

            alert(
                err.response?.data?.message || "Order Failed"
            );

        }

    };

    useEffect(() => {
        if (search.trim() === " ") {
            setFilteredpackets(packets);
            return;
        }
        const filtered = packets.filter((packet: any) =>
            packet.vegetable.some((veg: any) =>
                veg.vegetable_name.toLowerCase().includes(search.trim().toLowerCase())
            )
        );
        setFilteredpackets(filtered);
    }, [search, packets])

    return (
        <div className="browse-container">
            <div className="browse-header">
                <h1>🧺 Browse Fresh Baskets</h1>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Search vegetables..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <p>
                    Fresh vegetables directly from trusted farmers.
                    Healthy • Organic • Affordable
                </p>
            </div>
            <div className="packet-grid">

                {
                    filteredpackets.length === 0 ? (

                        <h2
                            style={{
                                textAlign: "center", width: "100%", color: "#666"
                            }}
                        >No basket found.</h2>

                    ) : (

                        filteredpackets.map((packet: any) => (
                            <div
                                className="packet-card"
                                key={packet.id}
                            >
                                <img
                                    src={`http://localhost:5000/uploads/${packet.image}`}
                                    alt={packet.listing_title}
                                    className="packet-image"
                                />
                                <div className="packet-info">
                                    <h2>{packet.listing_title}</h2>
                                    <h3>🌾 {packet.farmname}</h3>
                                    <div className="details">
                                        <p>
                                            📦 <b>Basket :</b>  {packet.basket_size} Kg
                                        </p>
                                        <p>
                                            📍 <b>Address :</b> {packet.farm_address}
                                        </p>
                                        <p>
                                            📮 <b>Pincode :</b>{packet.pincode}
                                        </p>
                                        <p>
                                            🌿 <b>Organic :</b> {packet.organic}
                                        </p>
                                    </div>
                                    <div className="vegetables">
                                        <h4>
                                            🥕 Included Vegetables
                                        </h4>
                                        {packet.vegetable.map(
                                            (
                                                veg: any,
                                                index: number
                                            ) => (
                                                <p key={index}>
                                                    • {veg.vegetable_name}
                                                    {" "}
                                                    ({veg.quantity} Kg)
                                                </p>
                                            )
                                        )}
                                    </div>
                                    <div className="card-footer">
                                        <div className="price"> ₹ {packet.price} </div>
                                        <button
                                            className="buy-btn"
                                            onClick={() => handleBuy(packet.id)}
                                        >
                                            🛒 Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                        ))

                    )
                }

            </div>

        </div>
    );
} export default page;