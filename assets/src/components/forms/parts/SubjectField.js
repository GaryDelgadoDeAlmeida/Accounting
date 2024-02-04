import React from "react";

export default function SubjectField({handleChange}) {

    const subjects = [
        {
            value: "",
            text: "Select a subject"
        },
        {
            value: "disclamer",
            text: "Disclamer : Something happened ?"
        },
        {
            value: "report",
            text: "Report : You did an error and you want to correct it ?"
        },
        {
            value: "help",
            text: "Help : You need an information ?"
        }
    ]

    return (
        <div className={"form-field"}>
            <select onChange={(e) => handleChange(e, "subject")}>
                {subjects.map((item, index) => (
                    <option key={index} value={item.value}>{item.text}</option>
                ))}
            </select>
        </div>
    )
}