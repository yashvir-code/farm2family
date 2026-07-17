"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "15px 30px",
        backgroundColor: "#4CAF50",
      }}
    >
      <Link href="/farmer/dashboard" style={{ color: "white", textDecoration: "none" }}>
       🏠Home
      </Link>

      <Link href="/farmer/dashboard/add-packet" style={{ color: "white", textDecoration: "none" }}>
        ➕Add Packet
      </Link>

      <Link href="/farmer/dashboard/my-packet" style={{ color: "white", textDecoration: "none" }}>
        📦My Packet
      </Link>

      <Link href="/farmer/dashboard/orders" style={{ color: "white", textDecoration: "none" }}>
        🛒Orders
      </Link>

      <Link href="/farmer/dashboard/earnings" style={{ color: "white", textDecoration: "none" }}>
        💰Earnings
      </Link>
    </nav>
  );
}