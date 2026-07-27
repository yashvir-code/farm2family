"use client";

import { useEffect, useRef, useState } from "react";
import "./add-packet.css";
import axios from "axios";
import { useRouter } from "next/navigation";

function page() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const [farmname, setFarmname] = useState("");
    const [listingtitle, setListingtitle] = useState("");
    const [vegitables, setVegitables] = useState([{
        vegitable: "",
        quantity: 2,
    }]);

    const addVegetable = () => {
        setVegitables([...vegitables, {
            vegitable: "", quantity: 2,
        },]);
    };

    const [farmaddress, setFarmaddress] = useState("");
    const [area, setArea] = useState("");
    const [pincode, setPincode] = useState("");
    const [organic, setOrganic] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const uplodehandle = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("farmname", farmname);
        formData.append("title", listingtitle);
        formData.append("vegitables", JSON.stringify(vegitables));
        formData.append("farmadd", farmaddress);
        formData.append("area", area);
        formData.append("pincode", pincode);
        formData.append("org", organic);
        formData.append("price", price);

        if (image) {
            formData.append("image", image);
        }
        const res = await axios.post(
            "http://localhost:5000/listing/add-packet",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        alert("listing added successfully");
        formRef.current?.reset();
        router.push("/farmer/dashboard")
    }

    const checkStatus = async () => {

    const token = localStorage.getItem("token");

    const res = await axios.get(
        "http://localhost:5000/farmer/check-status",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (res.data.status !== "Verified") {
        alert("❌ Your account is not verified by Admin.");

        router.push("/farmer/dashboard");
    }

};

useEffect(() => {
    checkStatus();
}, []);

    return (

        <form ref={formRef} onSubmit={uplodehandle}>

            <div className="form-group">
                <label>Farm Name</label>
                <input
                    type="text"
                    placeholder="Enter Farm Name"
                    value={farmname}
                    onChange={(e) => setFarmname(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Listing Title</label>
                <input
                    type="text"
                    placeholder="Enter Listing Title"
                    value={listingtitle}
                    onChange={(e) => setListingtitle(e.target.value)}
                />
            </div>

            {
                vegitables.map((veg, index) => (
                    <div key={index} className="vegetable-row">

                        <div className="form-group">
                            <label>Vegetable Name</label>

                            <input
                                type="text"
                                placeholder="Enter Vegetable Name"
                                value={veg.vegitable}
                                onChange={(e) => {

                                    const updated = [...vegitables];

                                    updated[index].vegitable = e.target.value;

                                    setVegitables(updated);

                                }}
                            />

                        </div>

                        <div className="form-group">
                            <label>Quantity</label>

                            <select
                                value={veg.quantity}
                                onChange={(e) => {

                                    const updated = [...vegitables];

                                    updated[index].quantity = Number(e.target.value);

                                    setVegitables(updated);

                                }}
                            >

                                <option value={2}>2 Kg</option>
                                <option value={3}>3 Kg</option>
                                <option value={5}>5 Kg</option>
                                <option value={10}>10 Kg</option>

                            </select>

                        </div>

                    </div>
                ))
            }

            <button
                type="button"
                className="add-btn"
                onClick={addVegetable}
            >
                + Add Vegetable
            </button>

            <div className="form-group">
                <label>Total Basket Size (Auto)</label>
                <input
                    type="text"
                    readOnly
                    value={
                        vegitables.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                        ) + " Kg"
                    }
                />
            </div>

            <div className="form-group">
                <label>Farm Address</label>
                <textarea
                    rows={3}
                    placeholder="Enter Farm Address"
                    value={farmaddress}
                    onChange={(e) => setFarmaddress(e.target.value)}
                ></textarea>
            </div>

            <div className="form-group">
                <label>Area / Locality</label>
                <input
                    type="text"
                    placeholder="Enter Area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Pincode</label>
                <input
                    type="number"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Organic</label>

                <div className="radio-group">

                    <label>
                        <input
                            type="radio"
                            name="organic"
                            value="Yes"
                            onChange={(e) => setOrganic(e.target.value)}
                        />
                        Yes
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="organic"
                            value="No"
                            onChange={(e) => setOrganic(e.target.value)}
                        />
                        No
                    </label>

                </div>
            </div>

            <div className="form-group">
                <label>Basket Price (₹)</label>
                <input
                    type="number"
                    placeholder="Enter Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Vegetable Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
            </div>

            <button type="submit" className="submit-btn" >
                Create Basket
            </button>

        </form>

    );

} export default page;