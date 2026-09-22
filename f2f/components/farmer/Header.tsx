
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Header.css";
import { useEffect, useState } from "react";
import axios from "axios";



function header() {
    const router = useRouter();
    const [farmername, setFarmername] = useState("");
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

            setFarmername(res.data.name);

        }
        catch (err) {

            console.log(err);

        }

    };
    useEffect(() => {

        fetchProfile();

        window.addEventListener("profileUpdated", fetchProfile);

        return () => {

            window.removeEventListener(
                "profileUpdated",
                fetchProfile
            );

        };

    }, []);

    
    const logout = () => {
        localStorage.removeItem("token");
        router.push("/");
    }

    return (
        <header className="header">

            <div className="logo">
                🌾 Farm2Family
            </div>
            <div className="greeting">
                Welcome , <b>{farmername}</b>
            </div>
            <div className="header-right">
                <Link href="/farmer/dashboard/profile">
                    <button className="profile-btn">
                        👤Profile
                    </button>
                </Link>
                <button onClick={logout} className="logout-btn">Logout

                </button>
            </div>

        </header>
    );
} export default header;