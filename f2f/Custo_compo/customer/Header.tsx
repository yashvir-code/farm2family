"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./page.css";

type Decodetoken = {
 id: number;
 name: string;
 email: string;
}

function Header() {
    const router = useRouter();
    const logout = () => {
        localStorage.removeItem("token");
        router.push("/");
    }

    const [user, setUser] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded: Decodetoken = jwtDecode(token);
            setUser(decoded.name)
        }
    }, [])

    return (
        <header className="header">

    <Link href="/customer/dashboard_cust" className="logo">
        <Image
            src="/logo.jpeg"
            alt="Farm2Family Logo"
            width={45}
            height={45}
        />

        <span className="logo-name">Farm2Family</span>
    </Link>

    <div className="welcome">
        Welcome, <b>{user}</b>
    </div>

    <div className="header-right">

        <Link href="/customer/dashboard_cust/profile">
            <button className="profile-btn">
                👤 Profile
            </button>
        </Link>

        <button className="logout-btn" onClick={logout}>
            Logout
        </button>

    </div>

</header>
    );
} export default Header;
