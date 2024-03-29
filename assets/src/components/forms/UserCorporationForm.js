import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";
import PublicResources from "../utils/PublicResources";
import JuridicalStatusField from "./parts/JuridicalStatusField";

export default function UserCorporationForm({freelance}) {

    const { loading, items: countries, load } = PublicResources("https://restcountries.com/v3.1/all?fields=name")

    // Form field
    const [credentials, setCredentials] = useState({
        name: freelance != null ? freelance.name : "",
        status: "",
        address: freelance != null ? freelance.address : "",
        city: freelance != null ? freelance.city : "",
        zip_code: freelance != null ? freelance.zipCode : "",
        country: freelance != null ? freelance.country : "",
        siren: freelance != null ? freelance.siren : "",
        siret: freelance != null ? freelance.siret : "",
        phone: "",
        duns_number: freelance != null ? freelance.dunsNumber : ""
    })

    useEffect(() => {
        load()
    }, [])

    // Form response
    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})

    const handleChange = (e, fieldName) =>  {
        let fieldValue = e.target.value
        let maxLength = e.target.getAttribute("maxLength") ?? 255

        switch(fieldName) {
            case "name":
            case "address":
            case "zip_code":
            case "city":
            case "country":
                if(!formControl.checkLength(fieldValue, 1, maxLength)) {
                    setFormResponse({classname: "danger", message: `The ${fieldName} field don't respect the length limitations`})
                    return
                }
                break

            case "siren":
                if(!formControl.checkNumber(fieldValue)) {
                    setFormResponse({classname: "dnager", message: `The value of the field '${fieldName}' isn't numeric.`})
                    return
                }

                if(!formControl.checkMaxLength(fieldValue, 9)) {
                    setFormResponse({classname: "danger", message: `The value of the field '${fieldName}' must be equal to 9`})
                    return
                }
                break

            case "duns_number":
            case "siret":
                if(!formControl.checkNumber(fieldValue)) {
                    setFormResponse({classname: "dnager", message: `The value of the field '${fieldName}' isn't numeric.`})
                    return
                }

                if(!formControl.checkMaxLength(fieldValue, 14)) {
                    setFormResponse({classname: "danger", message: `The value of the field '${fieldName}' must be equal to 14`})
                    return
                }
                break

            case "status":
                break;

            default:
                setFormResponse({classname: "danger", message: `The field '${fieldName}' is forbidden`})
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
            .post("/api/profile/freelance", credentials, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            .then((response) => {
                setFormResponse({classname: "success", message: "Your company has been updated."})
            })
            .catch(({response}) => {
                let errorMessage = "An error has been encountered. Please, retry later or contact the staff is the error persist."
                if(response.data != "") {
                    errorMessage = response.data
                }

                setFormResponse({classname: "danger", message: errorMessage})
            })
        ;
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {Object.keys(formResponse).length > 0 && (<Notification {...formResponse} />)}

            <div className={"form-field"}>
                <label htmlFor={"name"}>Name</label>
                <input id={"name"} type={"text"} value={credentials.name} maxLength={255} onChange={(e) => handleChange(e, "name")} />
            </div>

            <JuridicalStatusField handleChange={handleChange} juridicalStatus={credentials.status} />

            <div className={"form-field"}>
                <label htmlFor={"address"}>Address</label>
                <input id={"address"} type={"text"} value={credentials.address} onChange={(e) => handleChange(e, "address")}/>
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
                        {!loading && countries.length > 0 && countries.map((item, index) => (
                            <option key={index} value={item.name.common} selected={item.name.common === credentials.country ? true : false}>{item.name.common}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className={"form-field-inline"}>
                <div className={"form-field"}>
                    <label htmlFor={"siren"}>SIREN</label>
                    <input type={"text"} placeholder={"EX : 914 002 308"} value={credentials.siren} maxLength={9} onChange={(e) => handleChange(e, "siren")} />
                </div>

                <div className={"form-field"}>
                    <label htmlFor={"siret"}>SIRET</label>
                    <input type={"text"} placeholder={"EX : 914 002 308 00015"} value={credentials.siret} maxLength={14} onChange={(e) => handleChange(e, "siret")} />
                </div>
            </div>

            <div className={"form-field"}>
                <label htmlFor={"duns_number"}>DUNS Number</label>
                <input type={"text"} placeholder={"EX : 15-048-3782"} maxLength={14} onChange={(e) => handleChange(e, "duns_number")} />
            </div>

            <div className={"form-button"}>
                <button className={"btn btn-blue"} type={"submit"}>Submit</button>
            </div>
        </form>
    )
}