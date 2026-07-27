"use client";
console.log("Pending Farmer Page Loaded");
import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";

export default function PendingFarmers() {
    const [farmers, setFarmers] = useState<any[]>([]);

    const fetchFarmers = async () => {
        console.log("Fetch Function Called");
        try {
            const token = localStorage.getItem("adminToken");

            const res = await axios.get(
                "http://localhost:5000/admin/pending-farmers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res.data);
            setFarmers(res.data.farmers);
        } catch (err) {
            console.log(err);
        }
    };

    const verifyFarmer = async (id: number) => {
        try {
            const token = localStorage.getItem("adminToken");

            const res = await axios.put(
                `http://localhost:5000/admin/verify-farmer/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(res.data.message);

            fetchFarmers();

        } catch (err) {
            console.log(err);
            alert("Verification Failed");
        }
    };

    useEffect(() => {
        console.log("useEffect Running");
        fetchFarmers();
    }, []);

    return (
        <div className="pending-container">
            <h2>Pending Farmers</h2>

            <table className="pending-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {farmers.map((farmer) => (
                        <tr key={farmer.id}>
                            <td>{farmer.name}</td>
                            <td>{farmer.email}</td>
                            <td>{farmer.phone}</td>
                            <td>{farmer.address}</td>
                            <td>
                                <button
                                    className="verify-btn"
                                    onClick={() => verifyFarmer(farmer.id)}
                                >
                                    Verify
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}