import React from "react";

export default function JuridicalStatusField({handleChange, juridicalStatus}) {

    const juridical_status = [
        {
            value: "",
            text: "Select a juridical status"
        },
        {
            value: "ei",
            text: "Entreprise individuelle (EI)"
        },
        {
            value: "eurl",
            text: "Entreprise unipersonnelle à responsabilité limitée (EURL)"
        },
        {
            value: "sarl",
            text: "Société à responsabilité limitée (SARL)"
        },
        {
            value: "sa",
            text: "Société anonyme (SA)"
        },
        {
            value: "sas_sasu",
            text: "Société par actions simplifiée (SAS) ou société par actions simplifiée unipersonnelle (SASU)"
        }
    ]

    return (
        <div className={"form-field"}>
            <label htmlFor={"status"}>Juridical status</label>
            <select id={"status"} onChange={(e) => handleChange(e, "status")}>
                {juridical_status.map((item, index) => (
                    <option 
                        key={index} 
                        value={item.value}
                        selected={item.value == juridicalStatus ? true : false}
                    >{item.text}</option>
                ))}
            </select>
        </div>
    )
}