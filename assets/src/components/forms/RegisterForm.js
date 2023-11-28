import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../parts/Notification";
import LinkButton from "../parts/LinkButton";
import FormControl from "../utils/FormControl";

export default function RegisterForm() {
    
    // Form field
    const [credentials, setCredentials] = useState({
        firstname: "",
        lastname: "",
        birth_date: "",
        email: "",
        password: "",
        conform_password: ""
    })
    
    // Form response
    const [formResponse, setFormResponse] = useState({})
    const formControl =  new FormControl()

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let maxLength = e.target.maxLength != -1 ? e.target.maxLength : 255
        setFormResponse({})

        switch(fieldName) {
            case "firstname":
                if(!formControl.checkMaxLength(fieldValue, maxLength)) {
                    setFormResponse({classname: "danger", message: "A length limitation error has been found with the firstname field"})
                    return
                }
                break

            case "lastname":
                if(!formControl.checkMaxLength(fieldValue, maxLength)) {
                    setFormResponse({classname: "danger", message: "A length limitation error has been found with the lastname field"})
                    return
                }
                break

            case "email":
                // Check if email respect length limitation
                if(!formControl.checkLength(fieldValue, 1, maxLength)) {
                    setFormResponse({classname: "warning", message: "A length limitation error has been found with the email field"})
                    return
                }

                // Check if email is valid
                if(!formControl.checkEmail(fieldValue)) {
                    setFormResponse({classname: "danger", message: "The email isn't valid"})
                    return
                }
                break

            case "birth_date":
                fieldValue = (new Date(fieldValue)).toLocaleDateString(undefined, {year:"numeric", month:"numeric", day: "numeric"})
                break;

            case "password":
            case "conform_password":
                // Do nothing. All check will be in handle in submit event
                break

            default:
                setFormResponse({classname: "danger", message: `The field name ${fieldName} is forbidden`})
                return
        }

        setCredentials({
            ...credentials,
            [fieldName]: fieldValue
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Check the length of the password
        if(!formControl.checkMinLength(credentials.password, 8)) {
            setFormResponse({classname: "danger", message: "The password should be at minimum 8 characters"})
            return
        }

        // Check if the pasword have all means to be a secured password
        if(!formControl.checkPassword(credentials.password)) {
            setFormResponse({classname: "danger", message: "The password is not secure."})
            return
        }

        // Check if the password and the confirmation is equal
        if(credentials.password != credentials.conform_password) {
            setFormResponse({classname: "danger", message: "The confirmation password isn't incorrect"})
            return
        }

        // Send all data to the API in order to create a new account
        axios
            .post(`${window.location.origin}/api/user`, credentials, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                setFormResponse({classname: "success", message: response.data})
            })
            .catch(error => {
                let errorMessage = "An error occured. Please retry later or contact the webmaster."
                if(error.response.data != "") {
                    errorMessage = error.response.data
                }

                setFormResponse({classname: "danger", message: errorMessage})
            })
        ;
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {Object.keys(formResponse).length > 0 && (<Notification {...formResponse} />)}
            
            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <input type={"text"} placeholder={"Firstname"} onChange={(e) => handleChange(e, "firstname")} />
                </div>
                
                <div className={"form-field"}>
                    <input type={"text"} placeholder={"Lastname"} onChange={(e) => handleChange(e, "lastname")} />
                </div>
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"birth_date"}>Birth date</label>
                <input id={"birth_date"} type={"date"} placeholder="dd-mm-yyyy" onChange={(e) => handleChange(e, "birth_date")} />
            </div>
            
            <div className={"form-field"}>
                <input type={"email"} placeholder={"Email"} onChange={(e) => handleChange(e, "email")} />
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