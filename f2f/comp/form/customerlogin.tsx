"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./comp.css";
type Props = {
    onRegister?: () => void;
};
function page({ onRegister }: Props) {
    const router = useRouter();
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");


    const handle = async () => {
        try {
            const res = await axios.post("http://localhost:5000/customer/login", {
                email: mail,
                password: password
            });
            if (res.data && res.data.success) {
                console.log(res.data.token);
                localStorage.setItem("token", res.data.token);
                alert("data sen");
                router.push("/customer/dashboard_cust");
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="login-container customer-theme">
            <div className="login-card">
                <h2 className="login-title">Customer Login</h2>

                <input
                    className="login-input"
                    type="email"
                    placeholder="Enter Email"
                    onChange={(e) => setMail(e.target.value)}
                />

                <input
                    className="login-input"
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="login-btn customer-btn" onClick={handle}>
                    Login
                </button>

                <div className="register-text">
                    Don't have an account?{" "}
                    <button
                        className="btn btn-link p-0"
                        onClick={onRegister}
                    >
                        Register Here
                    </button>
                </div>
            </div>
        </div>
    );
} export default page;