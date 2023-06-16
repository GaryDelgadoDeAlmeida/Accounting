import React from "react";
import UserHeader from "../../parts/UserHeader";
import ReturnButton from "../../parts/ReturnButton";
import EstimateForm from "../../forms/EstimateForm";

export default function EstimateNew() {

    return (
        <UserHeader>
            <ReturnButton path={"/user/estimate"} />
            
            <div className={"page-section"}>
                <EstimateForm />
            </div>
        </UserHeader>
    )
}