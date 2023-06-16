import React, { useState } from "react";
import Notification from "../parts/Notification";
import PrivatePostRessource from "../utils/PrivatePostRessource";

export default function ContactForm() {

    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [formResponse, setFormResponse] = useState([])

    const handleChange = (e, fieldName) => {
        setFormResponse([])
        const fieldValue = e.target.value

        switch(fieldName) {
            case "subject":
                if(fieldValue.length > 255) {
                    setFormResponse({classname: "danger", message: "Le champ 'subject' ne resptecte pas la limitation de caractère."})
                    return
                }

                setSubject(fieldValue)
                break

            case "message":
                if(fieldValue.length > 1000) {
                    setFormResponse({classname: "danger", message: "Le champ 'message' ne resptecte pas la limitation de caractère."})
                    return
                }

                setMessage(fieldValue)
                break

            default:
                setFormResponse({classname: "danger", message: `Le champ ${fieldName} n'est pas un champ autorisé`})
                break
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if(subject === "" || message === "") {
            setFormResponse({classname: "danger", message: "Une erreur a été rencontrée. Veuillez vérifier les champs renseignés"})
            return
        }

        // Send data to API
        await PrivatePostRessource("contact", {
            subject: subject,
            message: message
        })

        // Return a response to the user
        setFormResponse({classname: "success", message: "Votre message a bien été envoyé"})
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {formResponse.length > 0 && (<Notification {...formResponse} />)}

            <div className={"form-field"}>
                <input id={"subject"} type={"text"} maxLength={255} placeholder={"Subject"} onChange={(e) => handleChange(e, "subject")} />
            </div>
            
            <div className={"form-field"}>
                <textarea name={"message"} placeholder={"Votre message ..."} maxLength={1000} onChange={(e) => handleChange(e, "message")}></textarea>
                <small className={"txt-right"}>{message.length} / 1000</small>
            </div>
            
            <div className={"form-button"}>
                <button className={"btn btn-blue"} type={"submit"}>Envoyer</button>
            </div>
        </form>
    )
}