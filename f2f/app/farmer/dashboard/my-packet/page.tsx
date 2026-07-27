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
           console.log("API Response:", res.data);
console.log("Total Packets:", res.data.length);

res.data.forEach((item: any) => {
    console.log(
        "Packet ID:",
        item.id,
        "Farmer:",
        item.farmname,
        "Title:",
        item.listing_title
    );
});

setPackets(res.data);
            setPackets(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

    const handleStatus = async (
        packetId: number,
        currentStatus: string
    ) => {

        try {

            const token = localStorage.getItem("token");

            const newStatus = currentStatus === "Active" ? "Disabled" : "Active";

            const res = await axios.put(
                "http://localhost:5000/listing/change-status",
                {
                    packet_id: packetId,
                    status: newStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(res.data.message);

            handleFetch();

        } catch (err) {

            console.log(err);

        }

    };

    const checkStatus = async () => {

    const token = localStorage.getItem("token");

    const res = await axios.get(
        "http://localhost:5000/farmer/check-status",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (res.data.status !== "Verified") {
        alert("❌ Your account is not verified by Admin.");

        router.push("/farmer/dashboard");
    }

};

useEffect(() => {
    checkStatus();
}, []);

    return (
        <div className="packet-container">

            {packets.map((packet) => (

                <div
                    className={`packet-card ${packet.status === "Disabled" ? "disabled-card" : ""}`}
                    key={packet.id}
                >

                    <div
                        className={
                            packet.status === "Active"
                                ? "status-badge active"
                                : "status-badge disabled"
                        }
                    >
                        {packet.status}
                    </div>

                    <img
                        className="packet-image"
                        src={`http://localhost:5000/uploads/${packet.image}`}
                        alt={packet.listing_title}
                    />

                    <div className="packet-body">

                        <h2>{packet.listing_title}</h2>

                        <span className="farm-name">
                            🌾 {packet.farmname}
                        </span>

                        <div className="packet-details">

                            <p><strong>Basket</strong> {packet.basket_size} Kg</p>

                            <p><strong>Price</strong> ₹{packet.price}</p>

                            <p><strong>Pincode</strong> {packet.pincode}</p>

                        </div>

                        <p className="address">
                            📍 {packet.farm_address}
                        </p>

                        <div className="vegetable-box">

                            <h4>🥕 Vegetables</h4>

                            {packet.vegetable.map((vegetable: any, index: number) => (

                                <p key={index}>
                                    • {vegetable.vegetable_name} ({vegetable.quantity} Kg)
                                </p>

                            ))}

                        </div>

                        <div className="button-group">

                            <button
                                className="edit-btn"
                                onClick={() =>
                                    router.push(`/farmer/dashboard/edit-packet/${packet.id}`)
                                }
                            >
                                ✏ Edit
                            </button>

                            <button
                                className={
                                    packet.status === "Active"
                                        ? "disable-btn"
                                        : "enable-btn"
                                }
                                onClick={() =>
                                    handleStatus(packet.id, packet.status)
                                }
                            >
                                {
                                    packet.status === "Active"
                                        ? "🚫 Disable"
                                        : "✅ Enable"
                                }
                            </button>

                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
} export default page;