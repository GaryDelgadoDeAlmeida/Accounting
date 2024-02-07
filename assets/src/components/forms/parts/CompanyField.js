import React, { useEffect } from "react";
import PrivateResources from "../../utils/PrivateResources";

export default function CompanyField({handleChange, companyID = null}) {

    const { loading, items: companies, load } = PrivateResources(`${window.location.origin}/api/companies?results=all`)
    useEffect(() => {
        load()
    }, [])

    return (
        <div className={"form-field"}>
            <label htmlFor={"invoice_company"}>Company</label>
            <select id={"invoice_company"} name={"company"} onChange={(e) => handleChange(e, "company")} required>
                <option value={""}>Select an organization</option>
                {!loading && companies.results && (
                    companies.results.map((item, index) => (
                        <option 
                            key={index} 
                            value={item.id} 
                            selected={item.id == companyID ? true : false}
                        >{item.name}</option>
                    ))
                )}
            </select>
        </div>
    )
}