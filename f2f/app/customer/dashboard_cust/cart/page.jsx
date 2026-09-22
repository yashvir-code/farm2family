"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const router = useRouter();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(savedCart);
    };

    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const increaseQuantity = (id) => {
        const updatedCart = cart.map((item) =>
            item.id === id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        updateCart(updatedCart);
    };

    const decreaseQuantity = (id) => {
        const updatedCart = cart
            .map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.quantity > 0);

        updateCart(updatedCart);
    };

    const removeItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        updateCart(updatedCart);
    };

    const clearCart = () => {
        localStorage.removeItem("cart");
        setCart([]);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const subtotal = cart.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
    );

    const deliveryCharge = cart.length > 0 ? 50 : 0;
    const total = subtotal + deliveryCharge;

    const handleCheckout = () => {
        router.push("/customer/dashboard_cust/checkout");
    };

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>🛒 Your Cart</h1>
                <p>
                    Review your organic vegetable baskets before checkout.
                </p>
            </div>

            {cart.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>

                    <h2>Your Cart is Empty</h2>

                    <p>
                        Add some fresh organic baskets to continue.
                    </p>

                    <button
                        className="browse-btn"
                        onClick={() =>
                            router.push(
                                "/customer/dashboard_cust/browse_basket"
                            )
                        }
                    >
                        🧺 Browse Baskets
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map((item) => (
                            <div className="cart-card" key={item.id}>
                                <img
                                    src={`http://localhost:5000/uploads/${item.image}`}
                                    alt={item.listing_title}
                                    className="cart-image"
                                />

                                <div className="cart-details">
                                    <h2>{item.listing_title}</h2>

                                    <h3>🌾 {item.farmname}</h3>

                                    <p>
                                        📦 <b>Basket:</b>{" "}
                                        {item.basket_size} Kg
                                    </p>

                                    <p>
                                        🌿 <b>Organic:</b>{" "}
                                        {item.organic}
                                    </p>

                                    <p>
                                        📍 <b>Address:</b>{" "}
                                        {item.farm_address}
                                    </p>

                                    <p>
                                        📮 <b>Pincode:</b>{" "}
                                        {item.pincode}
                                    </p>

                                    <div className="cart-price">
                                        ₹ {Number(item.price).toFixed(2)}
                                    </div>
                                </div>

                                <div className="cart-actions">
                                    <div className="quantity-title">
                                        Quantity
                                    </div>

                                    <div className="quantity-box">
                                        <button
                                            onClick={() =>
                                                decreaseQuantity(item.id)
                                            }
                                        >
                                            −
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() =>
                                                increaseQuantity(item.id)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="item-total">
                                        ₹{" "}
                                        {(
                                            Number(item.price) *
                                            item.quantity
                                        ).toFixed(2)}
                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() =>
                                            removeItem(item.id)
                                        }
                                    >
                                        🗑 Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            className="clear-cart-btn"
                            onClick={clearCart}
                        >
                            🗑 Clear Cart
                        </button>
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Basket Items</span>
                            <span>{cart.length}</span>
                        </div>

                        <div className="summary-row">
                            <span>Total Quantity</span>
                            <span>
                                {cart.reduce(
                                    (total, item) =>
                                        total + item.quantity,
                                    0
                                )}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹ {subtotal.toFixed(2)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <span>₹ {deliveryCharge.toFixed(2)}</span>
                        </div>

                        <hr />

                        <div className="summary-total">
                            <span>Total</span>
                            <strong>
                                ₹ {total.toFixed(2)}
                            </strong>
                        </div>

                        <button
                            className="checkout-btn"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout →
                        </button>

                        <button
                            className="continue-btn"
                            onClick={() =>
                                router.push(
                                    "/customer/dashboard_cust/browse_basket"
                                )
                            }
                        >
                            ← Continue Shopping
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}