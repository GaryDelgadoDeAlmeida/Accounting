import React, { useEffect, useState } from "react";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";
import PrivateResources from "../utils/PrivateResources";
import axios from "axios";

export default function EstimateForm({estimate = null, companyID = null}) {
    let details = {}
    const currentDate = new Date()
    const formControl = new FormControl()
    const {loading = true, items: companies, load} = PrivateResources(`${window.location.origin}/api/companies`)
    
    const [credentials, setCredentials] = useState({
        date: "",
        company: "",
        details: estimate != null ? {...estimate.estimateDetails} : {}
    })
    const [credentialDetails, setCredentialDetails] = useState({
        title: "",
        description: "",
        quantity: 1,
        nbr_days: 1,
        budget: 0
    })

    const [formResponse, setFormResponse] = useState({})

    useEffect(() => {
        load()
    }, [])

    const handleNew = (e) => {
        let estimateDetails = document.getElementById("estimate-details")
        let estimateDetailRow = estimateDetails.children.length
        setCredentials({
            ...credentials,
            details: {
                ...credentials.details,
                [estimateDetailRow]: {
                    ...credentials.details[estimateDetailRow],
                    ...credentialDetails
                }
            }
        })
        
        setCredentialDetails({
            title: "",
            description: "",
            quantity: 1,
            nbr_days: 1,
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
                fieldValue = parseInt(fieldValue)
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

            case "quantity":
            case "nbr_days":
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

        if(["title", "description", "quantity", "nbr_days", "budget"].includes(fieldName)) {
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

        let diff = new Date( new Date(credentials.date) - currentDate )
        let 
            year = diff.getUTCFullYear() - 1970,
            month = diff.getUTCMonth(),
            day = diff.getUTCDay() - 1
        ;
        if(year < 0 && (month > 0 || day > 0)) {
            setFormResponse({classname: "danger", message: "The date must be superior to the current date"})
            return
        }

        if(!formControl.checkMinLength(credentials.date, 1) || !formControl.checkMinLength(credentials.company, 1)) {
            setFormResponse({classname: "danger", message: "The date or the company is missing, please fill all missing fields."})
            return
        }

        if(Object.keys(credentials.details).length < 1) {
            setFormResponse({classname: "danger", message: "The estimate have no details. You can't submit an estimate without any information"})
            return
        }

        let url = `${window.location.origin}/api/estimate`
        if(estimate !== null) {
            url = `${window.location.origin}/api/estimate/${estimate.id}/update`
        }

        // Send data to API
        axios
            .post(`${window.location.origin}/api/estimate`, credentials, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                // Reset all fields to an empty value
                setCredentialDetails({
                    title: "",
                    description: "",
                    quantity: 1,
                    nbr_days: 1,
                    budget: 0
                })

                // Return a response to the user
                setFormResponse({classname: "success", message: "Successfully added"})
            })
            .catch(({response}) => {
                let errorMessage = "An error has been encountered. Please, retry more later"
                if(response.data != "") {
                    if(typeof response.data == "object") {
                        errorMessage = response.data.detail
                    } else {
                        errorMessage = response.data
                    }
                }
                setFormResponse({classname: "danger", message: errorMessage})
            })
        ;
    }

    return (
        <>
            {!loading ? (
                <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
                    {Object.keys(formResponse).length > 0 && (<Notification {...formResponse} />)}
                    
                    <div className={"d-flex-row -g-15px"}>
                        <div className={"card item-row"}>
                            <div className={"-content"}>
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
                                    <label htmlFor={"quantity"}>Quantity</label>
                                    <input id={"quantity"} type={"number"} min={1} value={credentialDetails.quantity} onChange={(e) => handleChange(e, "quantity")} />
                                </div>

                                <div className={"form-field"}>
                                    <label htmlFor={"daystime"}>Number of days</label>
                                    <input id={"daystime"} type={"number"} min={1} value={credentialDetails.nbr_days} onChange={(e) => handleChange(e, "nbr_days")} />
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
                                            <th>Quantity</th>
                                            <th>Amount Unit. (€)</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody id={"estimate-details"}>
                                        {Object.keys(credentials.details).length > 0 && typeof credentials.details == "object" && Object.values(credentials.details).map((item, index) => (
                                            <tr key={index}>
                                                <td className={"-title"}>{item.label}</td>
                                                <td className={"-quantity txt-center"}>{item.quantity}</td>
                                                <td className={"-price txt-center"}>{item.price}</td>
                                                <td className={"-action txt-right"}>
                                                    <button type={"button"} className={"btn btn-red -inline-flex"} onClick={(e) => handleRemove(e)}>
                                                        <img src={`${window.location.origin}/content/svg/trash-white.svg`} />
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