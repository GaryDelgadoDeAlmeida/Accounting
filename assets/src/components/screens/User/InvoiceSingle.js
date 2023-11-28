import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PrivateResources from "../../utils/PrivateResources";
import UserHeader from "../../parts/UserHeader";
import LinkButton from "../../parts/LinkButton";
import axios from "axios";
import Notification from "../../parts/Notification";

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
                            <h3 className={"-title"}>{invoice.filename}</h3>
                            <div className={"d-column"}>
                                <label>Date d'émission : {(new Date(invoice.invoiceDate).toLocaleString("en-GB"))}</label>
                                <label>Date d'échéance : {(new Date(invoice.invoiceDate).toLocaleString("en-GB"))}</label>
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
                            <div className={"item -active"}>
                                <span className={"txt-bold"}>Envoyer</span>
                            </div>
                            <div className={"item -ongoing"}>
                                <span className={"txt-bold"}>En cours</span>
                            </div>
                            <div className={"item"}>
                                <span className={"txt-bold"}>En cours de paiement</span>
                            </div>
                            <div className={"item"}>
                                <span className={"txt-bold"}>Payer</span>
                            </div>
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
                                                    <span className={"txt-bold"}>{invoice.user.fullname}</span>
                                                    {invoice.user.freelance != null && (
                                                        <>
                                                            <span>SIREN : {invoice.user.freelance.siren}</span>
                                                            <span>SIRET : {invoice.user.freelance.siret}</span>
                                                        </>
                                                    )}
                                                </div>
                                                
                                                {invoice.user.freelance != null && (
                                                    <div className={"-address"}>
                                                        <span>{
                                                            invoice.user.freelance.address + ", " + 
                                                            invoice.user.freelance.zipCode + " " + 
                                                            invoice.user.freelance.city + ", " +
                                                            invoice.user.freelance.country
                                                        }</span>
                                                    </div>
                                                )}

                                                <div className={"-contact"}>
                                                    <span className={"-email"}>{invoice.user.email}</span>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className={"-client"}>
                                        {typeof invoice.company == "object" && (
                                            <div className={"service-provider"}>
                                                <div className={"-identity"}>
                                                    <span className={"txt-bold"}>{invoice.company.name}</span>
                                                    <span>SIREN : {invoice.company.siren}</span>
                                                    <span>SIRET : {invoice.company.siret}</span>
                                                </div>
                                                <div className={"-address"}>
                                                    <span>{
                                                        invoice.company.address + ", " +
                                                        invoice.company.zipCode + " " +
                                                        invoice.company.city + ", " +
                                                        invoice.company.country
                                                    }</span>
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
                                    <th className={"column-description"}>Description</th>
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
                                            <td className={"-description txt-left"}>{item.description}</td>
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
                                        <td className={"-m-hidden"}>Montant Total HT (€)</td>
                                        <td className={"-amount"}>{invoice.amount}</td>
                                    </tr>
                                    <tr>
                                        <td className={"-m-hidden"}>TVA (20%)</td>
                                        <td className={"-tva"}>{invoice.tvaAmount}</td>
                                    </tr>
                                    <tr>
                                        <td className={"-m-hidden"}>Montant Total TTC (€)</td>
                                        <td className={"-total"}>{invoice.totalAmount}</td>
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
                <Notification classname={"information"} message={"Loading ..."} />
            )}
        </UserHeader>
    )
}