import React, { useState } from "react";
import FormControl from "../utils/FormControl";
import Notification from "../parts/Notification";
import PrivatePostRessource from "../utils/PrivatePostRessource";

export default function CompanyForm() {
    const [name, setName] = useState("")
    const [siren, setSiren] = useState("")
    const [siret, setSiret] = useState("")
    const [dnsNumber, setDnsNumber] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [country, setCountry] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")

    const [formResponse, setFormResponse] = useState([])

    const handleChange = (e, fieldName) => {
        const fieldValue = e.target.value
        setFormResponse([])

        switch(fieldName) {
            case "name":
                if(!FormControl.checkLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "Le nom de la société dépasse les limites de caractères."})
                    return
                }

                setName(fieldValue)
                break

            case "siren":
                if(!FormControl.checkNumber(fieldValue) || FormControl.checkLength(value, 0, 9)) {
                    setFormResponse({classname: "danger", message: "Le numéro de SIREN n'est pas conforme."})
                    return
                }

                setSiren(fieldValue)
                break

            case "siret":
                if(!FormControl.checkNumber(fieldValue) || FormControl.checkLength(value, 0, 14)) {
                    setFormResponse({classname: "danger", message: "Le numéro de SIRET n'est pas conforme."})
                    return
                }

                setSiret(fieldValue)
                break

            case "dns_number":
                if(!FormControl.checkNumber(fieldValue) || FormControl.checkLength(value, 0, 14)) {
                    setFormResponse({classname: "danger", message: "Le numéro DNS n'est pas conforme."})
                    return
                }

                setDnsNumber(fieldValue)
                break

            case "address":
                if(!FormControl.checkLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "L'adresse renseigné n'est pas conforme."})
                    return
                }

                setAddress(fieldValue)
                break

            case "city":
                if(!FormControl.checkLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "La ville dépasse les limites de caractères"})
                    return
                }

                setCity(fieldValue)
                break

            case "zip_code":
                if(!FormControl.checkLength(fieldValue, 1, 10)) {
                    setFormResponse({classname: "danger", message: "Le code postal dépasse les limites de caractères"})
                    return
                }

                setZipCode(fieldValue)
                break

            case "country":
                if(!FormControl.checkLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "Le pays dépasse les limites de caractères"})
                    return
                }

                setCountry(fieldValue)
                break

            case "phone":
                if(!FormControl.checkLength(fieldValue, 1, 14)) {
                    setFormResponse({classname: "danger", message: "Le numéro de téléphone dépasse la limite de caractères"})
                    return
                }

                if(!FormControl.checkNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: "Le numéro de téléphone n'est pas un numéro valide"})
                    return
                }

                setPhone(fieldValue)
                break

            case "email":
                if(!FormControl.checkLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "L'adresse email dépasse les limites de caractères"})
                    return
                }

                if(!FormControl.checkEmail(fieldValue)) {
                    setFormResponse({classname: "danger", message: "L'adresse email n'est pas valide"})
                    return
                }

                setEmail(fieldValue)
                break

            default:
                setFormResponse({classname: "danger", message: `Le champ ${fieldName} n'est pas connu.`})
                break
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if([name, siren, siret, dnsNumber, address, city, zipCode, country, phone, email].indexOf("") !== -1) {
            setFormResponse({classname: "danger", message: "Une erreur a été rencontrée, veuillez vérifier que tous les champs soient bien renseigner."})
            return
        }

        await PrivatePostRessource("company", {
            company_name: name, 
            siren: siren, 
            siret: siret, 
            dns_number: dnsNumber, 
            address: address, 
            city: city, 
            zip_code: zipCode, 
            country: country, 
            phone: phone, 
            email: email
        })
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>

            {formResponse.length > 0 && (<Notification {...formResponse} />)}
            
            <div className={"form-field"}>
                <label htmlFor={"company_name"}>Corporation name</label>
                <input id={"company_name"} type={"text"} maxLength={255} onChange={(e) => handleChange(e)} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"siren"}>N°Siren</label>
                <input id={"siren"} type={"number"} maxLength={9} onChange={(e) => handleChange(e)} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"siret"}>N°Siret</label>
                <input id={"siret"} type={"number"} maxLength={14} onChange={(e) => handleChange(e)} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"dns_number"}>N°DNS</label>
                <input id={"dns_number"} type={"number"} maxLength={14} onChange={(e) => handleChange(e)} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"address"}>Address</label>
                <input id={"address"} type={"text"} maxLength={255} onChange={(e) => handleChange(e)} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"city"}>City</label>
                <input id={"city"} type={"text"} maxLength={255} onChange={(e) => handleChange(e)} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"zip_code"}>Zipcode</label>
                <input id={"zip_code"} type={"text"} maxLength={10} onChange={(e) => handleChange(e)} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"country"}>Country</label>
                <input id={"country"} type={"text"} maxLength={255} onChange={(e) => handleChange(e)} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"phone"}>Phone number</label>
                <input id={"phone"} type={"tel"} maxLength={10} onChange={(e) => handleChange(e)} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"email"}>Email</label>
                <input id={"email"} type={"email"} maxLength={255} onChange={(e) => handleChange(e)} />
            </div>
            
            <div className={"form-button mt-15px"}>
                <button className={"btn btn-green"} type={"submit"}>Valider</button>
            </div>
        </form>
    )
}