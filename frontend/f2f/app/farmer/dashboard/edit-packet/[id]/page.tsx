"use client";

type Vegetable = {
    vegetable_name: string;
    quantity: number;
};

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./edit.css";
import { useRouter } from "next/navigation";

export default function Page() {
    const params = useParams();
    const router = useRouter();

    const [farmname, setFarmname] = useState("");
    const [listingTitle, setListingTitle] = useState("");
    const [farmAddress, setFarmAddress] = useState("");
    const [area, setArea] = useState("");
    const [pincode, setPincode] = useState("");
    const [organic, setOrganic] = useState("");
    const [price, setPrice] = useState("");

    const [vegetables, setVegetables] = useState<Vegetable[]>([]);
    const [image, setImage] = useState<File | null>(null);




    useEffect(() => {
        const fatchpacket = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`http://localhost:5000/listing/packet/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFarmname(res.data.farmname);
                setListingTitle(res.data.listing_title);
                setFarmAddress(res.data.farm_address);
                setArea(res.data.area);
                setPincode(res.data.pincode);
                setOrganic(res.data.organic);
                setPrice(res.data.price);

                setVegetables(res.data.vegetables);
            }
            catch (err) {
                console.log(err);
            }
        };
        fatchpacket();
    }, []);

    const updatePacket = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        const formData = new FormData();

        formData.append("farmname", farmname);
        formData.append("title", listingTitle);
        formData.append("farmadd", farmAddress);
        formData.append("area", area);
        formData.append("pincode", pincode);
        formData.append("org", organic);
        formData.append("price", price);

        formData.append(
            "vegitables",
            JSON.stringify(vegetables)
        );

        if (image) {
            formData.append("image", image);
        }

        try {

            const res = await axios.put(
                `http://localhost:5000/listing/update-packet/${params.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Packet Updated Successfully");
            router.push("/farmer/dashboard/my-packet");

            console.log(res.data);

        }
        catch (err) {

            console.log(err);

            alert("Update Failed");

        }

    };

    if (!farmname) {
        return <h2>Loading...</h2>
    }


    return (
        <form onSubmit={updatePacket}>

            <div className="form-header">
                <h1>Update Your Basket</h1>

                <p>
                    Keep your basket information up to date so customers always see
                    the latest vegetables, prices, quantities and farm details.
                    Update everything carefully before saving the changes.
                </p>
            </div>

            <div className="form-group">
                <label>Farm Name</label>

                <input
                    type="text"
                    value={farmname}
                    onChange={(e) => setFarmname(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Listing Title</label>

                <input
                    type="text"
                    value={listingTitle}
                    onChange={(e) => setListingTitle(e.target.value)}
                />
            </div>

            {
                vegetables.map((veg: any, index: number) => (

                    <div className="vegetable-row" key={index}>

                        <div className="form-group">
                            <label>Vegetable Name</label>

                            <input
                                type="text"
                                value={veg.vegetable_name}
                                onChange={(e) => {

                                    const updated = [...vegetables];

                                    updated[index].vegetable_name = e.target.value;

                                    setVegetables(updated);

                                }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>

                            <select
                                value={veg.quantity}
                                onChange={(e) => {

                                    const updated = [...vegetables];

                                    updated[index].quantity = Number(e.target.value);

                                    setVegetables(updated);

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
                onClick={() =>
                    setVegetables([
                        ...vegetables,
                        {
                            vegetable_name: "",
                            quantity: 2,
                        },
                    ])
                }
            >
                + Add Vegetable
            </button>

            <div className="form-group">

                <label>Total Basket Size</label>

                <input
                    readOnly
                    value={
                        vegetables.reduce(
                            (sum: number, item: any) =>
                                sum + Number(item.quantity),
                            0
                        ) + " Kg"
                    }
                />

            </div>

            <div className="form-group">

                <label>Farm Address</label>

                <textarea
                    rows={3}
                    value={farmAddress}
                    onChange={(e) => setFarmAddress(e.target.value)}
                />

            </div>

            <div className="form-group">

                <label>Area</label>

                <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                />

            </div>

            <div className="form-group">

                <label>Pincode</label>

                <input
                    type="text"
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
                            value="yes"
                            checked={organic === "yes"}
                            onChange={(e) => setOrganic(e.target.value)}
                        />

                        Yes

                    </label>

                    <label>

                        <input
                            type="radio"
                            value="no"
                            checked={organic === "no"}
                            onChange={(e) => setOrganic(e.target.value)}
                        />

                        No

                    </label>

                </div>

            </div>

            <div className="form-group">

                <label>Price</label>

                <input
                    type="number"
                    value={price || ""}
                    onChange={(e) => setPrice(e.target.value)}
                />

            </div>

            <div className="form-group">

                <label>Change Image</label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setImage(e.target.files?.[0] || null)
                    }
                />

            </div>

            <button
                type="submit"
                className="submit-btn"
            >
                Update Packet
            </button>

        </form>
    );
}