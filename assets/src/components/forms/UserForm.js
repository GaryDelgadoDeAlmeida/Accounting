import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PrivateResources from "../utils/PrivateResources";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";
import axios from "axios";

export default function UserForm() {
    const { userID } = useParams()
    const { loading, items: user, load } = PrivateResources("user/" + userID)

    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})
    const [credentials, setCredentials] = useState({
        firstname: "",
        lastname: "",
        address: "",
        zip_code: "",
        city: "",
        country: "",
        email: "",
        phone: ""
    })

    // useEffect(() => {
    //     load()

    //     if(loading) {
    //         setAllFields(user)
    //     }
    // }, [])

    const setAllFields = (user) => {
        setCredentials({
            firstname: user.firstname,
            lastname: user.lastname,
            address: user.address,
            zip_code: user.zip_code,
            city: user.city,
            country: user.country,
            email: user.email,
            phone: user.phone
        })
    }

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let maxLength = e.target.maxLength > 0 ? e.target.maxLength : 255
        setFormResponse({})

        switch(fieldName) {
            case "firstname":
            case "lastname":
            case "address":
            case "zip_code":
            case "city":
            case "country":
                if(!formControl.checkLength(fieldValue, 1, maxLength)) {
                    setFormResponse({classname: "danger", message: `The ${fieldName} field don't respect the length limitations`})
                    return
                }
                break

            case "email":
                if(fieldValue !== credentials.email) {
                    setFormResponse({classname: "danger", message: `The field '${fieldName}' is disabled. It can't be changed`})
                    return
                }
                break

            case "phone":
                // Remove all space in the string
                fieldValue = fieldValue.replaceAll(" ", "")

                // If phone number is valid
                if(!formControl.checkPhone(fieldValue) && Form) {
                    setFormResponse({classname: "danger", message: "The phone number is invalid"})
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

        axios
            .put(window.location.origin + "/api/user/" + userID, credentials, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld"
                } 
            })
            .then((response) => {
                console.log(response, response.data)
                setFormResponse({classname: "success", message: "Your account has been successfully updated"})
            })
            .catch((error) => {
                setFormResponse({classname: "danger", message: "An error has been encountered. Please retry later."})
            })
        ;
    }

    return (
        <form className={"form"} method={"POST"} onSubmit={(e) => handleSubmit(e)}>
            
            {Object.keys(formResponse).length > 0 && (<Notification {...formResponse} />)}

            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <label htmlFor={"firstname"}>Firstname</label>
                    <input id={"firstname"} type={"text"} value={credentials.firstname} maxLength={100} onChange={(e) => handleChange(e, "firstname")} />
                </div>
                
                <div className={"form-field"}>
                    <label htmlFor={"lastname"}>Lastname</label>
                    <input id={"lastname"} type={"text"} value={credentials.lastname} maxLength={150} onChange={(e) => handleChange(e, "lastname")} />
                </div>
            </div>

            <div className={"form-field"}>
                <label htmlFor={"address"}>Address</label>
                <input id={"address"} type={"text"} value={credentials.address} maxLength={255} onChange={(e) => handleChange(e, "address")} />
            </div>

            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <label htmlFor={"zip_code"}>Zip code</label>
                    <input id={"zip_code"} type={"text"} value={credentials.zip_code} maxLength={10} onChange={(e) => handleChange(e, "zip_code")} />
                </div>
                
                <div className={"form-field"}>
                    <label htmlFor={"city"}>City</label>
                    <input id={"city"} type={"text"} value={credentials.city} onChange={(e) => handleChange(e, "city")} />
                </div>

                <div className={"form-field"}>
                    <label htmlFor={"country"}>Country</label>
                    <select id={"country"} onChange={(e) => handleChange(e, "country")}>
                        <option>Select a country</option>
                        <option value={"france"}>France</option>
                    </select>
                </div>
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"email"}>Email</label>
                <input id={"email"} type={"email"} value={credentials.email} onChange={(e) => handleChange(e, "email")} disabled />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"phone"}>Phone number</label>
                <input id={"phone"} type={"tel"} value={credentials.phone} maxLength={10} onChange={(e) => handleChange(e, "phone")} />
            </div>
            
            <div className={"form-button mt-15px"}>
                <button className={"btn btn-blue"} type={"submit"}>Submit</button>
            </div>
        </form>
    )
}