import React, { useEffect, useState } from "react";
import Notification from "../parts/Notification";
import FormControl from "../utils/FormControl";
import CompanyField from "./parts/CompanyField";
import EstimateDetailTable from "./parts/EstimateDetailTable";
import EstimateDetailField from "./parts/EstimateDetailField";
import PrivateResources from "../utils/PrivateResources";
import { formatDate } from "../utils/DomElement";
import axios from "axios";

export default function EstimateForm({estimate = null, companyID = null}) {
    const storageUser = localStorage.getItem("user") ?? []
    const user = JSON.parse(storageUser)
    const currentDate = new Date()
    const formControl = new FormControl()
    const [formResponse, setFormResponse] = useState({})
    const {loading = true, items: companies, load} = PrivateResources(`${window.location.origin}/api/companies`)
    const [credentials, setCredentials] = useState(estimate ? {
        id: estimate.id,
        estimateDate: formatDate(estimate.estimateDate),
        company: estimate.company ? estimate.company.id : null,
        applyTVA: estimate.applyTVA,
        tva: estimate.tva,
        details: estimate.estimateDetails
    } : {
        estimateDate: currentDate,
        company: null,
        applyTVA: false,
        tva: 0,
        details: []
    })

    useEffect(() => {
        load()
    }, [])

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
            case "company":
                if( !formControl.checkMinLength(fieldValue, 0) && formControl.checkChoiceFromObject(companies, "id", fieldValue) ) {
                    setFormResponse({classname: "danger", message: `Unknown choice option ${fieldValue}`})
                    return
                }
                fieldValue = parseInt(fieldValue)
                break

            case "estimateDate":
                break

            case "applyTVA":
                fieldValue = e.target.checked
                break

            case "tva":
                if(!formControl.checkPositifNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: `The value in the field '${fieldName}' must be superior or equal to 0`})
                }

                fieldValue = parseFloat(fieldValue)
                break
            
            default:
                setFormResponse({classname: "danger", message: `The field name ${fieldName} is forbidden.`})
                return
        }

        let $datas = {
            ...credentials, 
            [fieldName]: fieldValue
        }
        if(fieldName == "applyTVA" && fieldValue == false) {
            $datas = {
                ...credentials, 
                [fieldName]: fieldValue,
                tva: 0
            }
        }

        setCredentials($datas)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!formControl.checkMinLength(credentials.estimateDate, 1) || !formControl.checkMinLength(credentials.company, 1)) {
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
            .post(url, credentials, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld",
                    "Authorization": "Bearer " + user.token
                }
            })
            .then(res => {
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
                                <CompanyField 
                                    handleChange={handleChange} 
                                    companyID={credentials.company} />
                                
                                <div className={"form-field"}>
                                    <label htmlFor={"date"}>Date</label>
                                    <input 
                                        type={"date"} 
                                        min={currentDate.toLocaleDateString()} 
                                        value={formatDate(credentials.estimateDate)}
                                        onChange={(e) => handleChange(e, "estimateDate")} 
                                    />
                                </div>

                                <div className={"form-field"}>
                                    <label>
                                        <input type={"checkbox"} value={credentials.applyTVA} onChange={(e) => handleChange(e, "applyTVA")} />
                                        <span>Apply TVA</span>
                                    </label>
                                </div>
                                
                                {credentials.applyTVA && (
                                    <div className={"form-field"}>
                                        <label htmlFor={"tva"}>TVA (%)</label>
                                        <input 
                                            id={"tva"} 
                                            type={"number"} 
                                            min={0}
                                            value={credentials.tva} 
                                            onChange={(e) => handleChange(e, "tva")} 
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="-header">
                                <label>Invoice details</label>
                            </div>
                            <div className="-content">
                                <EstimateDetailField update={updateCredentials} setFormResponse={setFormResponse} />
                            </div>
                        </div>

                        <EstimateDetailTable estimate_details={credentials.details} update={updateCredentials} />
                    </div>

                    <button className={"btn btn-blue mt-15px w-100 h-40px"} type={"submit"}>Register the estimate</button>
                </form>
            ) : (
                <Notification classname={"information"} message={"Loading ..."} />
            )}   
        </>
    )
}