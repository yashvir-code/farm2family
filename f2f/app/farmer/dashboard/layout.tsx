import Header from "@/components/farmer/Header";
import Navbar from "@/components/farmer/Navbar";
import "./dashboard.css";


function Layout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (

    <>

      <Header />

      <Navbar />


      <main className="farmer-dashboard-content">

        {children}

      </main>


    </>

  );

}


export default Layout;