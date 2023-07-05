import React from "react";
import ContactForm from "../../forms/ContactForm";
import AnonymousHeader from "../../parts/AnonymousHeader";

export default function Disclamer() {

    return (
        <AnonymousHeader>
            <div className={"page-section"}>
                <h2>Disclamer</h2>

                <div className={""}>
                    <ContactForm />
                </div>
            </div>
        </AnonymousHeader>
    )
}