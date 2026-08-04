"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";
import { useRouter } from "next/navigation";

export default function MembershipPlan() {

    const [plans, setPlans] = useState<any[]>([]);
    const router = useRouter();

    const fetchPlans = async () => {
        try {

            const res = await axios.get(
                "http://localhost:5000/membership/plans"
            );

            setPlans(res.data.plans);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);


    const handleBuyPlan = async (planId: number) => {

        const confirmBuy = window.confirm(
            "Do you want to purchase this membership?"
        );

        if (!confirmBuy) return;

        try {

            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:5000/membership/buy-plan",
                {
                    planId: planId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(res.data.message);

        } catch (err: any) {

            console.log(err);

            alert(
                err.response?.data?.message || "Something went wrong"
            );

        }

    };

    return (
        <div className="membership-container">

            <h1>Membership Plans</h1>

            <div className="plan-grid">

                {plans.map((plan) => (

                    <div className="plan-card" key={plan.id}>

                        <h2>{plan.plan_name}</h2>

                        <h3>₹ {plan.price}</h3>

                        <p><b>Duration :</b> {plan.duration}</p>

                        <p>{plan.description}</p>

                        <button
                            className="buy-btn"
                            onClick={() =>
                                router.push(`/customer/dashboard_cust/payment?planId=${plan.id}`)
                            }
                        >
                            Buy Plan
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}