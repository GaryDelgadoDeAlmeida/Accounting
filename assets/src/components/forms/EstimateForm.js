import React, { useEffect, useState } from "react";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";
import PrivateResources from "../utils/PrivateResources";
import axios from "axios";

export default function EstimateForm() {
    const currentDate = new Date()
    const formControl = new FormControl()
    const {loading, items: companies, load} = PrivateResources(window.location.origin + "/api/companies")
    
    const [credentials, setCredentials] = useState({
        date: "",
        company: "",
        details: {}
    })
    const [credentialDetails, setCredentialDetails] = useState({
        title: "",
        description: "",
        budget: 0
    })

    const [formResponse, setFormResponse] = useState({})

    useEffect(() => {
        load()
    }, [])

    const handleNew = (e) => {
        setCredentials({
            ...credentials,
            details: {...credentialDetails}
        })
        
        setCredentialDetails({
            title: "",
            description: "",
            budget: 0
        })
    }

    const handleRemove = (e) => {
        console.log("Hi handleRemove")
        let estimateID = e.target.getAttribute("data-estimateid")
    }

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value

        setFormResponse({})

        switch(fieldName) {
            case "company":
                if( !formControl.checkMinLength(fieldValue, 0) && formControl.checkChoiceFromObject(companies, "id", fieldValue) ) {
                    setFormResponse({classname: "danger", message: `Unknown choice option ${fieldValue}`})
                    return
                }
                break

            case "date":
                let diff = new Date(new Date(fieldValue) - currentDate)
                let 
                    year = diff.getUTCFullYear() - 1970,
                    month = diff.getUTCMonth(),
                    day = diff.getUTCDate() - 1
                ;
                if(year < 0 && (month > 0 || day < 0)) {
                    setFormResponse({classname: "danger", message: "The date must be superior to the current date"})
                    return
                }
                break

            case "title":
                if(!formControl.checkMaxLength(fieldValue, 255)) {
                    setFormResponse({classname: "danger", message: "The title exceed 255 characters length"})
                    return
                }
                break
            
            case "description":
                if(!formControl.checkMaxLength(fieldValue, 1000)) {
                    setFormResponse({classname: "danger", message: "The description exceed 1000 characters length"})
                    return
                }
                break
            
            case "budget":
                if(!formControl.checkNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: `The field name ${fieldName}`})
                    return
                }
                break
            
            default:
                setFormResponse({classname: "danger", message: `The field name ${fieldName} is forbidden.`})
                return
        }

        console.log(["title", "description", "budget"].includes(fieldName))
        if(["title", "description", "budget"].includes(fieldName)) {
            setCredentialDetails({
                ...credentialDetails,
                [fieldName]: fieldValue
            })
        } else {
            setCredentials({
                ...credentials, 
                [fieldName]: fieldValue
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let diff = new Date(new Date(credentials.date) - currentDate )
        let 
            year = diff.getUTCFullYear() - 1970,
            month = diff.getUTCMonth()
            day = diff.getUTCDay() - 1
        ;
        if(year < 0 && (month > 0 || day > 0)) {
            setFormResponse({classname: "danger", message: "The date must be superior to the current date"})
            return
        }

        console.log("Under construction")
        return

        // Send data to API
        axios
            .post(window.location.origin + "/api/estimate", credentials, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                console.log(res.data)

                // Reset all fields to an empty value
                setCredentialDetails({
                    title: "",
                    description: "",
                    budget: 0
                })
            })
            .catch(err => {
                console.log(err)
            })
        ;

        // Return a response to the user
        setFormResponse({classname: "success", message: "Successfully added"})
    }

    return (
        <>
            {!loading ? (
                <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
                    <div className={"d-flex-row"}>
                        <div className={"card item-row"}>
                            <div className={"-content"}>
                                {Object.keys(formResponse).length > 0 && (<Notification {...formResponse} />)}

                                <div className={"form-field"}>
                                    <label htmlFor={"company"}>Company</label>
                                    <select id={"company"} name={"company"} onChange={(e) => handleChange(e, "company")}>
                                        <option value={""}>Select a company</option>
                                        {companies.length > 0 && companies.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)}
                                    </select>
                                </div>
                                
                                <div className={"form-field"}>
                                    <label htmlFor={"date"}>Date</label>
                                    <input type={"date"} min={currentDate.toLocaleDateString()} onChange={(e) => handleChange(e, "date")} />
                                </div>
                            </div>
                            <div className="-header">
                                <label>Invoice details</label>
                            </div>
                            <div className="-content">
                                <div className={"form-field"}>
                                    <label htmlFor={"title"}>Title</label>
                                    <input type={"text"} maxLength={"255"} value={credentialDetails.title} onChange={(e) => handleChange(e, "title")} />
                                </div>
                                
                                <div className={"form-field"}>
                                    <label htmlFor={"description"}>Description</label>
                                    <textarea id={"description"} onChange={(e) => handleChange(e, "description")}>{credentialDetails.description}</textarea>
                                </div>
                                
                                <div className={"form-field"}>
                                    <label htmlFor={"budget"}>Budget</label>
                                    <input id={"budget"} type={"number"} min={0} value={credentialDetails.budget} onChange={(e) => handleChange(e, "budget")} />
                                </div>
                                
                                <div className={"form-button"}>
                                    <button className={"btn btn-blue"} type={"button"} onClick={(e) => handleNew(e)}>Ajouter</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className={"card item-row"}>
                            <div className={"-content"}>
                                <table className={"table"}>
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Amount (€)</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {credentials.details.length > 0 && credentials.details.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.title}</td>
                                                <td className={"txt-center"}>{item.budget}</td>
                                                <td className={"txt-right"}>
                                                    <button className={"btn btn-red"} onClick={(e) => handleRemove(e)}>
                                                        <img src={`${window.location.origin}/public/content/svg/trash-white.svg`} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <button className={"btn btn-blue mt-15px w-100 h-40px"} type={"submit"}>Register the estimate</button>
                </form>
            ) : (
                <Notification classname={"information"} message={"Loading ..."} />
            )}   
        </>
    )
}