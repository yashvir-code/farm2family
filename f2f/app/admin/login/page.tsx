"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./login.css";

export default function AdminLogin() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const login = async () => {

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {

            setLoading(true);

            const res = await axios.post(
                "http://localhost:5000/admin/login-admin",
                {
                    email,
                    password
                }
            );

            localStorage.setItem("adminToken", res.data.token);

            alert("Login Successful");

            router.push("/admin/dashboard");

        } catch (err: any) {

            alert(
                err?.response?.data?.message ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Admin Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <label className="show-password">

                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />

                    Show Password

                </label>

                <button onClick={login}>

                    {loading ? "Logging..." : "Login"}

                </button>

            </div>

        </div>

    );

}