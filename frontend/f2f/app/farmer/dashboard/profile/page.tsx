"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./prfile.css"

type Farmer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    apin: string;
};

export default function Page() {

    const [farmer, setFarmer] = useState<Farmer | null>(null);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:5000/farmer/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setFarmer(res.data);

            }
            catch (err) {
                console.log(err);
            }

        };

        fetchProfile();

    }, []);

    if (!farmer) {
        return <h2>Loading...</h2>;
    }
return(
    <div className="profile-container">

    <div className="profile-card">

        <div className="profile-header">

            <div className="profile-avatar">
                👨‍🌾
            </div>

            <h1>{farmer.name}</h1>

            <p>
                kjwecjwcjw kjwnfjnwjoef Welcome to your Farm2Home Farmer Dashboard ,
            </p>

        </div>

        <div className="profile-body">

            <div className="profile-info">

                <div className="info-box">
                    <div className="info-title">Email</div>
                    <div className="info-value">
                        {farmer.email}
                    </div>
                </div>

                <div className="info-box">
                    <div className="info-title">Phone</div>
                    <div className="info-value">
                        {farmer.phone}
                    </div>
                </div>

                <div className="info-box">
                    <div className="info-title">Address</div>
                    <div className="info-value">
                        {farmer.address}
                    </div>
                </div>

                <div className="info-box">
                    <div className="info-title">APIN Code</div>
                    <div className="info-value">
                        {farmer.apin}
                    </div>
                </div>

            </div>

            <div className="profile-footer">

                <button className="edit-btn">
                    ✏️ Edit Profile
                </button>

            </div>

            <div className="quote">

                🌱 <b>Growing fresh food, building healthy families.</b>
                <br/>
                Thank you for being a valuable farmer in the Farm2Home community.

            </div>

        </div>

    </div>

</div>
);
}