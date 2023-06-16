import React from "react";
import UserHeader from "../../parts/UserHeader";
import InvoiceForm from "../../forms/InvoiceForm";
import ReturnButton from "../../parts/ReturnButton";

export default function InvoiceNew() {

    return (
        <UserHeader>
            <div className={"page-section"}>
                <ReturnButton path={"/user/invoice"} />

                <div className={"card mt-15px"}>
                    <div className={"-content"}>
                        <InvoiceForm />
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}