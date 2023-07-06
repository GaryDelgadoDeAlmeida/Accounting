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

            <div className={"page-about page-section"}>
                <div className={"page-wrapper"}>
                    <h3 className={"page-title"}>About us</h3>
                    
                    <div className={"dual-column"}>
                        <div className={"left"}>
                            <p>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.</p>
                            <p>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.</p>
                        </div>
                        <div className={"right"}>
                            <img src={`${window.location.origin}/content/img/why-us.png`} alt={""} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={"page-wrapper"}>
                <div className={"page-section"}>
                    <h3 className={"page-title"}>Service</h3>

                    <div className={"d-flex"}>
                        <div className={"box-icon"}>
                            <img className={"-icon"} src={`${window.location.origin}/content/svg/`} alt={""} />
                            <h4 className={"-title"}></h4>
                            <div className={"-description"}></div>
                        </div>
                        <div className={"box-icon"}>
                            <img className={"-icon"} src={`${window.location.origin}/content/svg/`} alt={""} />
                            <h4 className={"-title"}></h4>
                            <div className={"-description"}></div>
                        </div>
                        <div className={"box-icon"}>
                            <img className={"-icon"} src={`${window.location.origin}/content/svg/`} alt={""} />
                            <h4 className={"-title"}></h4>
                            <div className={"-description"}></div>
                        </div>
                        <div className={"box-icon"}>
                            <img className={"-icon"} src={`${window.location.origin}/content/svg/`} alt={""} />
                            <h4 className={"-title"}></h4>
                            <div className={"-description"}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={"page-wrapper"}>
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