import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import PrivateResources from "../../utils/PrivateResources";
import UserHeader from "../../parts/UserHeader";
import LinkButton from "../../parts/LinkButton";

export default function InvoiceSingle() {
    const { invoiceID } = useParams()
    const { loading, items: invoice, load } = PrivateResources(`/invoice/${invoiceID}`)
    const invoiceDetails = [
        {
            id: 1,
            label: "Interface de prise de commande Pro/Traiteur",
            quantity: 1,
            price: 500,
            tva: 0
        },
        {
            id: 2,
            label: "Evolution du système d’import des fichiers Paradox",
            quantity: 1,
            price: 500,
            tva: 0
        },
        {
            id: 3,
            label: "Interface pour les retours magasins des produits",
            quantity: 1,
            price: 500,
            tva: 0
        }
    ]

    const priceHT = (invoiceDetails) => {
        let price = 0
        
        invoiceDetails.map((item) => {
            price += item.price
        })

        return price
    }

    const priceTTC = (invoiceDetails) => {
        let price = 0
        
        invoiceDetails.map((item) => {
            price += item.price + (item.price * 0.2)
        })

        return price
    }

    useEffect(() => {
        load()
    }, [])

    const handleDownloadInvoice = async (e) => {
        console.log("Hi handleDownloadInvoice")
        const response = await fetch(`${window.location.origin}/api/invoice/${invoiceID}/pdf`, {
            method: "GET",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/ld+json",
                "Content-Type": "application/json"
            }
        }).then(apiResponse => apiResponse.json())
    }

    return (
        <UserHeader>
            <div className={"page-section"}>
                <LinkButton
                    classname={"btn-blue"}
                    url={"/user/invoice"}
                    value={"Return"}
                    defaultIMG={"arrow-left"}
                />

                <div className={"mt-15px"}>
                    <div className={"d-flex"}>
                        <div className={"left w-50 txt-left"}>
                            <h3 className={"-title"}>Numéro de facture : 2023-04</h3>
                            <div className={"d-column"}>
                                <label>Date d'émission : 11/04/2023</label>
                                <label>Date d'échéance : 11/05/2023</label>
                            </div>
                        </div>
                        <div className={"right w-50 txt-right m-auto"}>
                            <button className={"btn -inline-flex"} onClick={(e) => handleDownloadInvoice(e)}>
                                <img src={`${window.location.origin}/content/svg/download.svg`} alt={""} />
                            </button>
                        </div>
                    </div>

                    <div className={"mt-25px"}>
                        <div className={"sending-status"}>
                            <div className={"item"}></div>
                            <div className={"item"}></div>
                            <div className={"item"}></div>
                            <div className={"item"}></div>
                        </div>
                    </div>

                    <div className={"mt-25px"}>
                        <table className={"table"}>
                            <thead>
                                <tr>
                                    <th>Prestataire</th>
                                    <th>Client</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={"service-provider"}>
                                            <div className={"-identity"}>
                                                <label>Garry ALMEIDA</label>
                                            </div>
                                            <div className={"-address"}>
                                                <span>189, rue Vercingétorix, Paris 75014, France</span>
                                            </div>
                                            <div className={"-contact"}>
                                                <span className={"-phone"}>(+33) 6 52 07 39 97</span>
                                                <span className={"-email"}>gary.almeida.word@gmail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"service-provider"}>
                                            <div className={"-identity"}>
                                                <label>VIAPROD</label>
                                            </div>
                                            <div className={"-address"}>
                                                <span>58 Avenue Henri Barbusse, 93000 Bobigny, France</span>
                                            </div>
                                            <div className={"-contact"}>
                                                <span className={"-phone"}>(+33) 6 67 91 26 26</span>
                                                <span className={"-email"}>laurent@viaprod.fr</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={"mt-25px"}>
                        <table className={"table"}>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Quantité</th>
                                    <th>Prix</th>
                                    <th>TVA</th>
                                    <th>Montant TTC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceDetails.map((item, index) => (
                                    <tr className={"txt-center"} key={index}>
                                        <td className={"txt-left"}>{item.label}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price}</td>
                                        <td>{item.tva}</td>
                                        <td>{item.price * item.tva}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={"mt-25px d-flex"}>
                        <div className={"w-50"}></div>
                        <div className={"w-50"}>
                            <table className={"table"}>
                                <tbody>
                                    <tr>
                                        <td>Montant Total HT (€)</td>
                                        <td>{priceHT(invoiceDetails)}</td>
                                    </tr>
                                    <tr>
                                        <td>TVA (%)</td>
                                        <td>20%</td>
                                    </tr>
                                    <tr>
                                        <td>Montant Total TTC (€)</td>
                                        <td>{priceTTC(invoiceDetails)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={"mt-25px"}>
                        <p>La loi n°92/1442 du 31 décembre 1992 nous fait l’obligation de vous indiquer que le non-respect des conditions de paiement entraîne des intérêts de retard suivant modalités et taux définis par la loi. Une indemnité forfaitaire de 40€ sera due pour frais de recouvrement en cas de retard de paiement.</p>
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}