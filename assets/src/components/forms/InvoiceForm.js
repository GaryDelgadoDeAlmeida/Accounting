import React, { useState } from "react";
import Notification from "../parts/Notification";
import axios from "axios";
import FormControl from "../utils/FormControl";
import { findParent } from "../utils/DomElement";

export default function InvoiceForm({companyID}) {
    const userID = localStorage.getItem("user")

    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})
    const [credentials, setCredentials] = useState({
        company: companyID,
        invoice_date: "",
        details: {}
    })

    const createDivFieldElement = (element) => {
        let divElement = document.createElement("div")
        divElement.classList.add("form-field")
        divElement.append(element)

        return divElement
    }

    const createTdElement = (element, classnames) => {
        let tdElement = document.createElement("td")
        tdElement.classList.add(...classnames)
        tdElement.append(element)

        return tdElement
    }

    const handleNewRow = (e) => {
        // Description (1st column)
        let inputDescription = document.createElement("input")
        inputDescription.type = "text"
        inputDescription.placeholder = "Description"
        inputDescription.classList.add("no-radius", "h-30px")
        inputDescription.onchange = (e) => handleChange(e, "quantity")

        // Quantity (2nd column)
        let inputQuantity = document.createElement("input")
        inputQuantity.type = "number"
        inputQuantity.placeholder = "Quantity"
        inputQuantity.classList.add("no-radius", "h-30px")
        inputQuantity.min = 0
        inputQuantity.onchange = (e) => handleChange(e, "quantity")

        // Price (3rd column)
        let inputPrice = document.createElement("input")
        inputPrice.type = "number"
        inputPrice.placeholder = "Price"
        inputPrice.classList.add("no-radius", "h-30px")
        inputPrice.min = 0
        inputPrice.onchange = (e) => handleChange(e, "price")

        // TVA (4th column)
        let inputTva = document.createElement("input")
        inputTva.type = "checkbox"
        inputTva.onchange = (e) => handleChange(e, "tva")

        // Amount (5th column)
        let spanAmount = document.createElement("span")
        spanAmount.classList.add("amount")
        spanAmount.append(0)

        // Add/Remove row (6th column)
        let buttonRemove = document.createElement("button")
        buttonRemove.onclick = (e) => handleRemoveRow(e)
        buttonRemove.innerHTML = `&minus;`;
        buttonRemove.type = "button"
        buttonRemove.classList.add("btn", "btn-red")

        // Tr element to add all created td elements
        let parentBody = findParent(e.target, "table-content")
        let trElement = document.createElement("tr")
        trElement.id = parentBody.children.length
        trElement.classList.add("item-cell")
        trElement.appendChild(
            createTdElement(
                createDivFieldElement(inputDescription), 
                ["-description"]
            )
        )
        trElement.appendChild(
            createTdElement(
                createDivFieldElement(inputQuantity), 
                ["-quantity"]
            )
        )
        trElement.appendChild(
            createTdElement(
                createDivFieldElement(inputPrice), 
                ["-price", "txt-center"]
            )
        )
        trElement.appendChild(
            createTdElement(inputTva, ["-tva", "txt-center"])
        )
        trElement.appendChild(
            createTdElement(spanAmount, ["-amount", "txt-center"])
        )
        trElement.appendChild(
            createTdElement(buttonRemove, ["-action", "txt-center"])
        )

        parentBody.insertBefore(trElement, parentBody.children[parentBody.children.length - 1])
    }

    const handleRemoveRow = (e) => {
        let trElement = findParent(e.target, "item-cell")
        if(trElement == null) {
            setFormResponse({classname: "danger", message: "An error has been encountered. The row couldn't be removed"})
            return
        }

        console.log(trElement)
        let rowID = trElement.id
        credentials.details[rowID]
    }

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let parent = findParent(e.target, "item-cell")

        switch(fieldName) {
            case "invoice_date":
                console.log(
                    fieldValue, 
                    Date.now(), 
                    Date.toLocaleDateString()
                )
                break

            case "description":
                if(!formControl.checkMaxLength(fieldValue, 255)) {
                    setFormResponse({classname: "danger", message: "The description value exceed 255 caracters length"})
                    return
                }
                break

            case "quantity":
                if(!formControl.checkNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: "The quantity isn't numeric."})
                    return
                }

                if(!formControl.checkPositifNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: "The quantity isn't a positive number."})
                    return
                }
                break

            case "price":
                if(!formControl.checkNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: "The price isn't numeric"})
                    return
                }

                if(!formControl.checkPositifNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: "The price isn't a positive number."})
                    return
                }
                break

            case "tva":
                fieldValue = e.target.checked
                break

            default:
                setFormResponse({classname: "danger", message: `The field '${fieldName}' is forbidden`})
                return
        }

        // credentials.details[parent.id].[fieldName] = fieldValue

        setCredentials({
            ...credentials,
            [fieldName]: fieldValue
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        axios
            .post(window.location.origin +"/api/invoice/" + invoiceID, credentials, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld"
                }
            })
            .then((response) => {
                console.log(response.data)
                
                setFormResponse({classname: "success", message: ""})
            })
            .catch((error) => {
                console.log(error)

                setFormResponse({classname: "danger", message: "An error has been encountered. Please, retry later"})
            })
        ;
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {Object.keys(formResponse).length > 0 && (
                <Notification {...formResponse} />
            )}

            <div className={"card"}>
                <div className={"-content"}>
                    <div className={"form-field"}>
                        <label htmlFor={"invoice_date"}>Invoice date</label>
                        <input id={"invoice_date"} type={"date"} min={Date.now()} onChange={(e) => handleChange(e, "invoice_date")} />
                    </div>
                    
                    <div className={"form-field"}>
                        <label htmlFor={"table"}>Invoice details</label>

                        <table className={"table"}>
                            <thead>
                                <tr>
                                    <th className={"column-description"}>Description</th>
                                    <th className={"column-quantity"}>Quantity</th>
                                    <th className={"column-price"}>Price</th>
                                    <th className={"column-tva"}>TVA</th>
                                    <th className={"column-amount"}>Amount</th>
                                    <th className={"column-new-row"}></th>
                                </tr>
                            </thead>
                            <tbody className={"table-content"}>
                                <tr>
                                    <td colSpan={5}></td>
                                    <td className={"-new-row"}>
                                        <button type={"button"} className={"btn btn-blue"} onClick={(e) => handleNewRow(e)}>+</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </form>
    )
}