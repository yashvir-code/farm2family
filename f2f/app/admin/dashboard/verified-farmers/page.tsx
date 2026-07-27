"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";

export default function VerifiedFarmers() {

    const [farmers, setFarmers] = useState<any[]>([]);

    const fetchFarmers = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const res = await axios.get(
                "http://localhost:5000/admin/verified-farmers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFarmers(res.data.farmers);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, []);

    return (
        <div className="verified-container">

            <h2>Verified Farmers</h2>

            <table className="verified-table">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Joined On</th>
                    </tr>
                </thead>

                <tbody>

                    {farmers.map((farmer) => (

                        <tr key={farmer.id}>
                            <td>{farmer.name}</td>
                            <td>{farmer.email}</td>
                            <td>{farmer.phone}</td>
                            <td>{farmer.address}</td>
                            <td>{farmer.created_at}</td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}