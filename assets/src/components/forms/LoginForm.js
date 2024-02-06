import React, { useState } from "react";
import axios from "axios";
import FormControl from "../utils/FormControl";
import Notification from "../parts/Notification";
import { Link, Navigate } from "react-router-dom";

export default function LoginForm({adminConnect = false}) {
    
    const formControl = new FormControl()
    const [logged, setLogged] = useState(false)
    const [formResponse, setFormResponse] = useState({})
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let maxLength = e.target.maxLength < 0 ? e.target.maxLength : 255
        setFormResponse({})

        switch(fieldName) {
            case "email":
                // Check if the email respect limitation
                if(!formControl.checkLength(fieldValue, 1, maxLength)) {
                    setFormResponse({classname: "danger", message: "The email don't respect the characters lenght"})
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

        if(!formControl.checkEmail(credentials.email)) {
            setFormResponse({classname: "danger", message: "The email isn't valid"})
            return
        }

        axios
            .post(`${window.location.origin}/api/login_check`, credentials, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld"
                }
            })
            .then((response) => {
                localStorage.setItem("user", JSON.stringify({
                    role: adminConnect ? "ROLE_ADMIN" : "ROLE_USER",
                    token: response.data.token
                }))
                setLogged(true)
                setFormResponse({classname: "success", message: "Successfully connected"})
            })
            .catch(({response}) => {
                let errorMessage = "An error has been encountered. Please retry later"
                if(response.data && response.data.length < 1000) {
                    errorMessage = response.data
                }

                setFormResponse({classname: "danger", message: errorMessage})
            })
        ;
    }

    return (
        <>
            {logged && (
                <Navigate to={adminConnect ? "/admin" : "/user"} />
            )}

            <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
                {Object.keys(formResponse).length > 0 && (
                    <Notification {...formResponse} />
                )}

                <div className={"form-field"}>
                    <input type={"email"} placeholder={"Email ..."} maxLength={255} onChange={(e) => handleChange(e, "email")} />
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