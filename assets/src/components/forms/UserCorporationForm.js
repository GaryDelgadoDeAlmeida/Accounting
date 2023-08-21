import React, { useState } from "react";
import axios from "axios";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";

export default function UserCorporationForm() {

    // Form field
    const [credentiels, setCredentials] = useState({
        siren: "",
        siret: "",
        duns_number: ""
    })

    // Form response
    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})

    const handleChange = (e, fieldName) =>  {
        let fieldValue = e.target.value

        switch(fieldName) {
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

            case "duns_number":
                break

            default:
                setFormResponse({classname: "danger", message: `The field '${fieldName}' is forbidden`})
                return
        }

        setCredentials({
            ...credentiels,
            [fieldName]: fieldValue
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        axios
            .post("/api/user/corporation", credentiels)
            .then(res => console.log(res))
            .catch(err => console.error(err))
        ;

        setFormResponse({classname: "information", message: "Section under construction"})
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {Object.keys(formResponse).length > 0 && (<Notification {...formResponse} />)}
            
            <div className={"form-field"}>
                <label htmlFor={"siren"}>Siren</label>
                <input type={"text"} maxLength={9} onChange={(e) => handleChange(e, "siren")} />
            </div>

            <div className={"form-field"}>
                <label htmlFor={"siret"}>Siret</label>
                <input type={"text"} maxLength={14} onChange={(e) => handleChange(e, "siret")} />
            </div>

            <div className={"form-field"}>
                <label htmlFor={"duns_number"}>DUNS Number</label>
                <input type={"text"} maxLength={14} onChange={(e) => handleChange(e, "duns_number")} />
            </div>

            <div className={"form-button"}>
                <button className={"btn btn-blue"} type={"submit"}>Submit</button>
            </div>
        </form>
    )
}