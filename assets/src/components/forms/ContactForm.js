import React, { useState } from "react";
import FormControl from "../utils/FormControl";
import Notification from "../parts/Notification";
import axios from "axios";

export default function ContactForm() {

    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})
    const [credentials, setCredentials] = useState({
        subject: "",
        message: ""
    })

    const emptifyField = () => {
        setCredentials({
            subject: "",
            message: ""
        })
    }

    const handleChange = (e, fieldName) => {
        setFormResponse({})
        const fieldValue = e.target.value

        switch(fieldName) {
            case "subject":
                if(fieldValue.length > 255) {
                    setFormResponse({classname: "danger", message: "Le champ 'subject' ne resptecte pas la limitation de caractère."})
                    return
                }
                break

            case "message":
                if(fieldValue.length > 1000) {
                    setFormResponse({classname: "danger", message: "Le champ 'message' ne resptecte pas la limitation de caractère."})
                    return
                }
                break

            default:
                setFormResponse({classname: "danger", message: `Le champ ${fieldName} n'est pas un champ autorisé`})
                break
        }

        setCredentials({
            ...credentials,
            [fieldName]: fieldValue
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if(credentials.subject === "" || credentials.message === "") {
            setFormResponse({classname: "danger", message: "Une erreur a été rencontrée. Veuillez vérifier les champs renseignés"})
            return
        }

        axios
            .post("/api/contact", credentials, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                setFormResponse({classname: "success", message: res.data.message})
                emptifyField()
            })
            .catch(err => console.error(err))
        ;
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {Object.keys(formResponse).length > 0 && (
                <Notification {...formResponse} />
            )}

            <div className={"form-field"}>
                <select onChange={(e) => handleChange(e, "subject")}>
                    <option value={""}>Select a subject</option>
                    <option value={"disclamer"}>Disclamer : Something happened ?</option>
                    <option value={"report"}>Report : You did an error and you want to correct it ?</option>
                    <option value={"help"}>Help : You need an information ?</option>
                </select>
            </div>
            
            <div className={"form-field"}>
                <textarea className={"h-150px"} name={"message"} placeholder={"Votre message ..."} value={credentials.message} maxLength={1000} onChange={(e) => handleChange(e, "message")}></textarea>
                <small className={"txt-right"}>{credentials.message.length} / 1000</small>
            </div>
            
            <div className={"form-button"}>
                <button className={"btn btn-blue"} type={"submit"}>Envoyer</button>
            </div>
        </form>
    )
}