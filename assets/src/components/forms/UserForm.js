import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PrivateResources from "../utils/PrivateResources";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";
import axios from "axios";
import PublicResources from "../utils/PublicResources";

export default function UserForm({userID}) {
    const { loading: userLoading, items: user, load: userLoad } = PrivateResources(`${window.location.origin}/api/profile`)
    const { loading: natLoading, items: nationalities, load: natLoad } = PublicResources("https://restcountries.com/v3.1/all?fields=name")

    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})
    const [credentials, setCredentials] = useState({
        firstname: "",
        lastname: "",
        nationality: "",
        birth_date: "",
    })

    useEffect(() => {
        userLoad()
        natLoad()

        if(!userLoading && Object.keys(user).length > 0) {
            setAllFields(user)
        }
    }, [])

    const setAllFields = (user) => {
        let date = new Date(user.birthDate)
        setCredentials({
            firstname: user.firstname,
            lastname: user.lastname,
            nationality: user.nationality,
            birth_date: date.toLocaleDateString(undefined, {year:"numeric", month:"numeric", day: "numeric"})
        })
    }

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let maxLength = e.target.maxLength > 0 ? e.target.maxLength : 255
        setFormResponse({})

        switch(fieldName) {
            case "firstname":
            case "lastname":
                if(!formControl.checkLength(fieldValue, 1, maxLength)) {
                    setFormResponse({classname: "danger", message: `The ${fieldName} field don't respect the length limitations`})
                    return
                }
                break

            case "nationality":
                break

            case "birth_date":
                break

            default:
                setFormResponse({classname: "danger", message: `The field name '${fieldName}' is forbidden`})
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
            .put(`${window.location.origin}/api/user/${userID}`, credentials, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld",
                    "Authentification": `Bearer ${localStorage.getItem("token")}`
                } 
            })
            .then((response) => {
                console.log(response, response.data)
                setFormResponse({classname: "success", message: "Your account has been successfully updated"})
            })
            .catch((error) => {
                setFormResponse({classname: "danger", message: "An error has been encountered. Please retry later."})
            })
        ;
    }

    return (
        <>
            {!userLoading && Object.keys(user).length > 0 ? (
                <form className={"form"} method={"POST"} onSubmit={(e) => handleSubmit(e)}>
                    {Object.keys(formResponse).length > 0 && (<Notification {...formResponse} />)}
                    <div className={"form-field-inline"}>
                        <div className={"form-field"}>
                            <label htmlFor={"firstname"}>Firstname</label>
                            <input id={"firstname"} type={"text"} value={credentials.firstname !== "" ? credentials.firstname : user.firstname} maxLength={100} onChange={(e) => handleChange(e, "firstname")} />
                        </div>
                        
                        <div className={"form-field"}>
                            <label htmlFor={"lastname"}>Lastname</label>
                            <input id={"lastname"} type={"text"} value={credentials.lastname !== "" ? credentials.lastname : user.lastname} maxLength={150} onChange={(e) => handleChange(e, "lastname")} />
                        </div>
                    </div>
        
                    <div className={"form-field-inline"}>
                        <div className={"form-field"}>
                            <label htmlFor={"nationality"}>Nationality</label>
                            <select id={"nationality"} onChange={(e) => handleChange(e, "nationality")}>
                                <option value={""}>Select a nationality</option>
                                {nationalities.length > 0 && nationalities.map((item, index) => (
                                    <option key={index} value={item.name.common} selected={credentials.nationality === item.name.common ? "selected": false}>{item.name.common}</option>
                                ))}
                            </select>
                        </div>
        
                        <div className={"form-field"}>
                            <label htmlFor={"birth-date"}>Birth date</label>
                            <input type={"date"} onChange={(e) => handleChange(e, "birth_date")} />
                        </div>
                    </div>
                    
                    <div className={"form-button mt-15px"}>
                        <button className={"btn btn-blue"} type={"submit"}>Submit</button>
                    </div>
                </form>
            ) : (
                <p>Loading ...</p>
            )}
        </>
    )
}