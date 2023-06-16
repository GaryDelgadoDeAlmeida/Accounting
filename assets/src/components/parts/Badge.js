import React from "react"

export default function Badge({type, txtContent}) {

    return (
        <span className={`badge badge-${type}`}>{txtContent}</span>
    )
}