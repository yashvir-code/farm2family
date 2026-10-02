"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./page.css";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function MembershipPayment() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const planId = searchParams.get("planId");

    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (planId) {
            fetchPlan();
        }
    }, [planId]);

    const fetchPlan = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/membership/plan/${planId}`
            );

            setPlan(res.data.plan);
        } catch (err) {
            console.log(err);
            alert("Unable to load membership plan");
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!plan) return;

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first.");
                router.push("/");
                return;
            }

            // Load Razorpay
            const razorpayLoaded = await loadRazorpay();

            if (!razorpayLoaded) {
                alert("Razorpay failed to load.");
                return;
            }

            // Create Razorpay order from backend
            const orderRes = await axios.post(
                "http://localhost:5000/membership/create-payment-order",
                {
                    planId: plan.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const order = orderRes.data.order;

            // Razorpay options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

                amount: order.amount,

                currency: order.currency,

                name: "Farm2Family",

                description: `${plan.plan_name} Membership`,

                order_id: order.id,

                handler: async function (response: any) {
                    try {
                        const verifyRes = await axios.post(
                            "http://localhost:5000/membership/verify-payment",
                            {
                                razorpay_order_id:
                                    response.razorpay_order_id,

                                razorpay_payment_id:
                                    response.razorpay_payment_id,

                                razorpay_signature:
                                    response.razorpay_signature,

                                planId: plan.id
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        if (verifyRes.data.success) {
                            router.push(
                                `/customer/dashboard_cust/membership-payment-success?amount=${plan.price}&plan=${encodeURIComponent(
                                    plan.plan_name
                                )}&transactionId=${response.razorpay_payment_id}`
                            );
                        } else {
                            alert("Payment verification failed.");
                        }
                    } catch (err: any) {
                        console.log(err);

                        alert(
                            err.response?.data?.message ||
                            "Payment verification failed."
                        );
                    }
                },

                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                },

                theme: {
                    color: "#3f7042"
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response: any) {
                console.log("Payment Failed:", response);

                alert(
                    response.error?.description ||
                    "Payment failed. Please try again."
                );

                setLoading(false);
            });

            razorpay.open();

        } catch (err: any) {
            console.log(err);

            alert(
                err.response?.data?.message ||
                "Unable to create payment order."
            );

            setLoading(false);
        }
    };

    if (!plan) {
        return (
            <div className="payment-container">
                <div className="payment-card">
                    <h2>Loading Membership Plan...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-container">

            <div className="payment-card">

                <div className="payment-header">
                    <span>🌱</span>
                    <h1>Membership Payment</h1>
                    <p>Farm2Family Membership</p>
                </div>

                <div className="plan-box">

                    <div className="plan-icon">
                        ⭐
                    </div>

                    <h2>{plan.plan_name}</h2>

                    <h3>
                        ₹ {plan.price}
                    </h3>

                    <p>
                        <b>Duration:</b>{" "}
                        {plan.duration} Days
                    </p>

                    <p>
                        {plan.description}
                    </p>

                </div>

                <div className="payment-info">

                    <div>
                        <span>💳</span>
                        <p>Secure Razorpay Payment</p>
                    </div>

                    <div>
                        <span>🔒</span>
                        <p>100% Secure Transaction</p>
                    </div>

                </div>

                <button
                    className="pay-btn"
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {loading
                        ? "Opening Payment..."
                        : `Pay ₹${plan.price}`}
                </button>

                <button
                    className="back-btn"
                    onClick={() =>
                        router.push(
                            "/customer/dashboard_cust"
                        )
                    }
                >
                    ← Back To Dashboard
                </button>

            </div>

        </div>
    );
}