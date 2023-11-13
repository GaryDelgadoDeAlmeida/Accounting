import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import UserHeader from "../../parts/UserHeader"
import LinkButton from "../../parts/LinkButton"
import Notification from "../../parts/Notification"
import PrivateResources from "../../utils/PrivateResources"
import axios from "axios"

export default function EstimateSingle() {
    const { estimateID } = useParams()
    const [error, setError] = useState(false)
    const { loading, items: estimate, load } = PrivateResources(`${window.location.origin}/api/estimate/${estimateID}`)

    useEffect(() => {
        load()
    }, [])

    const handleGeneratePDF = (e) => {
        console.log("HI handleGeneratePDF")
        setError(false)
        if(estimateID != null) {
            axios
                .get(`${window.location.origin}/api/estimate/${estimateID}/pdf`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/pdf",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "ReferrerPolicy": "no-referrer",
                        "Mode": "no-cors"
                    }
                })
                .then(response => {
                    console.log(response, response.data)
                    const aElement = document.createElement('a');
                    aElement.setAttribute('download', estimate.label);
                    
                    const href = URL.createObjectURL(
                        new Blob([response.data], {type: "application/pdf"})
                    );
                    aElement.href = href;
                    aElement.setAttribute('target', '_blank');
                    aElement.click();
                    URL.revokeObjectURL(href);
                })
                .catch(error => {
                    console.log(error)
                    setError(true)
                })
            ;
        }
    }

    return (
        <UserHeader>
            <div className={"page-section"}>
                <LinkButton 
                    classname={"btn-blue"} 
                    url={"/user/estimate"} 
                    value={"Return"}
                    defaultIMG={"arrow-left"} 
                />

                {!loading && Object.keys(estimate).length > 0 ? (
                    <div className={"mt-15px"}>
                        {error && (
                            <Notification classname={"danger"} message={"An error has been encountered. Please retry downloading the estimate later."} />
                        )}
                        <div className={"d-flex"}>
                            <div className={"w-50"}>
                                <label>Estimate N°1</label>
                                <div className={"d-column"}>
                                    <span>Nombre de devis : 1</span>
                                    <span>Date d'émission : {Date.now("Y-m-d")}</span>
                                    <span>Date d'échéance : {Date.now("Y-m-d")}</span>
                                </div>
                            </div>
                            <div className={"w-50 txt-right"}>
                                <button className={"btn -inline-flex"} onClick={(e) => handleGeneratePDF(e)}>
                                    <img src={`${window.location.origin}/content/svg/download.svg`} alt={""} />
                                </button>
                            </div>
                        </div>

                        <div className={"mt-25px"}>
                            <table className={"table"}>
                                <thead>
                                    <tr>
                                        <th className={"column-freelance"}>Freelance</th>
                                        <th className={"column-client"}>Client</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className={"-freelance"}>
                                            <div className={"service-provider"}>
                                                <div className={"-identity"}>
                                                    <span className={"txt-bold"}>{estimate.user.fullname}</span>
                                                    <span>SIREN : 914 002 308</span>
                                                    <span>N° de TVA : FR 72914002308</span>
                                                </div>
                                                <div className={"-address"}>
                                                    <span>189, rue Vercingétorix, 75014 Paris, France</span>
                                                </div>
                                                <div className={"-contact"}>
                                                    <span className={"-phone"}>(+33) 6 52 07 39 97</span>
                                                    <span className={"-email"}>{estimate.user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={"-client"}>
                                            <div className={"service-provider"}>
                                                <div className={"-identity"}>
                                                    <span className={"txt-bold"}>{estimate.company.name}</span>
                                                    <span>SIREN : {estimate.company.siren}</span>
                                                    <span>SIRET : {estimate.company.siret}</span>
                                                </div>
                                                <div className={"-address"}>
                                                    <span>{
                                                        estimate.company.address + ", " + 
                                                        estimate.company.zipCode + " " + 
                                                        estimate.company.city + ", " + 
                                                        estimate.company.country
                                                    }</span>
                                                </div>
                                                <div className={"-contact"}>
                                                    {estimate.company.phone != "" && (<span className={"-phone"}>{estimate.company.phone}</span>)}
                                                    {estimate.company.email != "" && (<span className={"-email"}>{estimate.company.email}</span>)}
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
                                        <th className={"column-description"}>Description</th>
                                        <th className={"column-nbr-days"}>Nbr de jours</th>
                                        <th className={"column-unit-price"}>Prix unitaire HT</th>
                                        <th className={"column-tva"}>TVA (%)</th>
                                        <th className={"column-amount"}>Total TTC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estimate.estimateDetails != undefined && estimate.estimateDetails.length > 0 ?
                                        estimate.estimateDetails.map((item, index) => {
                                            let budget = (item.price * item.nbrDays) * item.quantity

                                            return (
                                                <tr key={index}>
                                                    <td className={"-title"}>{item.label}</td>
                                                    <td className={"-nbr-days txt-center"}>{item.nbrDays}</td>
                                                    <td className={"-price txt-center"}>{item.price}</td>
                                                    <td className={"-tva txt-center"}>20</td>
                                                    <td className={"-amount txt-center"}>{budget * 1.2}</td>
                                                </tr>
                                            )
                                        })
                                    : (
                                        <tr className={"txt-center"}>
                                            <td colSpan={5}>There is no details for this estimate</td>
                                        </tr>
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
                                            <td className={"-m-hidden"}>Total HT (€)</td>
                                            <td className={"-amount txt-center"}>{estimate.amount}</td>
                                        </tr>
                                        <tr>
                                            <td className={"-m-hidden"}>TVA</td>
                                            <td className={"-tva txt-center"}>{estimate.tvaAmount}</td>
                                        </tr>
                                        <tr>
                                            <td className={"-m-hidden"}>Total (€)</td>
                                            <td className={"-total txt-center"}>{estimate.totalAmount}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading ...</p>
                )}
            </div>
        </UserHeader>
    )
}