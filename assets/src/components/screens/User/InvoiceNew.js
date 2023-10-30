import React from "react";
import UserHeader from "../../parts/UserHeader";
import InvoiceForm from "../../forms/InvoiceForm";
import ReturnButton from "../../parts/ReturnButton";

export default function InvoiceNew() {

    return (
        <UserHeader>
            <ReturnButton path={"/user/invoice"} />
            
            <div className={"page-section"}>
                <div className={"card"}>
                    <div className={"-content"}>
                        <InvoiceForm />
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}