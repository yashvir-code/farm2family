"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./page.css";

export default function PaymentPage() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const planId = searchParams.get("planId");

    const [plan, setPlan] = useState<any>(null);

    const [cardNumber, setCardNumber] = useState("");
    const [holderName, setHolderName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        fetchPlan();

    }, []);

    const fetchPlan = async () => {

        try {

            const res = await axios.get(
                `http://localhost:5000/membership/plan/${planId}`
            );

            setPlan(res.data.plan);

        }

        catch (err) {

            console.log(err);

        }

    };

    const handlePayment = async () => {

        if (
            !cardNumber ||
            !holderName ||
            !expiry ||
            !cvv
        ) {

            alert("Please fill all payment details.");

            return;

        }

        setLoading(true);

        setTimeout(async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await axios.post(

                    "http://localhost:5000/membership/buy-plan",

                    {
                        planId: plan.id
                    },

                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }

                );

                alert(res.data.message);

                router.push(
                    `/customer/dashboard_cust/payment-success?amount=${plan.price}&plan=${plan.plan_name}`
                );

            }

            catch (err: any) {

                alert(

                    err.response?.data?.message ||

                    "Payment Failed"

                );

            }

            setLoading(false);

        }, 2000);

    };

    if (!plan) {

        return <h2>Loading...</h2>

    }

    return (

        <div className="payment-container">

            <div className="payment-card">

                <h1>💳 Membership Payment</h1>

                <div className="plan-box">

                    <h2>{plan.plan_name}</h2>

                    <h3>₹ {plan.price}</h3>

                    <p>{plan.duration} Days</p>

                    <p>{plan.description}</p>

                </div>

                <input
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                />

                <input
                    placeholder="Card Holder Name"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                />

                <input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                />

                <input
                    placeholder="CVV"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                />

                <button
                    onClick={handlePayment}
                    disabled={loading}
                >

                    {
                        loading
                            ?
                            "Processing Payment..."
                            :
                            `Pay ₹${plan.price}`
                    }

                </button>

            </div>

        </div>

    );

}