import React from "react"

export default function Badge({txtContent}) {

    let 
        value = txtContent.toUpperCase(), 
        classname = ""
    ;
    if(["SIGNED", "PAID"].indexOf(value) !== -1) {
        classname = "success"
    } else if(["ONGOING", "SEND"].indexOf(value) !== -1) {
        classname = "warning"
    } else if(["UNPAID"].indexOf(value) !== -1) {
        classname = "danger"
    }

    return (
        <span className={`badge badge-${classname}`}>{txtContent}</span>
    )
}