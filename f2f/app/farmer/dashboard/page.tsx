"use client";

import "./dashboard.css";


export default function page(){


    return (

        <div className="farmer-dashboard">


            {/* HERO SECTION */}

            <section className="farmer-hero">


                <div className="farmer-content">


                    <div className="farmer-tag">

                        🚜 Welcome Farmer Partner

                    </div>



                    <h1>

                        Grow Your Farm,
                        <br />

                        <span>
                            Grow Your Future
                        </span>

                    </h1>



                    <p>

                        Manage your organic farm products,
                        connect directly with customers and
                        increase your farming income with
                        Farm2Family AI.

                    </p>



                    <div className="farmer-actions">


                        <button className="add-listing">

                            ➕ Add New Listing

                        </button>



                        <button className="view-orders">

                            🛒 View Orders

                        </button>


                    </div>
<div className="farmer-stats">


                        <div className="stat-box">

                            <h2>
                                25+
                            </h2>

                            <p>
                                Orders
                            </p>

                        </div>




                        <div className="stat-box">

                            <h2>
                                ₹50K
                            </h2>

                            <p>
                                Earnings
                            </p>

                        </div>




                        <div className="stat-box">

                            <h2>
                                10+
                            </h2>

                            <p>
                                Products
                            </p>

                        </div>


                    </div>


                </div>
                <div className="farmer-animation">


                    <div className="farm-circle">


                        <div className="farm-icon">

                            🚜

                        </div>



                        <h2>

                            Smart Farming

                        </h2>



                        <p>

                            No Middleman
                            <br/>
                            Direct Customer <br />
                            Better Income

                        </p>



                    </div>


                </div>



            </section>
            <section className="quick-section">


                <h2>
                    Farmer Dashboard
                </h2>



                <div className="quick-grid">



                    <div className="quick-card">

                        <span>
                            📦
                        </span>

                        <h3>
                            My Listings
                        </h3>

                        <p>
                            Manage your vegetable baskets.
                        </p>

                    </div>
                    <div className="quick-card">

                        <span>🛒</span>

                        <h3>Orders</h3>

                        <p>
                            Track customer orders.
                        </p>

                    </div>
                    <div className="quick-card">

                        <span>
                            💰
                        </span>

                        <h3>
                            Earnings
                        </h3>

                        <p>
                            Check your farming income.
                        </p>

                    </div>
                    <div className="quick-card">

                        <span>
                            🌱
                        </span>

                        <h3>
                            Organic Farming
                        </h3>

                        <p>
                            Build healthy food systems.
                        </p>

                    </div>
                </div>
            </section>
            <div className="farmer-quote">
                <h2>

                    🌾 Farmer's Inspiration

                </h2>
                <p>

                    "The farmer is the only person who can
                    harvest what he plants with dedication."

                </p>
                <b>
                    — Farm2Family AI
                </b>
 </div>
        </div>

    );

}