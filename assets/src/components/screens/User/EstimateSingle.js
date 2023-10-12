import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import UserHeader from "../../parts/UserHeader"
import LinkButton from "../../parts/LinkButton"
import PrivateResources from "../../utils/PrivateResources"

export default function EstimateSingle() {
    const { estimateID } = useParams()
    const { loading, items: estimate, load } = PrivateResources(`${window.location.origin}/api/estimate/${estimateID}`)

    useEffect(() => {
        load()
    }, [])

    const handleGeneratePDF = (e) => {
        console.log("HI handleGeneratePDF")
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
                                                    <span>{estimate.user.fullname}</span>
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
                                                    <span>{estimate.company.name}</span>
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
                                        estimate.estimateDetails.map((item, index) => (
                                            <tr key={index}>
                                                <td className={"-title"}>{item.label}</td>
                                                <td className={"-nbr-days txt-center"}>{item.nbrDays}</td>
                                                <td className={"-price txt-center"}>{item.price}</td>
                                                <td className={"-tva txt-center"}>20</td>
                                                <td className={"-amount txt-center"}>{item.price + (item.price * 1.2)}</td>
                                            </tr>
                                        ))
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
                                            <td className={""}>Total HT (€)</td>
                                            <td className={"-amount txt-center"}>{estimate.amount}</td>
                                        </tr>
                                        <tr>
                                            <td className={""}>TVA</td>
                                            <td className={"-tva txt-center"}>{estimate.tvaAmount}</td>
                                        </tr>
                                        <tr>
                                            <td className={""}>Total (€)</td>
                                            <td className={"-total-amount txt-center"}>{estimate.totalAmount}</td>
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