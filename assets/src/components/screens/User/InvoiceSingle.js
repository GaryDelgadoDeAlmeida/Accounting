import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PrivateResources from "../../utils/PrivateResources";
import UserHeader from "../../parts/UserHeader";
import LinkButton from "../../parts/LinkButton";

export default function InvoiceSingle() {
    const { invoiceID } = useParams()
    const { loading, items: invoice, load } = PrivateResources(`/invoice/${invoiceID}`)

    useEffect(() => {
        load()
    }, [])

    return (
        <UserHeader>
            <div className={"page-section"}>
                <LinkButton
                    classname={"btn-blue"}
                    url={"/user/invoice"}
                    value={"Return"}
                    defaultIMG={"arrow-left"}
                />

                <div className={"mt-15px"}>
                    {/*  */}
                </div>
            </div>
        </UserHeader>
    )
}