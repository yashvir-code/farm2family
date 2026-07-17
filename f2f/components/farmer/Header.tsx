
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Header.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type Decodetoken = {
        id : number;
        name : string;
        email:string;
    };

function header(){
    const router = useRouter();
    const [farmername,setFarmername]=useState("");
    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            const decoded : Decodetoken=jwtDecode(token);
            setFarmername(decoded.name)
        }
    },[])
    const logout =()=>{
        localStorage.removeItem("token");
        router.push("/");
    }
    
    return(
        <header className="header">
       
            <div className="logo">
                    🌾 Farm2Home
            </div>
            <div className="greeting">
                    Welcome , <b>{farmername}</b>
            </div>
            <div className="header-right">
                <Link href="/farmer/dashboard/profile">
                    <button className="profile-btn">
                            👤Profile
                    </button>
                </Link>
                <button onClick={logout} className="logout-btn">Logout

                </button>
            </div>
        
        </header>
    );
}export default header;