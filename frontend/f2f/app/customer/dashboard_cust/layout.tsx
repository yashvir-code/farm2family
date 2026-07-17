"use client";
import Header from "@/Custo_compo/customer/Header";
import Navbar from "@/Custo_compo/customer/Navbar";

import "./page.css";


function Page({ children,
}: {
  children: React.ReactNode;
}) {

  return (

    <>
      <Header />
      <Navbar />
      {children}
    </>


  );
}

export default Page;    