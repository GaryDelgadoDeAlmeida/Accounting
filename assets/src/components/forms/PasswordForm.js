import React, { useState } from "react";
import PrivatePostRessource from "../utils/PrivatePostRessource";
import { useParams } from "react-router-dom";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";
import axios from "axios";

export default function PasswordForm({userID}) {

    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})
    const [credentials, setCredentials] = useState({
        password: "",
        new_password: "",
        confirm_password: ""
    })

    const handleChange = (e, fieldName) => {
        setFormResponse({})
        let fieldValue = e.target.value

        switch(fieldName) {
            case "password":
                break

            case "new_password":
                if(!formControl.checkMaxLength(fieldValue, 255)) {
                    setFormResponse({classname: "danger", message: `The value of the field '${fieldName}' exceed 255 characters length`})
                    return
                }
                break

            case "confirm_password":
                if(!formControl.checkMaxLength(fieldValue, 255)) {
                    setFormResponse({classname: "danger", message: `The value of the field '${fieldName}' exceed 255 characters length`})
                    return
                }
                break

            default:
                setFormResponse({classname: "danger", message: `The field name '${fieldName}' is forbidden`})
                return
        }

        setCredentials({
            ...credentials,
            [fieldName]: fieldValue
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(credentials.password == credentials.new_password) {
            setFormResponse({classname: "danger", message: "You current password and the new one are the same. Please, choose a different password."})
            return
        }

        if(credentials.new_password != credentials.confirm_password) {
            setFormResponse({classname: "danger", message: "The password and the confirmation is correct."})
            return
        }

        axios
            .post(window.location.origin + "/api/user/" + userID + "/update", credentials, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld"
                }
            })
            .then((response) => {
                console.log(response.data)
                setFormResponse({classname: "success", message: "The password has been successfully updated"})
            })
            .catch((error) => {
                console.log(error.response.data)
                setFormResponse({classname: "danger", message: "An error has been found. The password couldn't be updated"})
            })
        ;
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            
            {Object.keys(formResponse).length > 0 && (
                <Notification {...formResponse} />
            )}

            <div className={"form-field"}>
                <label htmlFor={"old-password"}>Old password</label>
                <input id={"old-password"} type={"password"} onChange={(e) => handleChange(e, "password")} />
            </div>
            
            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <label htmlFor={"password"}>Password</label>
                    <input id={"password"} type={"password"} onChange={(e) => handleChange(e, "new_password")} />
                </div>
                
                <div className={"form-field"}>
                    <label htmlFor={"confirm-password"}>Confirm password</label>
                    <input id={"confirm-password"} type={"password"} onChange={(e) => handleChange(e, "confirm_password")} />
                </div>
            </div>
            
            <div className={"form-button"}>
                <button className={"btn btn-blue"} type={"submit"}>Submit</button>
            </div>
        </form>
    )
}