import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PrivateResources from "../../utils/PrivateResources";
import UserHeader from "../../parts/UserHeader";
import LinkButton from "../../parts/LinkButton";
import axios from "axios";

export default function InvoiceSingle() {
    const { invoiceID } = useParams()

    // const { loading: userLoading, items: user, load: userLoad } = PrivateResources(window.location.origin + "/api/user/" + invoiceID)
    const { loading: invoiceLoading, items: invoice, load } = PrivateResources(window.location.origin + "/api/invoice/" + invoiceID)

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
            <LinkButton
                classname={"btn-blue"}
                url={"/user/invoice"}
                value={"Return"}
                defaultIMG={"arrow-left"}
            />

            {!invoiceLoading ? (
                <div className={"page-section"}>
                    <div className={"d-flex"}>
                        <div className={"left w-50 txt-left"}>
                            <h3 className={"-title"}>Numéro de facture : {(new Date(invoice.invoiceDate)).toLocaleString("en-GB")}</h3>
                            <div className={"d-column"}>
                                <label>Date d'émission : {(new Date(invoice.createdAt).toLocaleString("en-GB"))}</label>
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
                            <div className={"item"}>Envoyer</div>
                            <div className={"item"}>En cours</div>
                            <div className={"item"}>En cours de paiement</div>
                            <div className={"item"}>Payer</div>
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
                                    <td className={"-provider"}>
                                        {typeof invoice.user == "object" && (
                                            <div className={"service-provider"}>
                                                <div className={"-identity"}>
                                                    <label>{invoice.user.fullname}</label>
                                                </div>
                                                <div className={"-address"}>
                                                    <span>
                                                        189, rue Vercingétorix, Paris 75014, France
                                                        {/* {invoice.user.address}, {invoice.user.zipCode} {invoice.user.city}, {invoice.user.country} */}
                                                    </span>
                                                </div>
                                                <div className={"-contact"}>
                                                    <span className={"-phone"}>(+33) 6 52 07 39 97</span>
                                                    <span className={"-email"}>gary.almeida.word@gmail.com</span>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className={"-client"}>
                                        {typeof invoice.company == "object" && (
                                            <div className={"service-provider"}>
                                                <div className={"-identity"}>
                                                    <label>{invoice.company.name}</label>
                                                </div>
                                                <div className={"-address"}>
                                                    <span>
                                                        {invoice.company.address}, {invoice.company.zipCode} {invoice.company.city}, {invoice.company.country}
                                                    </span>
                                                </div>
                                                <div className={"-contact"}>
                                                    {invoice.company.phone != "" && (<span className={"-phone"}>{invoice.company.phone}</span>)}
                                                    
                                                    {invoice.company.email != "" && (<span className={"-email"}>{invoice.company.email}</span>)}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={"mt-25px"}>
                        <table className={"table"}>
                            <thead>
                                <tr>
                                    <th className={"column-invoice-description"}>Description</th>
                                    <th className={"column-quantity"}>Quantité</th>
                                    <th className={"column-price"}>Montant HT</th>
                                    <th className={"column-tva"}>TVA</th>
                                    <th className={"column-amount"}>Montant TTC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[null, undefined].indexOf(invoice.invoiceDetails) == -1 && typeof invoice.invoiceDetails == "object" ? (
                                    invoice.invoiceDetails.map((item, index) => (
                                        <tr className={"txt-center"} key={index}>
                                            <td className={"-invoice-description txt-left"}>{item.description}</td>
                                            <td className={"-quantity"}>{item.quantity}</td>
                                            <td className={"-price"}>{item.price}</td>
                                            <td className={"-tva"}>{item.tva ? "20 %" : "0 %"}</td>
                                            <td className={"-amount"}>{(item.price * (item.tva ? 1.2 : 1)) * item.quantity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <p>There is nothing</p>
                                )}
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
                                        <td>{invoice.amount}</td>
                                    </tr>
                                    <tr>
                                        <td>TVA (20%)</td>
                                        <td>{invoice.tvaAmount}</td>
                                    </tr>
                                    <tr>
                                        <td>Montant Total TTC (€)</td>
                                        <td>{invoice.totalAmount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={"mt-25px"}>
                        <p>La loi n°92/1442 du 31 décembre 1992 nous fait l’obligation de vous indiquer que le non-respect des conditions de paiement entraîne des intérêts de retard suivant modalités et taux définis par la loi. Une indemnité forfaitaire de 40€ sera due pour frais de recouvrement en cas de retard de paiement.</p>
                    </div>
                </div>
            ) : (
                <p>Loading ...</p>
            )}
        </UserHeader>
    )
}