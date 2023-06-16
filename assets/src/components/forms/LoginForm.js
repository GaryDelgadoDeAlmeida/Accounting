import React, { useState } from "react";
import Notification from "../parts/Notification";
import PrivatePostRessource from "../utils/PrivatePostRessource";
import LinkButton from "../parts/LinkButton";

export default function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [formResponse, setFormResponse] = useState([])

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value

        if(fieldName === "username") {
            setUsername(fieldValue)
        } else if(fieldName === "password") {
            setPassword(fieldValue)
        } else {
            setFormResponse({classname: "danger", message: "The field don't exist"})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Connect the user
        await PrivatePostRessource("login", {
            email: username,
            password: password
        })

        // Return a response to the user
        setFormResponse({classname: "success", message: "Successfully connected"})
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {formResponse.length > 0 && (<Notification {...formResponse} />)}

            <div className={"form-field"}>
                <input type={"email"} placeholder={"Username ..."} onChange={(e) => handleChange(e, "username")} />
            </div>

            <div className={"form-field"}>
                <input type={"password"} placeholder={"Password ..."} onChange={(e) => handleChange(e, "password")} />
            </div>
            
            <div className={"form-button"}>
                <LinkButton classname={"btn-blue"} url={"/register"} value={"Register"} />
                <button className={"btn btn-green"} type={"submit"}>Submit</button>
            </div>
        </form>
    )
}