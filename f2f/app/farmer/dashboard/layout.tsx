import Header from "@/components/farmer/Header";
import Navbar from "@/components/farmer/Navbar";
import "./dashboard.css"

 function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Navbar />
      <>
    {children}

    <section className="dashboard-extra">
        <div className="dashboard-grid">
            <div className="extra-card">
                <h2>📦</h2><h3>Total Listings</h3>
                <p>Manage all your vegetable baskets from one place.</p>
            </div>

            <div className="extra-card">
                <h2>🛒</h2><h3>Recent Orders</h3>
                <p>Track incoming customer orders easily.</p>
            </div>

            <div className="extra-card">
                <h2>💰</h2><h3>Total Earnings</h3>
                <p>View your earnings and sales summary.</p>
            </div>

            <div className="extra-card">
                <h2>⭐</h2><h3>Top Quality</h3>
                <p>Fresh vegetables build customer trust.</p>
            </div>

            <div className="extra-card">
                <h2>🌱</h2><h3>Organic Farming</h3>
                <p>Healthy farming creates healthy families.</p>
            </div>
        </div>

        <div className="quote-card">
            <h2>🌾 Farmer's Inspiration</h2>
            <p>
                "The future belongs to those who cultivate today."
            </p>
            <span>
                — Farm2Home
            </span>
        </div>
    </section>
</>
      
    </>
  );
}
export default Layout;
