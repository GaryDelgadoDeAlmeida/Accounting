import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PrivateResources from "../utils/PrivateResources";

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

        switch(fieldName) {
            case "":
                break

            default:
                break
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <form className={"form"} method={"POST"} onSubmit={(e) => handleSubmit(e)}>
            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <label htmlFor={"firstname"}>Firstname</label>
                    <input id={"firstname"} type={"text"} onChange={(e) => handleChange(e, "firstname")} />
                </div>
                
                <div className={"form-field"}>
                    <label htmlFor={"lastname"}>Lastname</label>
                    <input id={"lastname"} type={"text"} onChange={(e) => handleChange(e, "lastname")} />
                </div>
            </div>

            <div className={"form-field"}>
                <label htmlFor={"address"}>Address</label>
                <input id={"address"} type={"text"} onChange={(e) => handleChange(e, "address")} />
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
                <input id={"phone"} type={"tel"} onChange={(e) => handleChange(e, "phone")} />
            </div>
            
            <div className={"form-button mt-15px"}>
                <button className={"btn btn-blue"} type={"submit"}>Submit</button>
            </div>
        </form>
    )
}