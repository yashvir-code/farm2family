"use client";

import "./page.css";

type DashboardCardProps = {
    title: string;
    value: number;
};

function DashboardCard({ title, value }: DashboardCardProps) {

    return (

        <div className="dashboard-card">

            <h3>{title}</h3>

            <h1>{value}</h1>

        </div>

    );

}

export default DashboardCard;