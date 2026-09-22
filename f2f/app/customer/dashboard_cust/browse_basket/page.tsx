"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";
import { useRouter } from "next/navigation";

type CartItem = {
    id: number;
    listing_title: string;
    farmname: string;
    basket_size: number;
    farm_address: string;
    pincode: string;
    organic: string;
    price: number;
    image: string;
    vegetable: any[];
    quantity: number;
    farmer_id: number;
};

function page() {
    const [search, setSearch] = useState("");
    const [packets, setPackets] = useState<any[]>([]);
    const [filteredpackets, setFilteredpackets] = useState<any[]>([]);
    const [showMembershipPopup, setShowMembershipPopup] = useState(false);
    const [selectedPacket, setSelectedPacket] = useState<number | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const router = useRouter();

    const handlefatch = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/fetch/all-packets", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(res.data);
            setPackets(res.data);
            setFilteredpackets(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handlefatch();
        updateCartCount();
    }, []);

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(cart.length);
    };
const addToCart = (packet: any) => {
    try {
        const cart: CartItem[] = JSON.parse(
            localStorage.getItem("cart") || "[]"
        );

        const existingItem = cart.find(
            (item) => item.id === packet.id
        );

        if (existingItem) {
            alert("This basket is already in your cart.");
            return;
        }

        const cartItem: CartItem = {
            id: packet.id,
            listing_title: packet.listing_title,
            farmname: packet.farmname,
            basket_size: Number(packet.basket_size),
            farm_address: packet.farm_address,
            pincode: packet.pincode,
            organic: packet.organic,
            price: Number(packet.price),
            image: packet.image,
            vegetable: packet.vegetable || [],
            quantity: 1,
            farmer_id: Number(packet.farmer_id)
        };

        cart.push(cartItem);

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        updateCartCount();

        window.dispatchEvent(
            new Event("cartUpdated")
        );

        alert("Basket added to cart successfully.");

    } catch (err) {
        console.log(err);
        alert("Unable to add basket to cart.");
    }
};

    const handleBuy = async (packetId: number) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/customer/check-membership", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.data.member) {
                setSelectedPacket(packetId);
                setShowMembershipPopup(true);
                return;
            }

            const packet = packets.find(
    (item: any) => item.id === packetId
);

if (!packet) {
    alert("Basket not found.");
    return;
}

addToCart(packet);

router.push("/customer/dashboard_cust/checkout");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredpackets(packets);
            return;
        }

        const filtered = packets.filter((packet: any) =>
            packet.vegetable.some((veg: any) =>
                veg.vegetable_name.toLowerCase().includes(search.trim().toLowerCase())
            )
        );

        setFilteredpackets(filtered);
    }, [search, packets]);

    return (
        <div className="browse-container">
           <div className="browse-header">
    <div className="browse-title-row">
        <div className="browse-heading">
            <h1>🧺 Browse Fresh Baskets</h1>
            <p>
                Fresh vegetables directly from trusted farmers.
                Healthy • Organic • Affordable.
            </p>
        </div>

        <div className="search-box">
            <input
                type="text"
                placeholder="🔍 Search vegetables..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>

        <button
            className="cart-top-btn"
            onClick={() => router.push("/customer/dashboard_cust/cart")}
        >
            🛒 Cart
            {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
            )}
        </button>
    </div>
</div>

            <div className="packet-grid">
                {filteredpackets.length === 0 ? (
                    <h2 className="empty-text">
                        No Basket Found
                    </h2>
                ) : (
                    filteredpackets.map((packet: any) => (
                        <div
                            key={packet.id}
                            className={
                                packet.status === "Disabled"
                                    ? "packet-card disabled-card"
                                    : "packet-card"
                            }
                        >
                            <span
                                className={
                                    packet.status === "Active"
                                        ? "status-active"
                                        : "status-disabled"
                                }
                            >
                                {packet.status}
                            </span>

                            <img
                                src={`http://localhost:5000/uploads/${packet.image}`}
                                alt={packet.listing_title}
                                className="packet-image"
                            />

                            <div className="packet-info">
                                <h2>{packet.listing_title}</h2>

                                <h3>🌾 {packet.farmname}</h3>

                                <div className="details">
                                    <p>
                                        📦 <b>Basket :</b> {packet.basket_size} Kg
                                    </p>

                                    <p>
                                        📍 <b>Address :</b> {packet.farm_address}
                                    </p>

                                    <p>
                                        📮 <b>Pincode :</b> {packet.pincode}
                                    </p>

                                    <p>
                                        🌿 <b>Organic :</b> {packet.organic}
                                    </p>
                                </div>

                                <div className="vegetables">
                                    <h4>🥕 Included Vegetables</h4>

                                    {packet.vegetable.map((veg: any, index: number) => (
                                        <p key={index}>
                                            • {veg.vegetable_name} ({veg.quantity} Kg)
                                        </p>
                                    ))}
                                </div>

                                <div className="card-footer">
                                    <div className="price">
                                        ₹ {packet.price}
                                    </div>

                                    <div className="card-buttons">
                                        <button
                                            disabled={packet.status === "Disabled"}
                                            className={
                                                packet.status === "Active"
                                                    ? "add-cart-btn"
                                                    : "disabled-order-btn"
                                            }
                                            onClick={() => addToCart(packet)}
                                        >
                                            🛒 Add to Cart
                                        </button>

                                        <button
                                            disabled={packet.status === "Disabled"}
                                            className={
                                                packet.status === "Active"
                                                    ? "buy-btn"
                                                    : "disabled-order-btn"
                                            }
                                            onClick={() => handleBuy(packet.id)}
                                        >
                                            ⚡ Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showMembershipPopup && (
                <div className="membership-popup-overlay">
                    <div className="membership-popup">
                        <h2>🌱 Become a Farm2Family Member</h2>

                        <p>
                            Buy a membership and enjoy
                            <br /><br />
                            ✅ Exclusive Discounts
                            <br />
                            ✅ Priority Delivery
                            <br />
                            ✅ Reward Points
                            <br />
                            ✅ Seasonal Offers
                        </p>

                        <div className="popup-buttons">
                            <button
                                className="membership-btn"
                                onClick={() =>
                                    router.push(
                                        "/customer/dashboard_cust/membership-plan"
                                    )
                                }
                            >
                                Buy Membership
                            </button>

                            <button
                                className="continue-btn"
                                onClick={() => {
                                    setShowMembershipPopup(false);

                                   if (selectedPacket !== null) {
    const packet = packets.find(
        (item: any) => item.id === selectedPacket
    );

    if (!packet) {
        alert("Basket not found.");
        return;
    }

    addToCart(packet);

    router.push(
        "/customer/dashboard_cust/checkout"
    );
}
                                }}
                            >
                                Continue Without Membership
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default page;