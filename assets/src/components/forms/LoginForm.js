import React, { useState } from "react";
import axios from "axios";
import FormControl from "../utils/FormControl";
import LinkButton from "../parts/LinkButton";
import Notification from "../parts/Notification";
import { Navigate } from "react-router-dom";

export default function LoginForm() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })
    const [formResponse, setFormResponse] = useState({})
    const [logged, setLogged] = useState(
        localStorage.getItem("token") && ["null", "undefined"].indexOf(localStorage.getItem("token")) === -1 ? true : false
    )
    const formControl = new FormControl()

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let maxLength = e.target.maxLength < 0 ? e.target.maxLength : 255
        setFormResponse({})

        switch(fieldName) {
            case "username":
                // Check if the username respect limitation
                if(!formControl.checkLength(fieldValue, 1, maxLength)) {
                    setFormResponse({classname: "danger", message: "The username don't respect the characters lenght"})
                    return
                }
                break

            case "password":
                // Check if the password is empty
                if(!formControl.checkMinLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "The password can't be empty"})
                    return
                }
                break

            default:
                setFormResponse({classname: "danger", message: "The field don't exist"})
                return
        }

        setCredentials({
            ...credentials,
            [fieldName]: fieldValue
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!formControl.checkEmail(credentials.username)) {
            setFormResponse({classname: "danger", message: "The username isn't valid"})
            return
        }

        // Connect the user
        axios
            .post(window.location.origin + "/api/login", credentials, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld"
                }
            })
            .then(res => {
                let data = res.data
                if(data.token != "") {
                    if(["undefined", "null", null, undefined].indexOf(localStorage.getItem("token")) !== -1) {
                        localStorage.setItem("token", data.token)
                        setLogged(true)
                    }

                    setFormResponse({classname: "success", message: "Successfully connected"})
                } else {
                    setFormResponse({classname: "danger", message: data.error.messageKey})
                }
            })
            .catch(err => {
                console.log(err)
                setFormResponse({classname: "danger", message: "An error has been encountered"})
            })
        ;
    }

    return (
        <>
            {logged && (<Navigate to={"/user"} />)}
            <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
                {Object.keys(formResponse).length > 0 && (
                    <Notification {...formResponse} />
                )}

                <div className={"form-field"}>
                    <input type={"email"} placeholder={"Username ..."} maxLength={255} onChange={(e) => handleChange(e, "username")} />
                </div>

                <div className={"form-field"}>
                    <input type={"password"} placeholder={"Password ..."} maxLength={255} onChange={(e) => handleChange(e, "password")} />
                </div>
                
                <div className={"form-button"}>
                    <LinkButton classname={"btn-blue"} url={"/register"} value={"Register"} />
                    <button className={"btn btn-green"} type={"submit"}>Submit</button>
                </div>
            </form>
        </>
    )
}