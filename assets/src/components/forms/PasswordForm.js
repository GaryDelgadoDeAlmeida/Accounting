import React, { useEffect, useState } from "react";
import PrivateResources from "../utils/PrivateResources";
import PrivatePostRessource from "../utils/PrivatePostRessource";
import { useParams } from "react-router-dom";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";
import axios from "axios";

export default function PasswordForm() {
    const { userID } = useParams()
    const { loading, items: user, load } = PrivateResources("user/" + userID)

    // Form response
    const [formResponse, setFormResponse] = useState({})
    const formControl = new FormControl()

    // Form field
    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // useEffect(() => load(), [])

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        setFormResponse({})

        switch(fieldName) {
            case "current_password":
                setOldPassword(fieldValue)
                break

            case "new_password":
                setPassword(fieldValue)
                break

            case "confirm_password":
                setConfirmPassword(fieldValue)
                break

            default:
                setFormResponse({classname: "danger", message: `The field name '${fieldName}' is forbidden`})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(password != confirmPassword) {
            setFormResponse({classname: "danger", message: "The password and the confirmation is correct."})
            return
        }

        const apiResponse = await PrivatePostRessource(`user/${userID}/update`, {
            password: password
        })

        if(!apiResponse) {
            setFormResponse({classname: "danger", message: "An error has been found. The password couldn't be updated"})
            return
        }

        setFormResponse({classname: "success", message: "The password has been successfully updated"})
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            
            {Object.keys(formResponse).length > 0 && (
                <Notification {...formResponse} />
            )}

            <div className={"form-field"}>
                <label htmlFor={"old-password"}>Old password</label>
                <input id={"old-password"} type={"password"} onChange={(e) => handleChange(e, "current_password")} />
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