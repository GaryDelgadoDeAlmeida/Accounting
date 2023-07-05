import React from "react"
import AnonymousHeader from "../../parts/AnonymousHeader"
import ContactForm from "../../forms/ContactForm"

export default function Home() {

    return (
        <AnonymousHeader>
            <div className={"page-hero"}>
                <div className={"hero-wrapper"}>
                    <h1>Freelance accounting</h1>
                </div>
            </div>

            <div className={"page-wrapper"}>

                <div className={"page-section"}>
                    <h3 className={"page-title"}>About us</h3>
                    
                    <div className={"d-flex-col"}>
                        <div className={""}></div>
                        <div className={""}>
                            <img src={`${window.location.origin}/content/`} alt={""} />
                        </div>
                    </div>
                </div>
                
                <div className={"page-contact"}>
                    <h3 className={"-title"}>Contact us</h3>
                    <p className={"-sub-title"}>Do you have a question ? Feel free to contact us, we'll answer to yours doubts</p>
                    
                    <div className={"mt-25px"}>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </AnonymousHeader>
    )
}