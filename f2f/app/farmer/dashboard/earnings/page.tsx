"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";

export default function page() {

    const [data, setData] = useState({
        totalorders: 0,
        totalearning: 0,
        deliveredorders: 0,
        pendingorders: 0
    });

    const fetchdata = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("http://localhost:5000/fetch/farmer-earnings",
                {
                    headers:
                    {
                        Authorization: `Bearear ${token}`
                    }
                }
            );
            console.log(res.data);
            setData(res.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);

    

    return (
        <div className="earnings-page">

    <h1 className="earnings-title">
        💰 Farmer Earnings
    </h1>

    <p className="earnings-subtitle">
        Overview of your sales and earnings.
    </p>

    <div className="stats-grid">

        <div className="stat-card earnings-card">

            <div className="stat-icon">💰</div>

            <div className="stat-title">
                Total Earnings
            </div>

            <div className="stat-value">
                ₹ {data.totalearning}
            </div>

        </div>

        <div className="stat-card orders-card">

            <div className="stat-icon">📦</div>

            <div className="stat-title">
                Total Orders
            </div>

            <div className="stat-value">
                {data.totalorders}
            </div>

        </div>

        <div className="stat-card delivered-card">

            <div className="stat-icon">🚚</div>

            <div className="stat-title">
                Delivered Orders
            </div>

            <div className="stat-value">
                {data.deliveredorders}
            </div>

        </div>

        <div className="stat-card pending-card">

            <div className="stat-icon">⏳</div>

            <div className="stat-title">
                Pending Orders
            </div>

            <div className="stat-value">
                {data.pendingorders}
            </div>

        </div>

    </div>

</div>
    );
}