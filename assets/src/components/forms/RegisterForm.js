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
        address: "",
        zip_code: "",
        city: "",
        country: "",
        phone: "",
        email: "",
        password: ""
    })
    const [countries, setCountries] = useState({})
    
    // Form response
    const [formResponse, setFormResponse] = useState({})
    const formControl =  new FormControl()

    useEffect(() => {
        axios
            .get("https://restcountries.com/v3.1/all?fields=name,cca2")
            .then(res => {
                if(res.status === 200) {
                    console.log(res.data)
                    // res.data.map(item => setCountries({
                    //     ...countries,
                    //     [item.cca2]: item.name.commom
                    // }))
                }
            })
            .catch(err => console.error(err))
        ;

        console.log(countries)
    })

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let maxLength = e.target.maxLength != -1 ? e.target.maxLength : 255
        setFormResponse({})

        console.log(fieldName, fieldValue)

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

            case "address":
                if(!formControl.checkMaxLength(fieldValue, maxLength)) {
                    setFormResponse({classname: "danger", message: "A length limitation error has been found with the address"})
                    return
                }
                break

            case "zip_code":
                if(!formControl.checkLength(fieldValue, 1, 10)) {
                    setFormResponse({classname: "danger", message: "The zip code don't respect length limitation"})
                    return
                }

                if(!formControl.checkNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: "The zip code format is forbidden. It must be a number"})
                    return
                }
                break

            case "city":
                if(!formControl.checkLength(fieldValue, 1, maxLength)) {
                    setFormResponse({classname: "danger", message: "A length limitation error has been found with the city field"})
                    return
                }
                break
            
            case "country":
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

            case "password":
                // Check if the password have a minimum length
                if(!formControl.checkMinLength(fieldValue, 8)) {
                    setFormResponse({classname: "danger", message: "The password should be at minimum 8 caracters"})
                    return
                }

                // Check if the pasword have all means to be a secured password
                if(!formControl.checkPassword(fieldValue)) {
                    setFormResponse({classname: "danger", message: "The password is not secure."})
                    return
                }
                break

            case "phone":
                // Remove space in the string to perform a regex check
                fieldValue = fieldValue.replaceAll(" ", "")

                // Check if the phone number is valid
                if(!formControl.checkPhone(fieldValue)) {
                    setFormResponse({classname: "danger", message: "The phone number format isn't valid"})
                    return
                }
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

        // Check if a field is empty
        if(!formControl.checkMinLength(credentials.country, 1)) {
            setFormResponse({classname: "danger", message: "The country can't be empty"})
            return
        }

        // Send all data to the API in order to create a new account
        axios
            .post("/api/register", credentials)
            .then(res => console.log(res))
            .catch(err => console.error(err))
        ;

        setFormResponse({classname: "success", message: "The account has been successfully registered"})
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
                <input type={"text"} placeholder={"Address"} onChange={(e) => handleChange(e, "address")} />
            </div>

            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <input type={"text"} placeholder={"Zip code"} onChange={(e) => handleChange(e, "zip_code")} />
                </div>
                <div className={"form-field"}>
                    <input type={"text"} placeholder={"City"} onChange={(e) => handleChange(e, "city")} />
                </div>
                <div className={"form-field"}>
                    <select onChange={(e) => handleChange(e, "country")}>
                        <option value={""}>Select a country</option>
                        <option value={"france"}>France</option>
                    </select>
                </div>
            </div>
            
            <div className={"form-field"}>
                <input type={"tel"} pattern="[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}" placeholder={"Phone"} onChange={(e) => handleChange(e, "phone")} />
                <small className={"txt-right"}>Ex: 01 00 00 00 00</small>
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