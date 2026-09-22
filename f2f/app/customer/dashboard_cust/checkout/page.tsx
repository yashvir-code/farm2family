"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


import "./page.css";
interface CartItem {
    id: number;
    listing_title: string;
    farmname: string;
    basket_size: number | string;
    price: number | string;
    quantity: number;
    image: string;
}
interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
    areapin: string;
}

export default function Checkout() {
    const router = useRouter();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCart();
        fetchCustomer();
    }, []);

    const loadCart = (): void => {
        const savedCart = JSON.parse(
            localStorage.getItem("cart") || "[]"
        ) as CartItem[];

        if (savedCart.length === 0) {
            router.push("/customer/dashboard_cust/cart");
            return;
        }

        setCart(savedCart);
    };

    const fetchCustomer = async (): Promise<void> => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/customer/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCustomer(res.data);
        } catch (error) {
            console.log("Customer fetch error:", error);
        }
    };

    const subtotal: number = cart.reduce(
        (total: number, item: CartItem) =>
            total + Number(item.price) * Number(item.quantity),
        0
    );

    const deliveryCharge: number = cart.length > 0 ? 50 : 0;

    const total: number = subtotal + deliveryCharge;

    const totalQuantity: number = cart.reduce(
        (total: number, item: CartItem) =>
            total + Number(item.quantity),
        0
    );


    const handleRazorpayPayment = async () => {
        if (!customer) {
            alert("Customer details are not available.");
            return;
        }
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login again.");
                return;
            }

            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            // Load Razorpay
            const razorpayLoaded = await loadRazorpay();

            if (!razorpayLoaded) {
                alert("Razorpay SDK failed to load.");
                return;
            }

            // Create Razorpay Order
            const response = await axios.post(
                "http://localhost:5000/payment/create-order",
                {
                    amount: total
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const razorpayOrder = response.data.order;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Farm2Family",
                description: "Organic Vegetable Basket",
                order_id: razorpayOrder.id,

                handler: async function (paymentResponse: any) {

                    try {

                        const token = localStorage.getItem("token");

                        const verifyResponse = await axios.post(
                            "http://localhost:5000/payment/verify-payment",
                            {
                                razorpay_order_id:
                                    paymentResponse.razorpay_order_id,

                                razorpay_payment_id:
                                    paymentResponse.razorpay_payment_id,

                                razorpay_signature:
                                    paymentResponse.razorpay_signature,

                                items: cart,

                                delivery_address:
                                    customer?.address
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        if (verifyResponse.data.success) {

                            localStorage.removeItem("cart");

                            window.dispatchEvent(
                                new Event("cartUpdated")
                            );

                            alert("Payment successful!");

                            router.push(
                                "/customer/dashboard_cust/myorder"
                            );
                        }

                    } catch (error: any) {

                        console.log(
                            "Payment verification error:",
                            error
                        );

                        alert(
                            error.response?.data?.message ||
                            "Payment verification failed."
                        );
                    }
                },

                prefill: {
                    name: customer.name,
                    email: customer.email,
                    contact: customer.phone
                },

                theme: {
                    color: "#4CAF50"
                }
            };

            const paymentObject = new (window as any).Razorpay(options);

            paymentObject.open();

        } catch (error: any) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Unable to start Razorpay payment."
            );
        }
    };

    const handlePlaceOrder = async (): Promise<void> => {
        if (!customer) {
            alert("Customer details are not available.");
            return;
        }

        if (!customer.address || !customer.areapin) {
            alert("Please update your delivery address and pincode first.");
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const orderData = {
                items: cart,
                payment_method: paymentMethod,
                subtotal,
                delivery_charge: deliveryCharge,
                total_amount: total,
                delivery_address: customer.address,
                pincode: customer.areapin,
                phone: customer.phone,
            };

            if (paymentMethod === "COD") {

                const res = await axios.post(
                    "http://localhost:5000/orders/place-cod-order",
                    {
                        items: cart,
                        delivery_address: customer.address
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (res.data.success) {

                    // Clear cart
                    localStorage.removeItem("cart");

                    window.dispatchEvent(
                        new Event("cartUpdated")
                    );

                    alert(
                        `${res.data.orderCount} basket(s) ordered successfully!`
                    );

                    router.push(
                        "/customer/dashboard_cust/myorder"
                    );
                }
            }
            else if (paymentMethod === "RAZORPAY") {
                await handleRazorpayPayment();
            }
        } catch (error) {
            console.log("Order error:", error);
            alert("Unable to process your order.");
        } finally {
            setLoading(false);
        }
    };
    const loadRazorpay = (): Promise<boolean> => {
        return new Promise((resolve) => {
            const script = document.createElement("script");

            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    return (
        <div className="checkout-container">

            <div className="checkout-header">
                <h1>🛒 Checkout</h1>
                <p>
                    Complete your order with fresh organic baskets.
                </p>
            </div>

            <div className="checkout-layout">

                <div className="checkout-left">

                    <div className="checkout-card">
                        <h2>📍 Delivery Information</h2>

                        {customer ? (
                            <div className="customer-info">

                                <div className="info-row">
                                    <span>Name</span>
                                    <strong>{customer.name}</strong>
                                </div>

                                <div className="info-row">
                                    <span>Phone</span>
                                    <strong>{customer.phone}</strong>
                                </div>

                                <div className="info-row">
                                    <span>Address</span>
                                    <strong>{customer.address}</strong>
                                </div>

                                <div className="info-row">
                                    <span>Pincode</span>
                                    <strong>{customer.areapin}</strong>
                                </div>

                            </div>
                        ) : (
                            <p>Loading customer details...</p>
                        )}

                        <button
                            className="edit-address-btn"
                            onClick={() =>
                                router.push(
                                    "/customer/dashboard_cust/profile"
                                )
                            }
                        >
                            ✏️ Update Address
                        </button>
                    </div>

                    <div className="checkout-card">

                        <h2>💳 Payment Method</h2>

                        <div
                            className={`payment-option ${paymentMethod === "COD"
                                ? "selected"
                                : ""
                                }`}
                            onClick={() =>
                                setPaymentMethod("COD")
                            }
                        >
                            <div className="payment-radio">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === "COD"}
                                    onChange={() =>
                                        setPaymentMethod("COD")
                                    }
                                />
                            </div>

                            <div className="payment-content">
                                <h3>🏠 Cash on Delivery</h3>
                                <p>
                                    Pay when your organic basket is delivered.
                                </p>
                            </div>
                        </div>

                        <div
                            className={`payment-option ${paymentMethod === "RAZORPAY"
                                ? "selected"
                                : ""
                                }`}
                            onClick={() =>
                                setPaymentMethod("RAZORPAY")
                            }
                        >
                            <div className="payment-radio">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={
                                        paymentMethod === "RAZORPAY"
                                    }
                                    onChange={() =>
                                        setPaymentMethod("RAZORPAY")
                                    }
                                />
                            </div>

                            <div className="payment-content">
                                <h3>💳 Razorpay</h3>
                                <p>
                                    Pay securely using UPI, Card or Net Banking.
                                </p>
                            </div>
                        </div>

                    </div>

                    <button
                        className="back-cart-btn"
                        onClick={() =>
                            router.push(
                                "/customer/dashboard_cust/cart"
                            )
                        }
                    >
                        ← Back to Cart
                    </button>

                </div>

                <div className="checkout-right">

                    <div className="checkout-card order-summary">

                        <h2>📦 Order Summary</h2>

                        {cart.map((item: CartItem) => (
                            <div
                                className="checkout-item"
                                key={item.id}
                            >
                                <img
                                    src={`http://localhost:5000/uploads/${item.image}`}
                                    alt={item.listing_title}
                                />

                                <div className="checkout-item-details">

                                    <h3>
                                        {item.listing_title}
                                    </h3>

                                    <p>
                                        🌾 {item.farmname}
                                    </p>

                                    <p>
                                        📦 Basket:{" "}
                                        {item.basket_size} Kg
                                    </p>

                                    <p>
                                        Quantity:{" "}
                                        {item.quantity}
                                    </p>

                                    <strong>
                                        ₹{" "}
                                        {(
                                            Number(item.price) *
                                            Number(item.quantity)
                                        ).toFixed(2)}
                                    </strong>

                                </div>
                            </div>
                        ))}

                        <hr />

                        <div className="summary-row">
                            <span>Basket Items</span>
                            <span>{cart.length}</span>
                        </div>

                        <div className="summary-row">
                            <span>Total Quantity</span>
                            <span>{totalQuantity}</span>
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>
                                ₹ {subtotal.toFixed(2)}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <span>
                                ₹ {deliveryCharge.toFixed(2)}
                            </span>
                        </div>

                        <div className="summary-total">
                            <span>Total Amount</span>

                            <strong>
                                ₹ {total.toFixed(2)}
                            </strong>
                        </div>

                        <button
                            className="place-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading
                                ? "Processing..."
                                : paymentMethod === "COD"
                                    ? "🏠 Place COD Order"
                                    : "💳 Pay with Razorpay"}
                        </button>

                        <p className="secure-text">
                            🔒 Your order information is securely processed.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}