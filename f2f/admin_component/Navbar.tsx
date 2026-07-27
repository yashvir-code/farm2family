"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import "./page.css";

export default function Navbar() {

    const router = useRouter();

    const handleLogout = () => {

        localStorage.removeItem("adminToken");

        router.push("/admin/login");

    };

    return (

        <aside className="admin-navbar">

            <ul>

                <li>
                    <Link href="/admin/dashboard">Dashboard</Link>
                </li>

                <li>
                    <Link href="/admin/dashboard/pending-farmers">
                        Pending Farmers
                    </Link>
                </li>

                <li>
                    <Link href="/admin/dashboard/verified-farmers">
                        Verified Farmers
                    </Link>
                </li>

                <li>
                    <Link href="/admin/dashboard/membership">
                        Membership
                    </Link>
                </li>

                <li>
                    <Link href="/admin/dashboard/subscribers">
                        Subscribers
                    </Link>
                </li>

                <li>
                    <Link href="/admin/dashboard/profile">
                        Profile
                    </Link>
                </li>

                <li>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </li>

            </ul>

        </aside>

    );

}