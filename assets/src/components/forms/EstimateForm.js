import React, { useState } from "react";
import Notification from "../parts/Notification";
import PrivatePostRessource from "../utils/PrivatePostRessource";

export default function EstimateForm() {
    const [estimates, setEstimates] = useState([])
    
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [budget, setBudget] = useState(0)

    const [formResponse, setFormResponse] = useState([])

    const handleRemove = (e) => {
        console.log("Hi handleRemove")
    }

    const resetFields = () => {
        setTitle("")
        setDescription("")
        setBudget(0)
    }

    const handleChange = (e, fieldName) => {
        const fieldValue = e.target.value

        switch(fieldName) {
            case "title":
                setTitle(fieldValue)
                break
            
            case "description":
                setDescription(fieldValue)
                break
            
            case "budget":
                setBudget(fieldValue)
                break
            
            default:
                setFormResponse({classname: "danger", message: `The field name ${fieldName} is forbidden.`})
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if([title, description, budget].indexOf("") !== -1) {
            setFormResponse({classname: "danger", message: "An empty field has been found. Please, verify that all fields has been filled"})
            return
        }

        // Update array of tasks
        setEstimates(estimates.concat({
            title: title,
            description: description,
            budget: budget
        }))

        // Reset all fields to an empty value
        resetFields()

        // Send data to API
        await PrivatePostRessource("estimate", {
            title: title,
            description: description,
            budget: budget
        })

        // Return a response to the user
        setFormResponse({classname: "success", message: "Successfully added"})
    }

    return (
        <form className={"form d-flex-row"} onSubmit={(e) => handleSubmit(e)}>
            
            <div className={"card item-row"}>
                <div className={"-content"}>
                    {formResponse.length > 0 && (<Notification {...formResponse} />)}

                    <div className={"form-field"}>
                        <label htmlFor={""}>Title</label>
                        <input type={"text"} maxLength={"255"} value={title} onChange={(e) => handleChange(e, "title")} />
                    </div>
                    
                    <div className={"form-field"}>
                        <label htmlFor={""}>Description</label>
                        <textarea onChange={(e) => handleChange(e, "description")}>{description}</textarea>
                    </div>
                    
                    <div className={"form-field"}>
                        <label htmlFor={""}>Budget</label>
                        <input type={"number"} min={0} value={budget} onChange={(e) => handleChange(e, "budget")} />
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
                            {estimates.map((item, index) => (
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