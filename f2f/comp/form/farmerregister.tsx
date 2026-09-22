"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";
import "./comp.css";
type Props = {
  onLogin?: () => void;
};
function page({ onLogin }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [add, setAdd] = useState("");
  const [apin, setApin] = useState("");

  const handle = async () => {
    try {
      const res = await axios.post("http://localhost:5000/farmer/register", {
        name: name,
        password: password,
        phone: phone,
        email: mail,
        address: add,
        apin: apin
      });
      if (res.data.success) {
  alert("Registered successfully");
  formRef.current?.reset();

  setName("");
  setPassword("");
  setPhone("");
  setMail("");
  setAdd("");
  setApin("");

  router.push("/");
}
    }
    catch (err: any) {
  console.log("Registration error:", err);

  alert(
    err.response?.data?.message ||
    "Registration failed"
  );
}
  }

  return (
    <div className="login-container farmer-theme">
      <div className="register-card">
        <form  ref={formRef}
  onSubmit={(e) => {
    e.preventDefault();
    handle();
  }}>
        <h2 className="register-title">Farmer Registration</h2>

        <input
          className="register-input"
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="register-input"
          type="Number"
          placeholder="Phone Number"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="register-input"
          type="email"
          placeholder="Email"
          onChange={(e) => setMail(e.target.value)}
        />

        <input
          className="register-input"
          type="text"
          placeholder="Address"
          onChange={(e) => setAdd(e.target.value)}
        />

        <input
          className="register-input"
          type="text"
          placeholder="Area Pin"
          onChange={(e) => setApin(e.target.value)}
        />

        <input
          className="register-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="register-text">
          <button type="submit" className="register-btn farmer-btn">
  Register
</button>
          Already have an account?{" "}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={onLogin}
          >
            Login Here
          </button>
        </div>
        </form>
      </div>
    </div>
  );

}
export default page;
