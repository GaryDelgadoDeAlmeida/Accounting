import React, { useState } from "react";
import Notification from "../parts/Notification";
import PrivatePostRessource from "../utils/PrivatePostRessource";
import LinkButton from "../parts/LinkButton";

export default function RegisterForm() {
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    
    // Form response
    const [formResponse, setFormResponse] = useState([])

    const handleChange = (e, fieldName) => {
        // 
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <input type={"text"} placeholder={"Firstname"} onChange={(e) => handleChange(e, "firstname")} />
                </div>
                
                <div className={"form-field"}>
                    <input type={"text"} placeholder={"Lastname"} onChange={(e) => handleSubmit(e, "lastname")} />
                </div>
            </div>
            
            <div className={"form-field"}>
                <input type={"email"} placeholder={"Email"} onChange={(e) => handleChange(e, "email")} />
            </div>
            
            <div className={"form-field"}>
                <input type={"tel"} pattern="[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}" placeholder={"Phone"} onChange={(e) => handleChange(e, "phone")} />
                <small className={"txt-right"}>Ex: 01 00 00 00 00</small>
            </div>
            
            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <input type={"password"} placeholder={"Password"} onChange={(e) => handleChange(e, "password")} />
                </div>
                <div className={"form-field"}>
                    <input type={"password"} placeholder={"Confirm password"} onChange={(e) => handleChange(e, "conform_password")} />
                </div>
            </div>
            
            <div className={"form-button"}>
                <LinkButton classname={"btn-blue"} url={"/login"} value={"Login"} />
                <button className={"btn btn-green"} type={"submit"}>Register</button>
            </div>
        </form>
    )
}