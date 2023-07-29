import React, { useState } from "react";
import axios from "axios";
import FormControl from "../utils/FormControl";
import LinkButton from "../parts/LinkButton";
import Notification from "../parts/Notification";

export default function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [formResponse, setFormResponse] = useState({})
    const formControl = new FormControl()

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let maxLength = e.target.maxLength < 0 ? e.target.maxLength : 255
        setFormResponse({})

        switch(fieldName) {
            case "username":
                // Check if the username respect limitation
                if(!formControl.checkLength(fieldValue, 1, maxLength)) {
                    setFormResponse({classname: "danger", message: ""})
                    return
                }

                setUsername(fieldValue)
                break

            case "password":
                // Check if the password is empty
                if(!formControl.checkMinLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "The password can't be empty"})
                    return
                }

                setPassword(fieldValue)
                break

            default:
                setFormResponse({classname: "danger", message: "The field don't exist"})
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Connect the user
        axios
            .post(window.location.origin + "/api/login", {
                username: username,
                password: password
            })
            .then(res => console.log(res))
            .catch(err => console.log(err))
        ;

        // Return a response to the user
        setFormResponse({classname: "success", message: "Successfully connected"})
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {Object.keys(formResponse).length > 0 && (
                <Notification {...formResponse} />
            )}

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