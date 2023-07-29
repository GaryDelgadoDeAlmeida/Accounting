import React, { useState } from "react";
import FormControl from "../utils/FormControl";
import Notification from "../parts/Notification";
import axios from "axios";

export default function CompanyForm() {
    // Form field
    const [credentiels, setCredentials] = useState({
        name: "", 
        siren: "", 
        siret: "", 
        duns_number: "", 
        address: "", 
        city: "", 
        zip_code: "", 
        country: "", 
        phone: "", 
        email: ""
    })

    // Form response
    const [formResponse, setFormResponse] = useState({})
    const formControl = new FormControl()

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let maxLength = e.target.maxLength !== -1 ? e.target.maxLength : 255;
        setFormResponse({})

        switch(fieldName) {
            case "name":
                if(!formControl.checkLength(fieldValue, 0, maxLength)) {
                    setFormResponse({classname: "danger", message: "Le nom de la société dépasse les limites de caractères."})
                    return
                }
                break

            case "siren":
                if(!formControl.checkNumber(fieldValue) || formControl.checkLength(fieldValue, 0, 9)) {
                    setFormResponse({classname: "danger", message: "Le numéro de SIREN n'est pas conforme."})
                    return
                }
                break

            case "siret":
                if(!formControl.checkNumber(fieldValue) || formControl.checkLength(fieldValue, 0, 14)) {
                    setFormResponse({classname: "danger", message: "Le numéro de SIRET n'est pas conforme."})
                    return
                }
                break

            case "duns_number":
                if(!formControl.checkNumber(fieldValue) || formControl.checkLength(fieldValue, 0, 14)) {
                    setFormResponse({classname: "danger", message: "Le numéro DUNS n'est pas conforme."})
                    return
                }
                break

            case "address":
                if(!formControl.checkLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "L'adresse renseigné n'est pas conforme."})
                    return
                }
                break

            case "city":
                if(!formControl.checkLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "La ville dépasse les limites de caractères"})
                    return
                }
                break

            case "zip_code":
                if(!formControl.checkLength(fieldValue, 1, 10)) {
                    setFormResponse({classname: "danger", message: "Le code postal dépasse les limites de caractères"})
                    return
                }
                break

            case "country":
                if(!formControl.checkLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "Le pays dépasse les limites de caractères"})
                    return
                }
                break

            case "phone":
                if(!formControl.checkLength(fieldValue, 1, 14)) {
                    setFormResponse({classname: "danger", message: "Le numéro de téléphone dépasse la limite de caractères"})
                    return
                }

                if(!formControl.checkNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: "Le numéro de téléphone n'est pas un numéro valide"})
                    return
                }
                break

            case "email":
                if(!formControl.checkLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "L'adresse email dépasse les limites de caractères"})
                    return
                }

                if(!formControl.checkEmail(fieldValue)) {
                    setFormResponse({classname: "danger", message: "L'adresse email n'est pas valide"})
                    return
                }
                break

            default:
                setFormResponse({classname: "danger", message: `Le champ ${fieldName} n'est pas connu.`})
                return
        }

        setCredentials({
            ...credentiels,
            [fieldName]: fieldValue
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(Object.values(credentiels).indexOf("") !== -1) {
            setFormResponse({classname: "danger", message: "Une erreur a été rencontrée, veuillez vérifier que tous les champs soient bien renseigner."})
            return
        }

        if(!formControl.checkNumber(credentiels.siren) || !formControl.checkNumber(credentiels.siret) || !formControl.checkNumber(credentiels.duns_number)) {
            setFormResponse({classname: "danger", message: ""})
            return
        }

        axios
            .post("/api/company", credentiels)
            .then(res => console.log(res))
            .catch(err => console.err(err))
        ;

        setFormResponse({classname: "information", message: "Submit under construction. Try again later"})
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>

            {Object.keys(formResponse).length > 0 && (<Notification {...formResponse} />)}
            
            <div className={"form-field"}>
                <label htmlFor={"company_name"}>Corporation name</label>
                <input id={"company_name"} type={"text"} value={credentiels.name} maxLength={255} onChange={(e) => handleChange(e, "name")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"siren"}>N°Siren</label>
                <input id={"siren"} type={"number"} value={credentiels.siren} maxLength={9} onChange={(e) => handleChange(e, "siren")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"siret"}>N°Siret</label>
                <input id={"siret"} type={"number"} value={credentiels.siret} maxLength={14} onChange={(e) => handleChange(e, "siren")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"duns_number"}>N°DUNS</label>
                <input id={"duns_number"} type={"number"} value={credentiels.duns_number} maxLength={14} onChange={(e) => handleChange(e, "duns_number")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"address"}>Address</label>
                <input id={"address"} type={"text"} value={credentiels.address} maxLength={255} onChange={(e) => handleChange(e, "address")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"city"}>City</label>
                <input id={"city"} type={"text"} value={credentiels.city} maxLength={255} onChange={(e) => handleChange(e, "city")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"zip_code"}>Zipcode</label>
                <input id={"zip_code"} type={"text"} value={credentiels.zip_code} maxLength={10} onChange={(e) => handleChange(e, "zip_code")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"country"}>Country</label>
                <input id={"country"} type={"text"} value={credentiels.country} maxLength={255} onChange={(e) => handleChange(e, "country")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"phone"}>Phone number</label>
                <input id={"phone"} type={"tel"} value={credentiels.phone} maxLength={10} onChange={(e) => handleChange(e, "phone")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"email"}>Email</label>
                <input id={"email"} type={"email"} value={credentiels.email} maxLength={255} onChange={(e) => handleChange(e, "email")} />
            </div>
            
            <div className={"form-button mt-15px"}>
                <button className={"btn btn-green"} type={"submit"}>Valider</button>
            </div>
        </form>
    )
}