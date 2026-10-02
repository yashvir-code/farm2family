// "use client";

// import axios from "axios";
// import { useEffect, useState } from "react";
// import "./page.css";
// import { useRouter } from "next/navigation";

// export default function MembershipPlan() {

//     const [plans, setPlans] = useState<any[]>([]);
//     const router = useRouter();

//     const fetchPlans = async () => {
//         try {

//             const res = await axios.get(
//                 "http://localhost:5000/membership/plans"
//             );

//             setPlans(res.data.plans);

//         } catch (err) {
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         fetchPlans();
//     }, []);


//     const handleBuyPlan = async (planId: number) => {

//         const confirmBuy = window.confirm(
//             "Do you want to purchase this membership?"
//         );

//         if (!confirmBuy) return;

//         try {

//             const token = localStorage.getItem("token");

//             const res = await axios.post(
//                 "http://localhost:5000/membership/buy-plan",
//                 {
//                     planId: planId
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             alert(res.data.message);

//         } catch (err: any) {

//             console.log(err);

//             alert(
//                 err.response?.data?.message || "Something went wrong"
//             );

//         }

//     };

//     return (
//         <div className="membership-container">

//             <h1>Membership Plans</h1>

//             <div className="plan-grid">

//                 {plans.map((plan) => (

//                     <div className="plan-card" key={plan.id}>

//                         <h2>{plan.plan_name}</h2>

//                         <h3>₹ {plan.price}</h3>

//                         <p><b>Duration :</b> {plan.duration}</p>

//                         <p>{plan.description}</p>

//                         <button
//                             className="buy-btn"
//                             onClick={() =>
//                                 router.push(`/customer/dashboard_cust/payment?planId=${plan.id}`)
//                             }
//                         >
//                             Buy Plan
//                         </button>

//                     </div>

//                 ))}

//             </div>

//         </div>
//     );
// }

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";
import { useRouter } from "next/navigation";

export default function MembershipPlan() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchPlans = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/membership/plans"
            );

            setPlans(res.data.plans || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleBuyPlan = (planId: number) => {
        router.push(
            `/customer/dashboard_cust/membership-payment?planId=${planId}`
        );
    };

    return (
        <div className="membership-page">

            {/* HERO */}
            <section className="membership-hero">
                <div className="hero-content">

                    <span className="hero-tag">
                        🌱 Farm2Family Membership
                    </span>

                    <h1>
                        Grow With Your
                        <span> Farm Family</span>
                    </h1>

                    <p>
                        Choose a membership plan and enjoy a better connection
                        with local farmers, fresh organic produce and the
                        Farm2Family community.
                    </p>

                    <div className="hero-points">
                        <span>🌿 Fresh Produce</span>
                        <span>🚜 Farmer Support</span>
                        <span>🏡 Community Benefits</span>
                    </div>

                </div>

                <div className="hero-visual">
                    <div className="hero-circle">
                        🌱
                    </div>

                    <div className="floating-card card-one">
                        🥕 Fresh
                    </div>

                    <div className="floating-card card-two">
                        ❤️ Community
                    </div>
                </div>
            </section>


            {/* PLANS */}
            <section className="plans-section">

                <div className="section-heading">

                    <span>OUR MEMBERSHIP</span>

                    <h2>
                        Choose Your Membership Plan
                    </h2>

                    <p>
                        Select the plan that works best for your family.
                        You can securely pay through Razorpay.
                    </p>

                </div>

                {loading ? (

                    <div className="loading-box">
                        <div className="loader"></div>
                        <p>Loading membership plans...</p>
                    </div>

                ) : plans.length === 0 ? (

                    <div className="empty-box">
                        <div>🌱</div>
                        <h3>No Membership Plans Available</h3>
                        <p>
                            Membership plans will be available soon.
                        </p>
                    </div>

                ) : (

                    <div className="plan-grid">

                        {plans.map((plan, index) => (

                            <div
                                className={`plan-card ${
                                    index === 1 ? "popular-plan" : ""
                                }`}
                                key={plan.id}
                            >

                                {index === 1 && (
                                    <div className="popular-badge">
                                        ⭐ Popular
                                    </div>
                                )}

                                <div className="plan-icon">
                                    {index === 0
                                        ? "🌱"
                                        : index === 1
                                        ? "🌿"
                                        : "🌾"}
                                </div>

                                <h3 className="plan-name">
                                    {plan.plan_name}
                                </h3>

                                <div className="plan-price">
                                    <span>₹</span>
                                    {plan.price}
                                </div>

                                <div className="plan-duration">
                                    ⏱ {plan.duration} Days
                                </div>

                                <p className="plan-description">
                                    {plan.description}
                                </p>

                                <div className="plan-features">

                                    <div>
                                        <span>✓</span>
                                        Farm2Family Community
                                    </div>

                                    <div>
                                        <span>✓</span>
                                        Organic Farming Support
                                    </div>

                                    <div>
                                        <span>✓</span>
                                        Secure Online Payment
                                    </div>

                                </div>

                                <button
                                    className="buy-btn"
                                    onClick={() =>
                                        handleBuyPlan(plan.id)
                                    }
                                >
                                    Choose This Plan
                                    <span>→</span>
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* WHY MEMBERSHIP */}
            <section className="benefits-section">

                <div className="section-heading">

                    <span>MEMBERSHIP BENEFITS</span>

                    <h2>
                        More Than Just A Subscription
                    </h2>

                    <p>
                        Your membership helps create a stronger connection
                        between farmers and families.
                    </p>

                </div>

                <div className="benefits-grid">

                    <div className="benefit-card">
                        <div className="benefit-icon">🌿</div>
                        <h3>Fresh & Natural</h3>
                        <p>
                            Get closer to naturally grown vegetables and
                            fresh farm produce.
                        </p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon">🚜</div>
                        <h3>Support Farmers</h3>
                        <p>
                            Your participation helps build a direct
                            relationship between farmers and families.
                        </p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon">🏡</div>
                        <h3>Family Community</h3>
                        <p>
                            Become part of a growing community that values
                            healthy food and local farming.
                        </p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon">⭐</div>
                        <h3>Member Experience</h3>
                        <p>
                            Enjoy the benefits and experiences designed
                            especially for Farm2Family members.
                        </p>
                    </div>

                </div>

            </section>


            {/* HOW IT WORKS */}
            <section className="steps-section">

                <div className="section-heading">

                    <span>SIMPLE PROCESS</span>

                    <h2>
                        How Membership Works
                    </h2>

                </div>

                <div className="steps-grid">

                    <div className="step-card">
                        <div className="step-number">01</div>
                        <div className="step-icon">📋</div>
                        <h3>Choose A Plan</h3>
                        <p>
                            Select the membership plan that suits your
                            family.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">02</div>
                        <div className="step-icon">💳</div>
                        <h3>Secure Payment</h3>
                        <p>
                            Complete your membership payment securely
                            through Razorpay.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">03</div>
                        <div className="step-icon">🌱</div>
                        <h3>Become A Member</h3>
                        <p>
                            Your membership gets activated after successful
                            payment verification.
                        </p>
                    </div>

                </div>

            </section>


            {/* CTA */}
            <section className="membership-cta">

                <div>

                    <span>🌾 FARM2FAMILY</span>

                    <h2>
                        Be A Part Of Better Farming
                    </h2>

                    <p>
                        Support farmers, discover fresh produce and grow
                        together with the Farm2Family community.
                    </p>

                </div>

                <button
                    onClick={() =>
                        document
                            .querySelector(".plans-section")
                            ?.scrollIntoView({
                                behavior: "smooth"
                            })
                    }
                >
                    View Membership Plans →
                </button>

            </section>

        </div>
    );
}