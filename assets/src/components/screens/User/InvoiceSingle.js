import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import UserHeader from "../../parts/UserHeader";
import LinkButton from "../../parts/LinkButton";
import Notification from "../../parts/Notification";
import PrivateResources from "../../utils/PrivateResources";
import InvoiceStatus from "../../parts/InvoiceStatus";
import { formatDate, lastMonthDay } from "../../utils/DomElement";

export default function InvoiceSingle() {
    const { invoiceID } = useParams()
    if(isNaN(invoiceID)) {
        return <Navigate to={"/user/invoice"} />
    }

    const storageUser = localStorage.getItem("user") ?? []
    const user = JSON.parse(storageUser)
    const { loading: invoiceLoading, items: invoice, load } = PrivateResources(`${window.location.origin}/api/invoice/${invoiceID}`)
    useEffect(() => {
        load()
    }, [])

    const handleDownloadInvoice = async (e) => {
        await fetch(`${window.location.origin}/api/invoice/${invoiceID}/pdf`, {
            method: "GET",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/ld+json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.token
            }
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', decodeURI('invoice.pdf'));
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            link.remove();
        })
        .catch(error => {
            console.log(error)
            alert("An error has been encountered. The PDF invoice couldn't be downloded.")
        })
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
                                <label>Date d'émission : { formatDate(invoice.invoiceDate, "fr") }</label>
                                <label>Date d'échéance : { formatDate(lastMonthDay(invoice.invoiceDate), "fr") }</label>
                            </div>
                        </div>
                        <div className={"right w-50 txt-right m-auto"}>
                            <button className={"btn -inline-flex"} onClick={(e) => handleDownloadInvoice(e)}>
                                <img src={`${window.location.origin}/content/svg/download.svg`} alt={""} />
                            </button>
                        </div>
                    </div>

                    <div className={"mt-25px"}>
                        <InvoiceStatus />
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
                                                    {invoice.user.freelance && (
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
                                                    {invoice.company && (
                                                        <>
                                                            <span className={"-phone"}>{invoice.company.phone}</span>
                                                            <span className={"-email"}>{invoice.company.email}</span>
                                                        </>
                                                    )}
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
                                    <th className={"column-tva"}>TVA (%)</th>
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
                                            <td className={"-tva"}>{ invoice.applyTVA ? invoice.tva : 0 }</td>
                                            <td className={"-amount"}>{ item.totalAmount }</td>
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
                                        <td className={"-m-hidden"}>TVA</td>
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
                <div className={"page-section"}>
                    <Notification classname={"information"} message={"Loading ..."} />
                </div>
            )}
        </UserHeader>
    )
}