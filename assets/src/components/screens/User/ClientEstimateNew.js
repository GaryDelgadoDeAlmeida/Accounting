import React, { useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import UserHeader from "../../parts/UserHeader"
import EstimateForm from "../../forms/EstimateForm"
import ReturnButton from "../../parts/ReturnButton"

export default function ClientEstimateNew() {
    const { clientID } = useParams()
    const [error, setError] = useState(false)

    return (
        <UserHeader>
            {error && <Navigate to={"/user/client/" + clientID} replace={true} />}

            <ReturnButton path={"/user/client/" + clientID} />

            <div className={"mt-25px"}>
                <EstimateForm />
            </div>
        </UserHeader>
    )
}