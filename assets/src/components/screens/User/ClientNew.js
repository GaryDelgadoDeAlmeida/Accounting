import React from "react";
import UserHeader from "../../parts/UserHeader";
import CompanyForm from "../../forms/CompanyForm";
import ReturnButton from "../../parts/ReturnButton";

export default function ClientNew() {

    return (
        <UserHeader>
            <ReturnButton path={"/user/client"} />

            <div className={"page-section"}>
                <div className={"card"}>
                    <div className={"-content"}>
                        <CompanyForm />
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}