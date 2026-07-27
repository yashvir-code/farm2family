"use client";
import Link from "next/link";
import "./page.css";
function Navbar(){
    return(
        <nav style={{
        display: "flex",
        gap: "20px",
        padding: "15px 30px",
        backgroundColor: "#4CAF50",
      }}>

        <nav className="navbar">

    <Link href="/customer/dashboard_cust">
        🏠 Home
    </Link>

    <Link href="/customer/dashboard_cust/browse_basket">
        🛍 Browse Baskets
    </Link>

    <Link href="/customer/dashboard_cust/membership-plan">
        📦 Membership Plan
    </Link>

    <Link href="/customer/dashboard_cust/myorder">
        🛒 My Orders
    </Link>

</nav>
        
              {/* <Link href="/farmer/dashboard/earnings" style={{ color: "white", textDecoration: "none" }}>
                💰Earnings
              </Link> */}
        </nav>
        
    );
}export default Navbar;