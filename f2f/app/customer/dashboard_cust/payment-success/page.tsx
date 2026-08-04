"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "./page.css";

export default function PaymentSuccess() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const amount = searchParams.get("amount");
    const plan = searchParams.get("plan");

    const transactionId =
        "F2F" +
        Math.floor(Math.random() * 100000000);

    return (

        <div className="success-container">

            <div className="success-card">

                <div className="tick">
                    ✅
                </div>

                <h1>Payment Successful</h1>

                <p>
                    Thank you for purchasing your membership.
                </p>

                <div className="details">

                    <p>
                        <b>Plan :</b> {plan}
                    </p>

                    <p>
                        <b>Amount :</b> ₹ {amount}
                    </p>

                    <p>
                        <b>Transaction ID :</b> {transactionId}
                    </p>

                </div>

                <button
                    onClick={() =>
                        router.push("/customer/dashboard_cust")
                    }
                >
                    Go To Dashboard
                </button>

            </div>

        </div>

    );

}