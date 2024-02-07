import React, { useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import UserHeader from "../../parts/UserHeader"
import EstimateForm from "../../forms/EstimateForm"
import ReturnButton from "../../parts/ReturnButton"

export default function ClientEstimateNew() {
    const { clientID } = useParams()
    if(isNaN(clientID)) {
        return <Navigate to={"/user/client"} replace={true} />
    }

    return (
        <UserHeader>
            <ReturnButton path={"/user/client/" + clientID} />

            <div className={"mt-25px"}>
                <EstimateForm companyID={clientID} />
            </div>
        </UserHeader>
    )
}