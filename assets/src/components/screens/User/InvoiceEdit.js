import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "../../parts/UserHeader";
import ReturnButton from "../../parts/ReturnButton";
import InvoiceForm from "../../forms/InvoiceForm";
import PrivateResources from "../../utils/PrivateResources";

export default function InvoiceEdit() {
    const { invoiceID } = useParams()
    const { load, items: invoice, loading } = PrivateResources(`${window.location.origin}/api/invoice/${invoiceID}`)

    useEffect(() => {
        load()
    }, [])

    return (
        <UserHeader>
            <ReturnButton path={"/user/invoice"} />
            
            <div className={"page-content"}>
                {!loading && invoice.company !== undefined ? (
                    <div className={"card"}>
                        <div className={"-content"}>
                            <InvoiceForm companyID={invoice.company.id} invoice={invoice} />    
                        </div>
                    </div>
                ) : (
                    <p>Loading ...</p>
                )}
            </div>
        </UserHeader>
    )
}