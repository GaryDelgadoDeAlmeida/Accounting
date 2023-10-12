import React, { useEffect, useState } from "react";
import FormControl from "../utils/FormControl";
import Notification from "../parts/Notification";
import axios from "axios";
import PublicResources from "../utils/PublicResources";

export default function CompanyForm({userID, company = {}}) {
    const { loading, items: countries, load } = PublicResources("https://restcountries.com/v3.1/all?fields=name")
    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})
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

    useEffect(() => {
        load()
    }, [])

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
                if(!formControl.checkLength(fieldValue, 0, 10)) {
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
                if(!formControl.checkLength(fieldValue, 0, 14)) {
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
            .post("/api/user/" + userID + "/company", credentiels, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld"
                }
            })
            .then(res => {
                console.log(res)
                setFormResponse({classname: "success", message: "La société a bien été ajouté parmis vos clients"})
            })
            .catch(err => {
                console.err(err)
                setFormResponse({classname: "danger", message: "An error has been encountered. Please, retry later"})
            })
        ;
    }

    return (
        <>
            {!loading ? (
                <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
                    {Object.keys(formResponse).length > 0 && (<Notification {...formResponse} />)}
                    
                    <div className={"form-field"}>
                        <label htmlFor={"company_name"}>Corporation name</label>
                        <input id={"company_name"} type={"text"} value={credentiels.name !== "" ? credentiels.name : company.name } maxLength={255} onChange={(e) => handleChange(e, "name")} />
                    </div>
        
                    <div className={"form-field"}>
                        <label htmlFor={"status"}>Juridical status</label>
                        <select id={"status"} onChange={(e) => handleChange(e, "status")}>
                            <option value={""}>Select a juridical status</option>
                            <option value={"ei"}>Entreprise individuelle (EI)</option>
                            <option value={"eurl"}>Entreprise unipersonnelle à responsabilité limitée (EURL)</option>
                            <option value={"sarl"}>Société à responsabilité limitée (SARL)</option>
                            <option value={"sa"}>Société anonyme (SA)</option>
                            <option value={"sas_sasu"}>Société par actions simplifiée (SAS) ou société par actions simplifiée unipersonnelle (SASU)</option>
                        </select>
                    </div>
                    
                    <div className={"form-field-inline"}>
                        <div className={"form-field"}>
                            <label htmlFor={"siren"}>N°SIREN</label>
                            <input id={"siren"} type={"number"} placeholder={"EX : 914 002 308"} value={credentiels.siren !== "" ? credentiels.siren : company.siren } maxLength={9} onChange={(e) => handleChange(e, "siren")} />
                        </div>
                        
                        <div className={"form-field"}>
                            <label htmlFor={"siret"}>N°SIRET</label>
                            <input id={"siret"} type={"number"} placeholder={"EX : 914 002 308 00015"} value={credentiels.siret !== "" ? credentiels.siret : company.siret} maxLength={14} onChange={(e) => handleChange(e, "siren")} />
                        </div>
                    </div>
                    
                    <div className={"form-field"}>
                        <label htmlFor={"duns_number"}>N°DUNS</label>
                        <input id={"duns_number"} type={"number"} placeholder={"EX : 15-048-3782"} value={credentiels.duns_number !== "" ? credentiels.duns_number : company.dunsNumber} maxLength={14} onChange={(e) => handleChange(e, "duns_number")} />
                    </div>
                    
                    <div className={"form-field"}>
                        <label htmlFor={"address"}>Address</label>
                        <input id={"address"} type={"text"} value={credentiels.address !== "" ? credentiels.address : company.address} maxLength={255} onChange={(e) => handleChange(e, "address")} />
                    </div>
                    
                    <div className={"form-field-inline"}>
                        <div className={"form-field"}>
                            <label htmlFor={"city"}>City</label>
                            <input id={"city"} type={"text"} value={credentiels.city !== "" ? credentiels.city : company.city} maxLength={255} onChange={(e) => handleChange(e, "city")} />
                        </div>
                        
                        <div className={"form-field"}>
                            <label htmlFor={"zip_code"}>Zip code</label>
                            <input id={"zip_code"} type={"text"} value={credentiels.zip_code !== "" ? credentiels.zip_code : company.zipCode} maxLength={10} onChange={(e) => handleChange(e, "zip_code")} />
                        </div>
                        
                        <div className={"form-field"}>
                            <label htmlFor={"country"}>Country</label>
                            <select id={"country"} onChange={(e) => handleChange(e, "country")}>
                                <option value={""}>Select a country</option>
                                {countries.length > 0 && countries.map((item, index) => (
                                    <option 
                                        key={index} 
                                        value={item.name.common} 
                                        selected={(credentiels.country != "" && credentiels.country === item.name.common) || (company.country === item.name.common) ? "selected" : false}
                                    >{item.name.common}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className={"form-field"}>
                        <label htmlFor={"email"}>Email</label>
                        <input id={"email"} type={"email"} value={credentiels.email !== "" ? credentiels.email : company.email} maxLength={255} onChange={(e) => handleChange(e, "email")} />
                    </div>
                    
                    <div className={"form-field"}>
                        <label htmlFor={"phone"}>Phone number</label>
                        <input id={"phone"} type={"tel"} value={credentiels.phone !== "" ? credentiels.phone : company.phone} maxLength={10} onChange={(e) => handleChange(e, "phone")} />
                    </div>
                    
                    <div className={"form-button mt-15px"}>
                        <button className={"btn btn-green"} type={"submit"}>Valider</button>
                    </div>
                </form>
            ) : (
                <Notification clasname={"information"} message={"Loading ..."} />
            )}
        </>
    )
}