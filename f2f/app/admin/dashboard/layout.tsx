import Header from "@/admin_component/Header";
import Navbar from "@/admin_component/Navbar";
import Footer from "@/admin_component/Footer";

import "./dashboard.css";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (

        <div className="dashboard-layout">

            <Header />

            <div className="dashboard-body">

                <Navbar />

                <main className="dashboard-content">

                    {children}

                </main>

            </div>

            <Footer />

        </div>

    );

}