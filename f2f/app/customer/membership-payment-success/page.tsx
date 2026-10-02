"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "./page.css";

export default function MembershipPaymentSuccess() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const amount = searchParams.get("amount");
    const plan = searchParams.get("plan");
    const transactionId =
        searchParams.get("transactionId");

    return (
        <div className="success-container">

            <div className="success-card">

                <div className="success-icon">
                    ✓
                </div>

                <h1>
                    Payment Successful!
                </h1>

                <p className="success-message">
                    Your Farm2Family membership has been
                    successfully activated.
                </p>

                <div className="details">

                    <div className="detail-row">
                        <span>Membership Plan</span>
                        <strong>{plan}</strong>
                    </div>

                    <div className="detail-row">
                        <span>Amount Paid</span>
                        <strong>₹ {amount}</strong>
                    </div>

                    <div className="detail-row">
                        <span>Payment Status</span>
                        <strong className="paid">
                            Paid
                        </strong>
                    </div>

                    <div className="detail-row">
                        <span>Transaction ID</span>
                        <strong className="transaction">
                            {transactionId}
                        </strong>
                    </div>

                </div>

                <div className="success-note">
                    🌱 Thank you for supporting
                    organic farmers through Farm2Family.
                </div>

                <button
                    onClick={() =>
                        router.push(
                            "/customer/dashboard_cust"
                        )
                    }
                >
                    Go To Dashboard
                </button>

            </div>

        </div>
    );
}