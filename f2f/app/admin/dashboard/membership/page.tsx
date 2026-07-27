"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import "./page.css";

export default function Membership() {

    const [editId, setEditId] = useState<number | null>(null);
const [status, setStatus] = useState("");
    const [plans, setPlans] = useState<any[]>([]);
    const [plan_name, setPlanName] = useState("");
    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const token = localStorage.getItem("adminToken");

    const fetchPlans = async () => {
        try {
            const res = await axios.get("http://localhost:5000/admin/plans", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPlans(res.data.plans);
        } catch (err) {
            console.log(err);
        }
    };

    const addPlan = async () => {
        try {
            await axios.post(
                "http://localhost:5000/membership/add-plan",
                {
                    plan_name,
                    duration,
                    price,
                    description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPlanName("");
            setDuration("");
            setPrice("");
            setDescription("");

            fetchPlans();

        } catch (err) {
            console.log(err);
        }
    };
    const editPlan = (plan:any) => {

    setEditId(plan.id);

    setPlanName(plan.plan_name);

    setDuration(plan.duration);

    setPrice(plan.price);

    setDescription(plan.description);

    setStatus(plan.status);

};
const updatePlan = async () => {

    try{

        const token = localStorage.getItem("adminToken");

        await axios.put(

            `http://localhost:5000/admin/update-plan/${editId}`,

            {
                plan_name,
                duration,
                price,
                description,
                status
            },

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );

        setEditId(null);
        setPlanName("");
        setDuration("");
        setPrice("");
        setDescription("");
        setStatus("");

        fetchPlans();

    }

    catch(err){

        console.log(err);

    }

};

const deletePlan = async(id:number)=>{

    try{

        const token = localStorage.getItem("adminToken");

        await axios.delete(

            `http://localhost:5000/admin/delete-plan/${id}`,

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );

        fetchPlans();

    }

    catch(err){

        console.log(err);

    }

};

    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <div className="membership-container">

            <h2>Membership Plans</h2>

            <div className="plan-form">

                <input
                    type="text"
                    placeholder="Plan Name"
                    value={plan_name}
                    onChange={(e)=>setPlanName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Duration"
                    value={duration}
                    onChange={(e)=>setDuration(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                />

                {
    editId ?

    <button onClick={updatePlan}>
        Update Plan
    </button>

    :

    <button onClick={addPlan}>
        Add Plan
    </button>

}

            </div>

            <div className="plan-list">

                {plans.map((plan)=>(

                    <div className="plan-card" key={plan.id}>

                        <h3>{plan.plan_name}</h3>

                        <p>{plan.duration}</p>

                        <p>₹ {plan.price}</p>

                        <p>{plan.description}</p>

                        <div className="btn-group">

    <button onClick={()=>editPlan(plan)}>
        Edit
    </button>

    <button onClick={()=>deletePlan(plan.id)}>
        Delete
    </button>

</div>

                    </div>

                ))}

            </div>

        </div>
    );
}