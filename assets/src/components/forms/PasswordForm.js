import React, { useEffect, useState } from "react";
import PrivateResources from "../utils/PrivateResources";
import PrivatePostRessource from "../utils/PrivatePostRessource";
import { useParams } from "react-router-dom";
import Notification from "../parts/Notification";

export default function PasswordForm() {
    const { userID } = useParams()
    const { loading, items: user, load } = PrivateResources("user/" + userID)

    // Form response
    const [formResponse, setFormResponse] = useState([])

    // Form field
    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // useEffect(() => load(), [])

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        setFormResponse([])
        
        if(fieldName === "old-password") {
            setOldPassword(fieldValue)
        } else if(fieldName === "password") {
            setPassword(fieldValue)
        } else if(fieldName === "confirm-password") {
            setConfirmPassword(fieldValue)
        } else {
            setFormResponse({classname: "danger", message: `The field name '${fieldName}' is forbidden`})
            return
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
            
            {formResponse.length > 0 && (<Notification {...formResponse} /> ?? null)}

            <div className={"form-field"}>
                <label htmlFor={"old-password"}>Old password</label>
                <input id={"old-password"} type={"password"} onChange={(e) => handleChange(e, "old-password")} />
            </div>
            
            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <label htmlFor={"password"}>Password</label>
                    <input id={"password"} type={"password"} onChange={(e) => handleChange(e, "password")} />
                </div>
                
                <div className={"form-field"}>
                    <label htmlFor={"confirm-password"}>Confirm password</label>
                    <input id={"confirm-password"} type={"password"} onChange={(e) => handleChange(e, "confirm-password")} />
                </div>
            </div>
            
            <div className={"form-button"}>
                <button className={"btn btn-blue"} type={"submit"}>Submit</button>
            </div>
        </form>
    )
}