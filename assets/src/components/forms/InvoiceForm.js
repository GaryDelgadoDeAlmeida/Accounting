import React, { useState } from "react";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";
import CompanyField from "./parts/CompanyField";
import InvoiceDetailField from "./parts/InvoiceDetailField";
import axios from "axios";
import { formatDate } from "../utils/DomElement";

export default function InvoiceForm({companyID, invoice = null}) {
    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})
    const [credentials, setCredentials] = useState({
        company: companyID != null ? parseInt(companyID) : null,
        invoice_date: invoice ? invoice.createdAt : "",
        due_date: invoice ? invoice.invoiceDate : "",
        details: invoice != null ? {...invoice.invoiceDetails} : {}
    })

    const updateCredentials = (fieldName, fieldValue) => {
        setCredentials({
            ...credentials,
            [fieldName]: fieldValue
        })
    }

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
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

            default:
                setFormResponse({classname: "danger", message: `The field '${fieldName}' is forbidden`})
                return
        }

        setCredentials({
            ...credentials,
            [fieldName]: fieldValue
        })
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

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {Object.keys(formResponse).length > 0 && (
                <Notification {...formResponse} />
            )}


            <div className={"form-field"}>
                <label htmlFor={"invoice_date"}>Invoice date</label>
                <input 
                    id={"invoice_date"} 
                    type={"date"} 
                    min={Date.now()} 
                    value={ formatDate(credentials.invoice_date) }
                    onChange={(e) => handleChange(e, "invoice_date")} 
                    required 
                />
            </div>

            <div className={"form-field"}>
                <label htmlFor={"due_date"}>Due date</label>
                <input 
                    id={"due_date"} 
                    type={"date"} 
                    value={ formatDate(credentials.due_date) }
                    onChange={(e) => handleChange(e, "due_date")} 
                />
            </div>

            <CompanyField 
                companyID={companyID} 
                handleChange={handleChange} 
            />

            <InvoiceDetailField 
                invoice_details={credentials.details} 
                setFormResponse={setFormResponse} 
                update={updateCredentials}
            />

            <div className={"form-button"}>
                <button type={"submit"} className={"btn btn-blue"}>Submit the invoice</button>
            </div>
        </form>
    )
}