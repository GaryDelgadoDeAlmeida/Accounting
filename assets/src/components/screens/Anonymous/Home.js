import React from "react"
import AnonymousHeader from "../../parts/AnonymousHeader"
import ContactForm from "../../forms/ContactForm"

export default function Home() {

    return (
        <AnonymousHeader>
            <div className={"page-hero"}>
                <h1>Hello world</h1>
            </div>

            <div className={"page-section"}>

                <div className={"page-about"}></div>
                
                <div className={"page-contact"}>
                    <ContactForm />
                </div>
            </div>
        </AnonymousHeader>
    )
}