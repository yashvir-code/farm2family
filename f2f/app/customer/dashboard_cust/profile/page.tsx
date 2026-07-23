"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";


type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    areapin: string;

};

export default function page() {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [editmode, setEditmode] = useState(false);

    useEffect(() => {
        const fetchprofile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/customer/profile",

                    {
                        headers:
                        {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setCustomer(res.data);
            }

            catch (err) {
                console.log(err);
            }
        };
        fetchprofile();

    }, []);

    const handleupdate = async () => {
        if (!customer) return;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put("http://localhost:5000/customer/update-profile-cust",
                {
                    name: customer.name,
                    phone: customer.phone,
                    address: customer.address,
                    areapin: customer.areapin
                },
                {
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

    if (!customer) {
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

                    <input className="profile-name"
                        value={customer.name}
                        disabled={!editmode}
                        onChange={(e) =>
                            setCustomer({ ...customer, name: e.target.value })
                        } />

                    <p>
                        Welcome to your Farm2Home Customer Dashboard
                    </p>

                </div>

                <div className="profile-body">

                    <div className="profile-info">

                        <div className="info-box">
                            <div className="info-title">Email</div>
                            <div className="info-value">
                                {customer.email}
                            </div>
                        </div>

                        <div className="info-box">
                            <div className="info-title">Phone</div>
                            <input className="profile-input"
                                value={customer.phone}
                                disabled={!editmode}
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer, phone: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="info-box">
                            <div className="info-title">Address</div>
                            <input className="profile-input"
                                value={customer.address}
                                disabled={!editmode}
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer, address: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="info-box">
                            <div className="info-title">APIN Code</div>
                            <input className="profile-input"
                                value={customer.areapin}
                                disabled={!editmode}
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer, areapin: e.target.value
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
                        Thank you for being a valuable Customer in the Farm2Home community.

                    </div>

                </div>

            </div>

        </div>
    );
}