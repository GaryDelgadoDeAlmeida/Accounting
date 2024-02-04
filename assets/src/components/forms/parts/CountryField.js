import React, { useEffect } from "react";
import PublicResources from "../../utils/PublicResources";

export default function CountryField({handleChange}) {

    const { loading, items: countries, load } = PublicResources("https://restcountries.com/v3.1/all?fields=name")
    useEffect(() => {
        load()
    }, [])

    return (
        <div className={"form-field"}>
            <label htmlFor={"country"}>Country</label>
            <select id={"country"} onChange={(e) => handleChange(e, "country")}>
                <option value={""}>Select a country</option>
                {!loading && countries.length > 0 && countries.map((item, index) => (
                    <option 
                        key={index} 
                        value={item.name.common} 
                        selected={(credentiels.country != "" && credentiels.country === item.name.common) || (company.country === item.name.common) ? "selected" : false}
                    >{item.name.common}</option>
                ))}
            </select>
        </div>
    )
}