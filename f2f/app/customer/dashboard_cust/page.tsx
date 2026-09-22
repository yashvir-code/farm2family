"use client";

import "./page.css";
import Link from "next/link";

export default function page(){

    return(

        <div className="customer-home">
            <section className="hero-section">
                     <div className="hero-content"><div className="tag">
                        🌱 Welcome to Farm2Family AI
                    </div>
                     <h1>
                        Fresh Food From 
                        <span> Our Farmers </span>
                        To Your Family
                    </h1>
                     <p>
                        Experience fresh, organic and chemical-free vegetables 
                        directly from trusted farmers. 
                        Eat healthy, support farmers and grow together.
                    </p>
                    <div className="hero-btns">
                       
                        <button className="explore-btn">
  <Link
    href="/customer/dashboard_cust/browse_basket"
    style={{ textDecoration: "none" , color : "black" }}
  >
    🥕 Explore Products
  </Link>
</button>



                        <button className="membership-btn">
<Link href="/customer/dashboard_cust/membership-plan" style={{ textDecoration : "none" , color:"#a46619" }}>
        ⭐ Get Membership
    </Link> 
                        </button>
                    </div>
                    <div className="stats">
                        <div className="stat-card">

                            <h2>500+</h2>
                            <p>Happy Families</p>

                        </div>
                        <div className="stat-card">

                            <h2>50+</h2>
                            <p>Organic Farmers</p>

                        </div>
                        <div className="stat-card">

                            <h2>100%</h2>
                            <p>Natural Food</p>

                        </div>
                    </div>
                </div>
                <div className="hero-circle">
                    <div className="circle-card">

                        <div className="emoji">
                            🥬
                        </div>

                        <h2>
                            Farm Fresh
                        </h2>
                        <p>
                            Directly From Soil To Your Plate
                        </p>
                    </div>
                </div>
            </section>
            <section className="features">
                <h2>
                    Why Choose Farm2Family?
                </h2>
                <div className="feature-box">
                    <div>
                        🌿
                        <h3>Organic Farming</h3>
                        <p>
                            Chemical free vegetables from trusted farms.
                        </p>
                    </div>
                    <div>
                        🚜
                        <h3>Direct Farmer Connect</h3>
                        <p>
                            Support farmers by buying directly.
                        </p>
                    </div>
                    <div>
                        🏠
                        <h3>Home Delivery</h3>
                        <p>
                            Fresh basket delivered at your doorstep.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}