import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PrivateResources from "../utils/PrivateResources";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";

export default function UserForm() {
    const { userID } = useParams()
    const { loading, items: user, load } = PrivateResources("user/" + userID)

    // Form field
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [address, setAddress] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    // Commum
    const [formResponse, setFormResponse] = useState({})

    // useEffect(() => {
    //     load()

    //     if(loading) {
    //         setAllFields(user)
    //     }
    // }, [])

    const setAllFields = (user) => {
        setFirstname(user.firstname)
        setLastname(user.lastname)
        setAddress(user.address)
        setZipCode(user.zip_code)
        setCity(user.city)
        setCountry(user.country)
        setEmail(user.email)
        setPhone(user.phone)
    }

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let maxLength = e.target.maxLength > 0 ? e.target.maxLength : 255
        setFormResponse({})

        switch(fieldName) {
            case "firstname":
                if(!FormControl.checkLength(fieldValue, 1, maxLength)) {
                    setFormResponse({classname: "danger", message: `The ${fieldName} field don't respect the length limitations`})
                    return
                }

                setFirstname(fieldValue)
                break

            case "lastname":
                if(!FormControl.checkLength(fieldValue, 1, maxLength)) {
                    setFormResponse({classname: "danger", message: `The ${fieldName} field don't respect the length limitations`})
                    return
                }

                setLastname(fieldValue)
                break

            case "address":
                if(!FormControl.checkMinLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: `The ${fieldName} field can't be empty`})
                    return
                }

                setAddress(fieldValue)
                break

            case "zip_code":
                break

            case "city":
                break

            case "country":
                break

            case "email":
                break

            case "phone":
                // Remove all space in the string
                fieldValue = fieldValue.replaceAll(" ", "")

                // If phone number is empty
                if(!FormControl.checkMinLength(fieldValue, 1)) {
                    setPhone(fieldValue)
                } else {
                    // If phone number is valid
                    if(!FormControl.checkPhone(fieldValue)) {
                        setFormResponse({classname: "danger", message: "The phone number is invalid"})
                        return
                    }

                    setPhone(fieldValue)
                }
                break

            default:
                setFormResponse({classname: "danger", message: `The ${fieldName} field is forbidden`})
                break
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <form className={"form"} method={"POST"} onSubmit={(e) => handleSubmit(e)}>
            
            {Object.keys(formResponse).length > 0 && (<Notification {...formResponse} />)}

            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <label htmlFor={"firstname"}>Firstname</label>
                    <input id={"firstname"} type={"text"} maxLength={100} onChange={(e) => handleChange(e, "firstname")} />
                </div>
                
                <div className={"form-field"}>
                    <label htmlFor={"lastname"}>Lastname</label>
                    <input id={"lastname"} type={"text"} maxLength={150} onChange={(e) => handleChange(e, "lastname")} />
                </div>
            </div>

            <div className={"form-field"}>
                <label htmlFor={"address"}>Address</label>
                <input id={"address"} type={"text"} maxLength={255} onChange={(e) => handleChange(e, "address")} />
            </div>

            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <label htmlFor={"zip_code"}>Zip code</label>
                    <input id={"zip_code"} type={"text"} onChange={(e) => handleChange(e, "zip_code")} />
                </div>
                
                <div className={"form-field"}>
                    <label htmlFor={"city"}>City</label>
                    <input id={"city"} type={"text"} onChange={(e) => handleChange(e, "city")} />
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
                <input id={"email"} type={"email"} onChange={(e) => handleChange(e, "email")} disabled />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"phone"}>Phone number</label>
                <input id={"phone"} type={"tel"} maxLength={10} onChange={(e) => handleChange(e, "phone")} />
            </div>
            
            <div className={"form-button mt-15px"}>
                <button className={"btn btn-blue"} type={"submit"}>Submit</button>
            </div>
        </form>
    )
}