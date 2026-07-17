"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import "./comp.css"

type Props = {
  onLogin?: () => void;
};
function page({ onLogin }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [areapin, setAreapin] = useState("");
  const [add, setAdd] = useState("");

  const handlereg = async () => {

    console.log("Register Button Clicked");

    try {
        const res = await axios.post(
            "http://localhost:5000/customer/register_cust",
            {
                name,
                email: mail,
                password,
                phone,
                areapin,
                address: add,
            }
        );

        console.log(res.data);

    } catch (err: any) {
        console.log(err.response?.data);
        console.log(err);
    }
};

  return (
    <div className="login-container customer-theme">
      <div className="register-card">
        <form ref={formRef}>
        <h1>Customer Registration</h1>
        <p>Create your Farm2Family account</p>

        <input
          type="text"
          placeholder="Enter Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setMail(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter Contact Number"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter Area Pin Code"
          onChange={(e) => setAreapin(e.target.value)}
        />

        <textarea
          placeholder="Full Address"
          rows={3}
          onChange={(e) => setAdd(e.target.value)}
        ></textarea>

        <button type="button" className="register-btn customer-btn" onClick={handlereg} >
          Register
        </button>
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={onLogin}
        >
          Already have an account? Login Here
        </button>
        </form>
      </div>
    </div>
  );
}
export default page;
