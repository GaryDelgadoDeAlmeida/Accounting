import React, { useEffect, useRef, useState } from "react";
import Notification from "../parts/Notification";
import axios from "axios";
import FormControl from "../utils/FormControl";
import PrivateResources from "../utils/PrivateResources";
import { findChildren, findParent } from "../utils/DomElement";

export default function InvoiceForm({companyID, invoice = null}) {
    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})
    const { loading, items: companies, load } = PrivateResources(`${window.location.origin}/api/companies`)

    let rowCounting = useRef(1)
    let credentials = useRef({
        company: parseInt(companyID),
        invoice_date: "",
        due_date: "",
        details: invoice != null ? {...invoice.invoiceDetails} : {}
    })

    useEffect(() => {
        load()
    }, [])

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
        inputDescription.onchange = (e) => handleChange(e, "description")
        inputDescription.required = true

        // Quantity (2nd column)
        let inputQuantity = document.createElement("input")
        inputQuantity.type = "number"
        inputQuantity.placeholder = "Quantity"
        inputQuantity.classList.add("no-radius", "h-30px")
        inputQuantity.min = 0
        inputQuantity.onchange = (e) => handleChange(e, "quantity")
        inputQuantity.required = true

        // Price (3rd column)
        let inputPrice = document.createElement("input")
        inputPrice.type = "number"
        inputPrice.placeholder = "Price"
        inputPrice.classList.add("no-radius", "h-30px")
        inputPrice.min = 0
        inputPrice.onchange = (e) => handleChange(e, "price")
        inputPrice.required = true

        // TVA (4th column)
        let inputTva = document.createElement("input")
        inputTva.type = "checkbox"
        inputTva.onchange = (e) => handleChange(e, "tva")

        // Add/Remove row (6th column)
        let buttonRemove = document.createElement("button")
        buttonRemove.onclick = (e) => handleRemoveRow(e)
        buttonRemove.innerHTML = `&minus;`;
        buttonRemove.type = "button"
        buttonRemove.classList.add("btn", "btn-red")

        // Tr element to add all created td elements
        let trElement = document.createElement("tr")
        trElement.id = rowCounting.current
        trElement.classList.add("item-cell")
        trElement.appendChild(createTdElement(createDivFieldElement(inputDescription), ["-description"]))
        trElement.appendChild(createTdElement(createDivFieldElement(inputQuantity), ["-quantity"]))
        trElement.appendChild(createTdElement(createDivFieldElement(inputPrice), ["-price", "txt-center"]))
        trElement.appendChild(createTdElement(inputTva, ["-tva", "txt-center"]))
        trElement.appendChild(createTdElement(0, ["-amount", "txt-center"]))
        trElement.appendChild(createTdElement(buttonRemove, ["-action", "txt-center"]))

        // Increase counter
        rowCounting.current += 1

        // Add to table
        let parentBody = findParent(e.target, "table-content")
        parentBody.insertBefore(trElement, parentBody.children[parentBody.children.length - 1])
    }

    const handleRemoveRow = async (e) => {
        let trElement = findParent(e.target, "item-cell")
        if(trElement == null) {
            setFormResponse({classname: "danger", message: "An error has been encountered. The row couldn't be removed"})
            return
        }

        let rowID = parseInt(trElement.id)
        if(Object.keys(credentials.current.details).length > 0) {
            delete credentials.current.details[rowID]
        }

        trElement.remove()
    }

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        let parent = findParent(e.target, "item-cell")
        setFormResponse({})

        switch(fieldName) {
            case "invoice_date":
            case "due_date":
                let 
                    currentDate = new Date(),
                    fieldDate = new Date(fieldValue),
                    diffDate = currentDate - fieldDate
                ;

                if( diffDate < 0 && fieldDate.toLocaleDateString() != currentDate.toLocaleDateString() ) {
                    setFormResponse({classname: "danger", message: "The invoice date must be inferior to the current date"})
                    return
                }
                break

            case "company":
                if(!formControl.checkMinLength(fieldValue, 1)) {
                    setFormResponse({classname: "danger", message: "A company must be selected."})
                    return
                }
                break

            case "description":
                if(!formControl.checkMaxLength(fieldValue, 255)) {
                    setFormResponse({classname: "danger", message: "The description value exceed 255 characters length"})
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

                fieldValue = parseInt(fieldValue)
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

                fieldValue = parseFloat(fieldValue)
                break

            case "tva":
                fieldValue = e.target.checked
                break

            default:
                setFormResponse({classname: "danger", message: `The field '${fieldName}' is forbidden`})
                return
        }

        if(parent != null) {
            
            // Dynamically update the amount
            let amount = findChildren(parent, "-amount")
            let price = findChildren(
                findChildren(
                    findChildren(parent, "-price"),
                    "form-field"
                ),
                "", "input"
            ).value ?? 0
            let quantity = findChildren(
                findChildren(
                    findChildren(parent, "-quantity"),
                    "form-field"
                ), 
                "", "input"
            ).value ?? 0
            let tva = findChildren(
                findChildren(parent, "-tva"),
                "", "input"
            ).checked ?? false
            
            amount.innerHTML = (price * (tva ? 1.20 : 1)) * quantity

            // Update credentials to send it to database
            let parentID = parseInt(parent.id)
            credentials.current = {
                ...credentials.current,
                details: {
                    ...credentials.current.details,
                    [parentID]: {
                        ...credentials.current.details[parentID],
                        [fieldName]: fieldValue
                    }
                }
            }
        } else {
            credentials.current = {
                ...credentials.current,
                [fieldName]: fieldValue
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // check if all fields has been filled
        if(
            [null, ""].indexOf(credentials.current.company) === false ||
            credentials.current.invoice_date === "" ||
            Object.keys(credentials.current.details).length < 1
        ) {
            setFormResponse({classname: "danger", message: "Please, fill all required fields before submit"})
            return
        }

        let url = `${window.location.origin}/api/invoice`
        if(invoice != null) {
            url = `${window.location.origin}/api/invoice/${invoice.id}/update`
        }

        axios
            .post(url, credentials.current, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            .then(({data}) => {
                setFormResponse({classname: "success", message: "The new invoice has been successfully hadded to your account"})
            })
            .catch(({response}) => {
                let errorMessage = "An error has been encountered. Please, retry later"
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

    let objectKeys = Object.keys(credentials.current.details)
    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {Object.keys(formResponse).length > 0 && (
                <Notification {...formResponse} />
            )}


            <div className={"form-field"}>
                <label htmlFor={"invoice_date"}>Invoice date</label>
                <input id={"invoice_date"} type={"date"} min={Date.now()} onChange={(e) => handleChange(e, "invoice_date")} required />
            </div>

            <div className={"form-field"}>
                <label htmlFor={"due_date"}>Due date</label>
                <input id={"due_date"} type={"date"} onChange={(e) => handleChange(e, "due_date")} />
            </div>

            {!loading && (
                <div className={"form-field"}>
                    <label htmlFor={"invoice_company"}>Company</label>
                    <select id={"invoice_company"} name={"company"} onChange={(e) => handleChange(e, "company")} required>
                        <option value={""}>Select an organization</option>
                        {companies.map((item, index) => (
                            <option key={index} value={item.id} selected={item.id == companyID ? true : false}>{item.name}</option>
                        ))}
                    </select>
                </div>
            )}
            
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
                        {invoice != null && objectKeys.length > 0 ? (
                            Object.values(credentials.current.details).map((item, index) => {
                                let tva = (item.tva ? 1.2 : 1)
                                let amount = (item.price * tva) * item.quantity
                                
                                return (
                                    <tr id={objectKeys[index]} key={index}>
                                        <td className={"-description"}>
                                            <div className={"form-field"}>
                                                <input type={"text"} className={"no-radius h-30px"} value={item.description} onChange={(e) => handleChange(e, "description")} required />
                                            </div>
                                        </td>
                                        <td className={"-quantity"}>
                                            <div className={"form-field"}>
                                                <input type={"number"} className={"no-radius h-30px"} min={0} value={item.quantity} onChange={(e) => handleChange(e, "quantity")} required />
                                            </div>
                                        </td>
                                        <td className={"-price"}>
                                            <div className={"form-field"}>
                                                <input type={"number"} className={"no-radius h-30px"} min={0} value={item.price} onChange={(e) => handleChange(e, "price")} required />
                                            </div>
                                        </td>
                                        <td className={"-tva txt-center"}>
                                            <input type={"checkbox"} checked={item.tva ? true : false} onChange={(e) => handleChange(e, "tva")} />
                                        </td>
                                        <td className={"-amount txt-center"}>{amount}</td>
                                        <td className={"-action"}>
                                            <button className={"btn btn-red"} type={"button"} onClick={(e) => handleRemoveRow(e)}>&minus;</button>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (null)}

                        <tr>
                            <td colSpan={6} className={"-new-row"}>
                                <button type={"button"} className={"btn btn-blue"} onClick={(e) => handleNewRow(e)}>+</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={"form-button"}>
                <button type={"submit"} className={"btn btn-blue"}>Submit the invoice</button>
            </div>
        </form>
    )
}