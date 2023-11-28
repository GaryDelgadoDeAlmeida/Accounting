import React, { useState } from "react";
import axios from "axios";
import FormControl from "../utils/FormControl";
import Notification from "../parts/Notification";
import { Link, Navigate } from "react-router-dom";

export default function LoginForm() {
    
    const formControl = new FormControl()
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })
    const [formResponse, setFormResponse] = useState({})
    const [logged, setLogged] = useState(
        localStorage.getItem("token") && ["undefined", "null", null, undefined].indexOf(localStorage.getItem("token")) === -1 ? true : false
    )

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
            .then((response) => {
                if(response.data.token != null) {
                    if(["undefined", "null", null, undefined].indexOf(localStorage.getItem("token")) !== -1) {
                        localStorage.setItem("token", response.data.token)
                        setLogged(true)
                    }

                    setFormResponse({classname: "success", message: "Successfully connected"})
                } else {
                    setFormResponse({classname: "danger", message: response.data.error.messageKey})
                }
            })
            .catch(({response}) => {
                let errorMessage = "An error has been encountered. Please retry later"
                if(response.data != "") {
                    if(typeof response.data == "object") {
                        errorMessage = response.data.detail
                    } else {
                        errorMessage = response.data
                    }
                }
                setFormResponse({classname: "danger", message: errorMessage})
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

                <div className={"form-message txt-center mb-15px"}>
                    <small>Vous n'avez pas de compte ? <Link to={"/register"}>Créer un nouveau compte</Link></small>
                </div>
                
                <div className={"form-button"}>
                    <button className={"btn btn-green"} type={"submit"}>Submit</button>
                </div>
            </form>
        </>
    )
}