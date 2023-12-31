import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import UserHeader from "../../parts/UserHeader";
import ReturnButton from "../../parts/ReturnButton";
import axios from "axios";
import InvoiceForm from "../../forms/InvoiceForm";

export default function ClientInvoiceNew() {
    const { clientID } = useParams()
    const [error, setError] = useState(false)

    useEffect(() => {
        axios
            .get("/api/company/" + clientID, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            .catch(err => {
                alert(err.response.data)
                setError(true)
            })
        ;
    }, [])

    return (
        <UserHeader>
            {error && <Navigate to={"/user/client/" + clientID} replace={true} />}

            <ReturnButton path={"/user/client/" + clientID} />
            
            <div className={"page-section"}>
                <div className={"card"}>
                    <div className={"-content"}>
                        <InvoiceForm companyID={clientID} />
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}