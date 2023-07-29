import React from "react";
import ContactForm from "../../forms/ContactForm";
import AnonymousHeader from "../../parts/AnonymousHeader";

export default function Disclamer() {

    return (
        <AnonymousHeader>
            <div className={"page-wrapper mh-100vh"}>
                <div className={"page-section"}>
                    <h2 className={"page-title"}>Disclamer</h2>

                    <div className={"mt-25px"}>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </AnonymousHeader>
    )
}