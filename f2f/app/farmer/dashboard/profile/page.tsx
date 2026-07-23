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
    const [editmode, setEditmode] = useState(false);

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

    const handleupdate = async () => {
        if (!farmer) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put("http://localhost:5000/farmer/update-profile",
                {
                    name: farmer.name,
                    phone: farmer.phone,
                    address: farmer.address,
                    apin: farmer.apin
                }
                , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert(res.data.message);
            window.dispatchEvent(new Event("profileUpdated"));
            setEditmode(false);
        }
        catch (err) {
            console.log(err);
        }
    };

    if (!farmer) {
        return <h2>Loading...</h2>;
    }
    return (
        <div className="profile-container">

            <div className={`profile-card ${editmode ? "editing" : ""}`}>
                {
                    editmode && (
                        <div className="edit-banner">
                            ✏️ Edit Mode Enabled — You can now update your profile details.
                        </div>
                    )
                }
                <div className="profile-header">

                    <div className="profile-avatar">
                        👨‍🌾
                    </div>

                    <input
                        className="profile-name"
                        value={farmer.name}
                        disabled={!editmode}
                        onChange={(e) =>
                            setFarmer({
                                ...farmer,
                                name: e.target.value
                            })
                        }
                    />

                    <p>45yt878
                        Welcome to your Farm2Home Farmer Dashboard ,
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
                            <input
                                className="profile-input"
                                value={farmer.phone}
                                disabled={!editmode}
                                onChange={(e) =>
                                    setFarmer({
                                        ...farmer,
                                        phone: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="info-box">
                            <div className="info-title">Address</div>
                            <input
                                className="profile-input"
                                value={farmer.address}
                                disabled={!editmode}
                                onChange={(e) =>
                                    setFarmer({
                                        ...farmer,
                                        address: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="info-box">
                            <div className="info-title">APIN Code</div>
                            <input
                                className="profile-input"
                                value={farmer.apin}
                                disabled={!editmode}
                                onChange={(e) =>
                                    setFarmer({
                                        ...farmer,
                                        apin: e.target.value
                                    })
                                }
                            />
                        </div>

                    </div>

                    <div className="profile-footer">

                        {
                            !editmode ? (

                                <button
                                    className="edit-btn"
                                    onClick={() => setEditmode(true)}
                                >
                                    ✏ Edit Profile
                                </button>

                            ) : (

                                <>

                                    <button
                                        className="save-btn"
                                        onClick={handleupdate}
                                    >
                                        💾 Save
                                    </button>

                                    <button
                                        className="cancel-btn"
                                        onClick={() => setEditmode(false)}
                                    >
                                        ❌ Cancel
                                    </button>

                                </>

                            )
                        }

                    </div>

                    <div className="quote">

                        🌱 <b>Growing fresh food, building healthy families.</b>
                        <br />
                        Thank you for being a valuable farmer in the Farm2Home community.

                    </div>

                </div>

            </div>


        </div>
    );
}