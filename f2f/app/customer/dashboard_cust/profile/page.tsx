"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";


type Customer = {
    id: number;
    name : string;
    email:string;
    phone : string;
    address : string;
    areapin :string;

};

export default function page(){
    const [customer,setCustomer]=useState<Customer | null>(null);

    useEffect(()=>{
        const fetchprofile = async () =>{
            try{
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/customer/profile",

                {headers:
                {
                    Authorization: `Bearer ${token}`
                }  }  
                );

                setCustomer(res.data);
            }

            catch(err){
                console.log(err);
            }
        };
        fetchprofile();

    },[]);

    if(!customer){
        return <h2>Loading...</h2>;
    }

    return(
        <div className="profile-container">

    <div className="profile-card">

        <div className="profile-header">

            <div className="profile-avatar">
                👨‍🌾
            </div>

            <h1>{customer.name}</h1>

            <p>
                Welcome to your Farm2Home Customer Dashboard
            </p>

        </div>

        <div className="profile-body">

            <div className="profile-info">

                <div className="info-box">
                    <div className="info-title">Email</div>
                    <div className="info-value">
                        {customer.email}
                    </div>
                </div>

                <div className="info-box">
                    <div className="info-title">Phone</div>
                    <div className="info-value">
                        {customer.phone}
                    </div>
                </div>

                <div className="info-box">
                    <div className="info-title">Address</div>
                    <div className="info-value">
                        {customer.address}
                    </div>
                </div>

                <div className="info-box">
                    <div className="info-title">APIN Code</div>
                    <div className="info-value">
                        {customer.areapin}
                    </div>
                </div>

            </div>

            <div className="profile-footer">

                <button className="edit-btn">
                    ✏️ Edit Profile
                </button>

            </div>

            <div className="quote">

                🌱 <b>Growing fresh food, building healthy families.</b>
                <br/>
                Thank you for being a valuable farmer in the Farm2Home community.

            </div>

        </div>

    </div>

</div>
    );
}