import React, { useEffect, useState } from "react";
import { findParent } from "../../utils/DomElement";
import FormControl from "../../utils/FormControl";

export default function InvoiceDetailField({invoice_details, setFormResponse, update}) {

    const formControl = new FormControl()
    const [invoiceDetails, setInvoiceDetails] = useState(invoice_details ?? [])
    let keys = Object.keys(invoiceDetails)

    useEffect(() => {
        updateCredentials()
    }, [invoiceDetails])

    const updateCredentials = () => {
        update(invoiceDetails)
    }

    const handleChange = (e, fieldName) => {
        let parent = findParent(e.currentTarget, "item-cell")
        if(!parent) {
            alert("An error has been encountered")
            return
        }

        let fieldValue = e.currentTarget.value
        let parentID = parseInt(parent.id)

        switch(fieldName) {
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
                fieldValue = e.currentTarget.checked
                break

            default:
                return
        }

        setInvoiceDetails({
            ...invoiceDetails,
            [parentID]: {
                ...invoiceDetails[parentID],
                [fieldName]: fieldValue
            }
        })
    }
    
    const handleNewRow = (e) => {
        let $max = 0
        keys.map((item) => {
            if($max < parseInt(item)) {
                $max = parseInt(item)
            }
        })
        $max += 1

        setInvoiceDetails({
            ...invoiceDetails,
            [$max]: {
                description: "",
                quantity: 1,
                price: 0,
                tva: 0,
                amount: 0
            }
        })
    }

    const handleRemoveRow = (e) => {
        const parent = findParent(e.currentTarget, "item-cell")
        const parentID = parseInt(parent.id)

        let details = {...invoiceDetails}
        delete details[parentID]

        setInvoiceDetails({
            ...details
        })
    }
    
    return (
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
                    {keys.length > 0 ? (
                        Object.values(invoiceDetails).map((item, index) => {
                            let tva = (item.tva ? 1.2 : 1)
                            let amount = (item.price * tva) * item.quantity
                            
                            return (
                                <tr className={"item-cell"} id={keys[index]} key={index}>
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
    )
}