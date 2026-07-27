"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";

export default function Subscribers() {

    const [subscribers, setSubscribers] = useState<any[]>([]);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {

        try {

            const token = localStorage.getItem("adminToken");

            const res = await axios.get(
                "http://localhost:5000/admin/subscribers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSubscribers(res.data.subscribers);

        } catch (err) {
            console.log(err);
        }

    };

    return (

        <div className="subscriber-container">

            <h2>Subscribers</h2>

            <table className="subscriber-table">

                <thead>

                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Plan</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {subscribers.map((sub) => (

                        <tr key={sub.id}>

                            <td>{sub.name}</td>

                            <td>{sub.email}</td>

                            <td>{sub.phone}</td>

                            <td>{sub.plan_name}</td>

                            <td>₹ {sub.price}</td>

                            <td>{sub.subscription_status}</td>

                            <td>

                                <Link href={`/admin/dashboard/subscribers/${sub.id}`}>

                                    <button className="view-btn">
                                        View
                                    </button>

                                </Link>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}