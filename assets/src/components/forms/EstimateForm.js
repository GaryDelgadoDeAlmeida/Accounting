import React, { useEffect, useState } from "react";
import Notification from "../parts/Notification";
import PrivatePostRessource from "../utils/PrivatePostRessource";
import FormControl from "../utils/FormControl";
import axios from "axios";

export default function EstimateForm() {
    const [estimates, setEstimates] = useState({})
    const [companies, setCompanes] = useState({})
    const formControl = new FormControl()
    
    const [company, setCompany] = useState({})
    const [date, setDate] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [budget, setBudget] = useState(0)
    const [credentials, setCredentials] = useState({})

    const [formResponse, setFormResponse] = useState({})

    useEffect(() => {
        axios
            .get(window.location.origin + "/api/companies")
            .then(res => {
                console.log(res, res.data)
            })
            .catch(err => console.log(err))
        ;
    }, [])

    const resetFields = () => {
        setTitle("")
        setDescription("")
        setBudget(0)
    }

    const handleRemove = (e) => {
        console.log("Hi handleRemove")
        let estimateID = e.target.getAttribute("data-estimateid")
    }

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        setFormResponse({})

        switch(fieldName) {
            case "title":
                if(!formControl.checkMaxLength(fieldValue, 255)) {
                    setFormResponse({classname: "danger", message: ""})
                    return
                }
                break

            case "date":
                console.log(
                    Date.parse(fieldValue),
                    Date.parse(fieldValue).toISOString(),
                    Date.now(),
                    Date.now().toISOString(),
                )
                break
            
            case "description":
                if(!formControl.checkMaxLength(fieldValue, 1000)) {
                    setFormResponse({classname: "danger", message: ""})
                    return
                }
                break
            
            case "budget":
                if(!formControl.checkNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: `The field name ${fieldName}`})
                }
                break
            
            default:
                setFormResponse({classname: "danger", message: `The field name ${fieldName} is forbidden.`})
                return
        }

        setCredentials({
            ...credentials, 
            [fieldName]: fieldValue
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if([title, description, budget].indexOf("") !== -1) {
            setFormResponse({classname: "danger", message: "An empty field has been found. Please, verify that all fields has been filled"})
            return
        }

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
                resetFields()

                // Add a row the table
                setEstimates({
                    ...estimates,
                    credentials
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
        <form className={"form d-flex-row"} onSubmit={(e) => handleSubmit(e)}>
            
            <div className={"card item-row"}>
                <div className={"-content"}>
                    {Object.keys(formResponse).length > 0 && (
                        <Notification {...formResponse} />
                    )}

                    <div className={"form-field"}>
                        <label htmlFor={"company"}>Company</label>
                        <select id={"company"} name={"company"}>
                            <option value={""}>Select a company</option>
                            {companies.length > 0 && companies.map((item, index) => {
                                <option key={index} value={item}>{item}</option>
                            })}
                        </select>
                    </div>

                    <div className={"form-field"}>
                        <label htmlFor={"title"}>Title</label>
                        <input type={"text"} maxLength={"255"} value={title} onChange={(e) => handleChange(e, "title")} />
                    </div>

                    <div className={"form-field"}>
                        <label htmlFor={"date"}>Date</label>
                        <input type={"date"} min={Date.now()} onChange={(e) => handleChange(e, "date")} />
                    </div>
                    
                    <div className={"form-field"}>
                        <label htmlFor={"description"}>Description</label>
                        <textarea id={"description"} onChange={(e) => handleChange(e, "description")}>{description}</textarea>
                    </div>
                    
                    <div className={"form-field"}>
                        <label htmlFor={"budget"}>Budget</label>
                        <input id={"budget"} type={"number"} min={0} value={budget} onChange={(e) => handleChange(e, "budget")} />
                    </div>
                    
                    <div className={"form-button"}>
                        <button className={"btn btn-blue"} type={"submit"}>Ajouter</button>
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
                            {estimates.length > 0 && estimates.map((item, index) => (
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
        </form>
    )
}