"use client";
import FarmerLogin from "@/comp/form/farmerlogin";
import FarmerRegister from "@/comp/form/farmerregister";
import CustomerLogin from "@/comp/form/customerlogin";
import CustomerRegister from "@/comp/form/customerregister";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [activeForm, setActiveForm] = useState("");
  return (
    <>

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <Image
              src="/logo.jpeg"
              alt="Farm2Family"
              width={50}
              height={50}
            />
            <span className="ms-2 fw-bold text-success fs-4">
              Farm2Family
            </span>
          </a>

          <div className="d-flex gap-2">

            <button
              className="btn btn-outline-success"
              onClick={() => setActiveForm("farmerLogin")}
            >
              Farmer Login
            </button>

            <button
              className="btn btn-success"
              onClick={() => setActiveForm("customerLogin")}
            >
              Customer Login
            </button>

          </div>
        </div>
      </nav>


      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="display-4 fw-bold">
              Connecting Farmers Directly With Customers
            </h1>

            <p className="lead text-muted mt-3">
              Buy fresh products directly from farmers and help them earn
              better profits without middlemen.
            </p>

            <div className="mt-4 d-flex flex-wrap gap-3">
              <button
                className="btn btn-success btn-lg"
                onClick={() => setActiveForm("farmerRegister")}
              >
                Register as Farmer
              </button>

              <button
                className="btn btn-primary btn-lg"
                onClick={() => setActiveForm("customerRegister")}
              >
                Register as Customer
              </button>
            </div>
          </div>
          <div className="col-md-6 text-center">

            {activeForm === "" && (
              <Image
                src="/far.jpg"
                alt="Farmer"
                width={600}
                height={500}
                className="img-fluid rounded"
                style={{ width: "100%", height: "auto" }}
                priority
              />
            )}

            {activeForm === "farmerLogin" && (
              <FarmerLogin
                onRegister={() => setActiveForm("farmerRegister")}
              />
            )}

            {activeForm === "farmerRegister" && (
              <FarmerRegister
                onLogin={() => setActiveForm("farmerLogin")}
              />
            )}

            {activeForm === "customerLogin" && (
              <CustomerLogin
                onRegister={() => setActiveForm("customerRegister")}
              />
            )}

            {activeForm === "customerRegister" && (
              <CustomerRegister
                onLogin={() => setActiveForm("customerLogin")}
              />
            )}

          </div>
        </div>
      </section>


      <section className="container py-5">
        <h2 className="text-center mb-5">Why Choose Farm2Family?</h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h4>🚜 Direct Selling</h4>
                <p>
                  Farmers can sell products directly without middlemen.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h4>🛒 Easy Ordering</h4>
                <p>
                  Customers can browse and order fresh products online.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h4> Better Earnings</h4>
                <p>
                  Fair pricing ensures better income for farmers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-light py-5">
        <div className="container text-center">
          <h2>How It Works</h2>

          <div className="row mt-5">
            <div className="col-md-3">
              <h4>1️ Register</h4>
              <p>Create your account.</p>
            </div>

            <div className="col-md-3">
              <h4>2 Add Products</h4>
              <p>Farmers list their products.</p>
            </div>

            <div className="col-md-3">
              <h4>3️ Place Orders</h4>
              <p>Customers purchase fresh products.</p>
            </div>

            <div className="col-md-3">
              <h4>4️ Delivery</h4>
              <p>Products delivered to customers.</p>
            </div>
          </div>
        </div>
      </section>


      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <h4>Farm2Family</h4>

          <p>
            Connecting Farmers and Customers through technology.
          </p>

          <p className="mb-0">
            © 2026 Farm2Family. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}