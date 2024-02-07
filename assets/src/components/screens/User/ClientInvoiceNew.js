import React from "react";
import { Navigate, useParams } from "react-router-dom";
import UserHeader from "../../parts/UserHeader";
import ReturnButton from "../../parts/ReturnButton";
import InvoiceForm from "../../forms/InvoiceForm";

export default function ClientInvoiceNew() {
    const { clientID } = useParams()
    if(isNaN(clientID)) {
        return <Navigate to={"/user/client"} />
    }

    return (
        <UserHeader>
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