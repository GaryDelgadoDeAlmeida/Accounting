import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "../../parts/UserHeader";
import ReturnButton from "../../parts/ReturnButton";
import PrivateResources from "../../utils/PrivateResources";

export default function ClientInvoiceNew() {
    const { clientID } = useParams()
    const { loading, items: client, load } = PrivateResources("client/" + clientID)

    useEffect(() => {
        load()
    }, [])

    return (
        <UserHeader>
            <div className={"page-section"}>
                <ReturnButton path={"/user/client/" + clientID} />

                <div className={""}></div>
            </div>
        </UserHeader>
    )
}