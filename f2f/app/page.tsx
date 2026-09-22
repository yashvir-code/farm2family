"use client";

import Image from "next/image";
import { useState } from "react";

import FarmerLogin from "@/comp/form/farmerlogin";
import FarmerRegister from "@/comp/form/farmerregister";
import CustomerLogin from "@/comp/form/customerlogin";
import CustomerRegister from "@/comp/form/customerregister";

import "./globals.css";

export default function Home() {
  const [activeForm, setActiveForm] = useState("");

  return (
    <main className="farm-page">

      {/* ================= NAVBAR ================= */}
      <nav className="farm-navbar">
        <div className="farm-nav-inner">

          <div
            className="farm-logo"
            onClick={() => setActiveForm("")}
          >
            <Image
              src="/logo.jpeg"
              alt="Farm2Family"
              width={52}
              height={52}
            />

            <div>
              <h2>Farm2Family</h2>
              <span>From Our Farmers to Your Family</span>
            </div>
          </div>

          <div className="nav-buttons">
            <button
              className="nav-btn farmer-login-nav"
              onClick={() => setActiveForm("farmerLogin")}
            >
              Farmer Login
            </button>

            <button
              className="nav-btn customer-login-nav"
              onClick={() => setActiveForm("customerLogin")}
            >
              Customer Login
            </button>
          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="hero-section">

        <div className="hero-left">

          <span className="hero-tag">
            🌱 Fresh • Natural • Farm Direct
          </span>

          <h1>
            Good Food
            <br />
            Starts at the <span>Farm.</span>
          </h1>

          <p>
            Fresh vegetables directly from local farmers to your family.
            Know where your food comes from and support the people who grow it.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => setActiveForm("customerRegister")}
            >
              🛒 Join as Customer
            </button>

            <button
              className="secondary-btn"
              onClick={() => setActiveForm("farmerRegister")}
            >
              🚜 Join as Farmer
            </button>

          </div>

          <div className="hero-stats">

            <div>
              <strong>100%</strong>
              <span>Farm Fresh</span>
            </div>

            <div>
              <strong>Direct</strong>
              <span>From Farmers</span>
            </div>

            <div>
              <strong>Local</strong>
              <span>Community</span>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE IMAGE / FORM */}
        <div className="hero-right">

          {activeForm === "" && (
            <div className="hero-image-wrapper">

              <Image
                src="/images/hero-vegetables.jpg"
                alt="Fresh vegetables"
                width={750}
                height={600}
                className="hero-image"
                priority
              />

              <div className="hero-image-card">
                <span>🥬</span>
                <div>
                  <strong>Fresh from Farm</strong>
                  <small>Picked with care</small>
                </div>
              </div>

            </div>
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

      </section>


      {/* ================= INTRO ================= */}
      <section className="intro-section">

        <div className="intro-image">

          <Image
            src="/images/farm-basket.jpg"
            alt="Fresh vegetables from farm"
            width={650}
            height={500}
          />

        </div>

        <div className="intro-content">

          <span className="section-tag">
            OUR FARM TO FAMILY JOURNEY
          </span>

          <h2>
            From the people who grow it,
            <span> to the families who enjoy it.</span>
          </h2>

          <p>
            Farm2Family connects farmers and families through a simple
            farm-direct marketplace.
          </p>

          <div className="intro-points">

            <div>
              <span>🌱</span>
              <div>
                <h4>Fresh Produce</h4>
                <p>Fresh vegetables from local farms.</p>
              </div>
            </div>

            <div>
              <span>🤝</span>
              <div>
                <h4>Direct Connection</h4>
                <p>Buy directly from the people who grow your food.</p>
              </div>
            </div>

            <div>
              <span>🚜</span>
              <div>
                <h4>Support Farmers</h4>
                <p>Help local farmers reach more families.</p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* ================= ORGANIC FOOD ================= */}
      <section className="organic-section">

        <div className="section-heading">

          <span className="section-tag">
            FRESH FROM NATURE
          </span>

          <h2>
            Why choose <span>fresh & natural?</span>
          </h2>

          <p>
            Better food begins with better farming and fresh produce.
          </p>

        </div>


        <div className="organic-cards">

          {/* CARD 1 */}
          <div className="organic-card">

            <div className="organic-image">
              <Image
                src="/images/fresh-vegetables.jpg"
                alt="Fresh vegetables"
                width={500}
                height={350}
              />
            </div>

            <div className="organic-card-content">

              <span className="card-icon">🥕</span>

              <h3>Fresh Produce</h3>

              <p>
                Enjoy colourful vegetables that come fresh from farms
                and reach your kitchen.
              </p>

            </div>

          </div>


          {/* CARD 2 */}
          <div className="organic-card">

            <div className="organic-image">
              <Image
                src="/images/organic-farming.jpg"
                alt="Organic farming"
                width={500}
                height={350}
              />
            </div>

            <div className="organic-card-content">

              <span className="card-icon">🌿</span>

              <h3>Natural Farming</h3>

              <p>
                Encourage farming practices that care for soil,
                crops and the surrounding environment.
              </p>

            </div>

          </div>


          {/* CARD 3 */}
          <div className="organic-card">

            <div className="organic-image">
              <Image
                src="/images/farmer-basket.jpg"
                alt="Farmer with fresh vegetables"
                width={500}
                height={350}
              />
            </div>

            <div className="organic-card-content">

              <span className="card-icon">👨‍🌾</span>

              <h3>Support Farmers</h3>

              <p>
                Build a stronger connection between farmers and
                the families they serve.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FARMING SECTION ================= */}
      <section className="farming-section">

        <div className="farming-content">

          <span className="section-tag">
            ORGANIC FARMING
          </span>

          <h2>
            Healthy farms create
            <span> healthy communities.</span>
          </h2>

          <p>
            Farming is not only about growing food. It is also about
            taking care of the soil, water, plants and local ecosystem.
          </p>


          <div className="benefits-grid">

            <div className="benefit-box">
              <span>🌱</span>
              <div>
                <h4>Healthy Soil</h4>
                <p>Good farming practices help protect soil quality.</p>
              </div>
            </div>

            <div className="benefit-box">
              <span>🐝</span>
              <div>
                <h4>Biodiversity</h4>
                <p>Natural farms can support different plants and organisms.</p>
              </div>
            </div>

            <div className="benefit-box">
              <span>💧</span>
              <div>
                <h4>Resource Care</h4>
                <p>Responsible farming helps conserve natural resources.</p>
              </div>
            </div>

            <div className="benefit-box">
              <span>🌾</span>
              <div>
                <h4>Sustainable Future</h4>
                <p>Better farming can help build a stronger food system.</p>
              </div>
            </div>

          </div>

        </div>


        <div className="farming-image">

          <Image
            src="/images/organic-farming.jpg"
            alt="Organic farming"
            width={650}
            height={650}
          />

          <div className="image-badge">
            🌿 Grow Naturally
          </div>

        </div>

      </section>


      {/* ================= FARMERS ================= */}
      <section className="farmer-section">

        <div className="farmer-image">

          <Image
            src="/images/farmer-working.jpg"
            alt="Farmer working in field"
            width={650}
            height={550}
          />

        </div>


        <div className="farmer-content">

          <span className="section-tag">
            FOR OUR FARMERS
          </span>

          <h2>
            Your farm.
            <br />
            <span>Your hard work.</span>
            <br />
            Your customers.
          </h2>

          <p>
            Farm2Family gives farmers a simple way to showcase their
            produce and connect with customers directly.
          </p>

          <div className="farmer-features">

            <div>
              <span>📦</span>
              <p>List your farm produce</p>
            </div>

            <div>
              <span>👥</span>
              <p>Connect with customers</p>
            </div>

            <div>
              <span>💰</span>
              <p>Manage your orders</p>
            </div>

          </div>

          <button
            className="primary-btn"
            onClick={() => setActiveForm("farmerRegister")}
          >
            Become a Farmer
          </button>

        </div>

      </section>


      {/* ================= WHY FARM2FAMILY ================= */}
      <section className="why-section">

        <div className="section-heading">

          <span className="section-tag">
            FARM2FAMILY
          </span>

          <h2>
            Built for <span>farmers & families</span>
          </h2>

        </div>


        <div className="why-grid">

          <div className="why-card farmer-why">

            <div className="why-icon">🚜</div>

            <h3>For Farmers</h3>

            <ul>
              <li>List farm products</li>
              <li>Reach local customers</li>
              <li>Manage orders</li>
              <li>Build direct connections</li>
            </ul>

            <button
              onClick={() => setActiveForm("farmerRegister")}
            >
              Join as Farmer →
            </button>

          </div>


          <div className="why-card customer-why">

            <div className="why-icon">🛒</div>

            <h3>For Customers</h3>

            <ul>
              <li>Discover fresh produce</li>
              <li>Explore local farms</li>
              <li>Order conveniently</li>
              <li>Support local farmers</li>
            </ul>

            <button
              onClick={() => setActiveForm("customerRegister")}
            >
              Join as Customer →
            </button>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section">

        <div className="section-heading">

          <span className="section-tag">
            SIMPLE PROCESS
          </span>

          <h2>
            How <span>Farm2Family</span> works
          </h2>

        </div>


        <div className="steps">

          <div className="step">

            <div className="step-number">01</div>

            <div>
              <h3>Register</h3>
              <p>Create your farmer or customer account.</p>
            </div>

          </div>


          <div className="step">

            <div className="step-number">02</div>

            <div>
              <h3>List Products</h3>
              <p>Farmers can add their fresh farm produce.</p>
            </div>

          </div>


          <div className="step">

            <div className="step-number">03</div>

            <div>
              <h3>Place Order</h3>
              <p>Customers browse and order fresh products.</p>
            </div>

          </div>


          <div className="step">

            <div className="step-number">04</div>

            <div>
              <h3>Get Fresh</h3>
              <p>Fresh farm products reach the customer.</p>
            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div className="cta-content">

          <span>🌱 FARM • FOOD • FAMILY</span>

          <h2>
            Let&apos;s bring farms
            <br />
            <strong>closer to families.</strong>
          </h2>

          <p>
            Fresh food, local farmers and a stronger community —
            all connected through Farm2Family.
          </p>

          <div className="cta-buttons">

            <button
              onClick={() => setActiveForm("customerRegister")}
              className="cta-light-btn"
            >
              Start Shopping
            </button>

            <button
              onClick={() => setActiveForm("farmerRegister")}
              className="cta-outline-btn"
            >
              Join as Farmer
            </button>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="farm-footer">

        <div className="footer-content">

          <div className="footer-brand">

            <div className="footer-logo">

              <Image
                src="/logo.jpeg"
                alt="Farm2Family"
                width={45}
                height={45}
              />

              <div>
                <h3>Farm2Family</h3>
                <span>From Our Farmers to Your Family</span>
              </div>

            </div>

            <p>
              Connecting farmers and families through fresh,
              farm-direct food.
            </p>

          </div>


          <div className="footer-links">

            <h4>Quick Links</h4>

            <button onClick={() => setActiveForm("customerLogin")}>
              Customer Login
            </button>

            <button onClick={() => setActiveForm("farmerLogin")}>
              Farmer Login
            </button>

            <button onClick={() => setActiveForm("customerRegister")}>
              Customer Register
            </button>

            <button onClick={() => setActiveForm("farmerRegister")}>
              Farmer Register
            </button>

          </div>


          <div className="footer-info">

            <h4>Our Purpose</h4>

            <p>
              Better connection between the people who grow
              food and the people who enjoy it.
            </p>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 Farm2Family. All Rights Reserved.
          </p>

          <span>
            🌱 Grown with care
          </span>

        </div>

      </footer>

    </main>
  );
}