"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import DashboardCard from "@/admin_component/DashboardCard";

export default function Dashboard() {

    const [stats, setStats] = useState({
        totalFarmers: 0,
        pendingFarmers: 0,
        verifiedFarmers: 0,
        totalSubscribers: 0
    });

    const fetchDashboard = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/admin/dashboard-stats",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStats(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        fetchDashboard();

    }, []);

    return (

        <div>

            <h1 className="dashboard-title">
                Dashboard
            </h1>

            <div className="dashboard-cards">

                <DashboardCard
                    title="Pending Farmers"
                    value={stats.pendingFarmers}
                />

                <DashboardCard
                    title="Verified Farmers"
                    value={stats.verifiedFarmers}
                />

                <DashboardCard
                    title="Subscribers"
                    value={stats.totalSubscribers}
                />

                <DashboardCard
                    title="Total Farmers"
                    value={stats.totalFarmers}
                />

            </div>

        </div>

    );

}