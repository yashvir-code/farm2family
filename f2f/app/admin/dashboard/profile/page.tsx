"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";

export default function Profile() {

    const [admin, setAdmin] = useState<any>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {

        try {

            const token = localStorage.getItem("adminToken");

            const res = await axios.get(
                "http://localhost:5000/admin/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAdmin(res.data.admin);

        } catch (err) {
            console.log(err);
        }

    };

    if (!admin) {
        return <h2>Loading...</h2>;
    }

    return (

        <div className="profile-container">

            <div className="profile-card">

                <div className="profile-image">
                    👨‍💼
                </div>

                <h2>Admin Profile</h2>

                <div className="profile-info">

                    <p>
                        <strong>ID :</strong> {admin.id}
                    </p>

                    <p>
                        <strong>Name :</strong> {admin.name}
                    </p>

                    <p>
                        <strong>Email :</strong> {admin.email}
                    </p>

                </div>

            </div>

        </div>

    );

}