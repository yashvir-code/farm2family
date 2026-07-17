"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";

export default function Page() {

    const [orders, setOrders] = useState<any[]>([]);

    const fetchOrders = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/fetch/my-order",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(res.data);

            setOrders(res.data);

        }
        catch (err) {

            console.log(err);

        }

    };

    const cancelorder = async (orderId: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put("http://localhost:5000/orders/cancel-order",
                {
                    order_id: orderId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );
            alert(res.data.message);
            fetchOrders();
        }
        catch (err: any) {
            console.log(err);
            ({ message: "cancled failed" })
        }
    };

    useEffect(() => {

        fetchOrders();

    }, []);
    return (
        <div className="orders-container">

            <h1 className="orders-title">
                📦 My Orders
            </h1>

            <p className="orders-subtitle">
                Track all your vegetable basket orders.
            </p>

            <div className="orders-grid">

                {
                    orders.length === 0 ?

                        (
                            <h2 className="empty-order">
                                No Orders Found 😔
                            </h2>
                        )

                        :

                        (
                            orders.map((order: any) => (

                                <div
                                    className="order-card"
                                    key={order.id}
                                >

                                    <img
                                        src={`http://localhost:5000/uploads/${order.image}`}
                                        className="order-image"
                                        alt={order.listing_title}
                                    />

                                    <div className="order-info">

                                        <h2>
                                            {order.listing_title}
                                        </h2>

                                        <p>
                                            🌾 <b>Farm :</b> {order.farmname}
                                        </p>

                                        <p>
                                            📦 <b>Basket :</b> {order.basket_size} Kg
                                        </p>

                                        <p>
                                            💰 <b>Price :</b> ₹ {order.price}
                                        </p>

                                        <p>
                                            🚚 <b>Status :</b>

                                            <span className="status">
                                                {order.order_status}
                                            </span>

                                        </p>
                                        {
                                            order.order_status === "Pending" ? (

                                                <button
                                                    className="cancel-btn"
                                                    onClick={() => cancelorder(order.id)}
                                                >
                                                    ❌ Cancel Order
                                                </button>

                                            ) : order.order_status === "Cancelled" ? (

                                                <div className="cancelled-box">
                                                    🔴 Order Cancelled
                                                </div>

                                            ) : null
                                        }

                                        <p>
                                            💳 <b>Payment :</b>

                                            <span className="payment">
                                                {order.payment_status}
                                            </span>

                                        </p>

                                        <p>
                                            🏠 <b>Delivery Address :</b>

                                            {order.delivery_address}
                                        </p>

                                        <p>
                                            📅 <b>Ordered :</b>

                                            {
                                                new Date(
                                                    order.ordered_at
                                                ).toLocaleDateString()
                                            }

                                        </p>

                                        <button
                                            className="cancel-btn"
                                        >
                                            Cancel Order
                                        </button>

                                    </div>

                                </div>

                            ))
                        )

                }

            </div>

        </div>
    );

}