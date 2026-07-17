"use client";
import "./page.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function page() {
    const [orders, setOrders] = useState<any[]>([]);

    const handleorder = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("http://localhost:5000/fetch/farmer-order",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                }


            );
            setOrders(res.data);
        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        handleorder();
    }, []);



    // ye function orders m order_status update k liye function h 
    const updateStatus = async (
        orderId: number,
        status: string) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                "http://localhost:5000/orders/update-status",

                {
                    order_id: orderId,
                    status: status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert(res.data.message);
            handleorder();
        }
        catch (err) {
            console.log(err);
            alert("Status update failed");
        }
    };
    return (
        <div>
            <div className="order-header"><h1>Customer Order</h1><p>Manage all orders placed for your vegetable baskets.</p></div>
            <div className="order-grid">
                {
                    orders.length === 0 ? (
                        <h2 style={{
                            width: "100%",
                            textAlign: "center",
                            color: "#777"
                        }}>No Order Found</h2>
                    ) : (
                        orders.map((order: any) => (
                            <div className="order-card" key={order.id}>
                                <img src={`http://localhost:5000/uploads/${order.image}`}
                                    alt={order.listing_title}
                                    className="order-image" />

                                <div className="order-info">
                                    <h2>{order.listing_title}</h2>
                                    <h3>👤 {order.name}</h3>
                                    <div className="details">
                                        <p><b>Phone :</b>{order.phone}</p>
                                        <p><b>Address :</b>{order.address}</p>
                                        <p><b>Basket :</b>{order.basket_size} Kg</p>
                                    </div>
                                    <div className="vegetables">
                                        <h4>🥕 Included Vegetables</h4>
                                        {
                                            order.vegetables.map(
                                                (
                                                    veg: any,
                                                    index: number
                                                ) => (
                                                    <p key={index}>
                                                        • {veg.vegetable_name}
                                                        {" "}
                                                        ({veg.quantity} Kg)
                                                    </p>
                                                )
                                            )
                                        }
                                    </div>
                                    <div className="price"> ₹ {order.price}</div>
                                    <div className="status-box">
                                        <p>💳 <b>Payment :</b> {order.payment_status} </p>
                                        <p>🚚 <b>Status :</b> {order.order_status}</p>
                                        <p>📅 <b>Date :</b> {new Date(order.ordered_at).toLocaleDateString()}</p>

                                    </div>
                                    {order.order_status === "Delivered" ? (<div className="completed-box">🟢 Order Completed</div>)
                                                                             : order.order_status === "Cancelled" ?
                                                                              (<div className="cancelled-box">🔴 Order Cancelled</div>) : 
                                        (

                                            <div className="button-group">

                                                <button
                                                    className="accept-btn"
                                                    disabled={order.order_status !== "Pending"}
                                                    onClick={() => updateStatus(order.id, "Accepted")}
                                                >✔ Accept
                                                </button>

                                                <button
                                                    className="packed-btn"
                                                    disabled={order.order_status !== "Accepted"}
                                                    onClick={() => updateStatus(order.id, "Packed")}
                                                >📦 Packed
                                                </button>

                                                <button
                                                    className="delivery-btn"
                                                    disabled={order.order_status !== "Packed"}
                                                    onClick={() => updateStatus(order.id, "Out For Delivery")}
                                                >🚚 Out For Delivery
                                                </button>

                                                <button
                                                    className="done-btn"
                                                    disabled={order.order_status !== "Out For Delivery"}
                                                    onClick={() => updateStatus(order.id, "Delivered")}
                                                >✅ Delivered
                                                </button>

                                            </div>

                                        )
                                    }
                                </div>
                            </div>
                        ))
                    )
                }

            </div>

        </div>
    );
}