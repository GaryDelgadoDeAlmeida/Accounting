import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import UserHeader from "../../parts/UserHeader"
import LinkButton from "../../parts/LinkButton"
import PrivateResources from "../../utils/PrivateResources"

export default function EstimateSingle() {
    const { estimateID } = useParams()
    const { loading, items: estimate, load } = PrivateResources(`/estimate/${estimateID}`)

    useEffect(() => {
        load()
    })

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
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={"service-provider txt-left"}>
                                            <div className={"-identity"}>
                                                <span>Garry ALMEIDA</span>
                                                <span>SIREN : 914 002 308</span>
                                                <span>N° de TVA : FR 72914002308</span>
                                            </div>
                                            <div className={"-address"}>
                                                <span>189, rue Vercingétorix, 75014 Paris, France</span>
                                            </div>
                                            <div className={"-contact"}>
                                                <span className={"-phone"}>(+33) 6 52 07 39 97</span>
                                                <span className={"-email"}>gary.almeida.work@gmail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={"service-provider txt-right"}>
                                            <div className={"-identity"}>
                                                <span>VIAPROD</span>
                                                <span>SIREN : 812 757 326</span>
                                            </div>
                                            <div className={"-address"}>
                                                <span>58, Avenue Henri Barbusse, 93000 Bobigny, France</span>
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
                                    <th>Nbr de jours</th>
                                    <th>Prix unitaire HT</th>
                                    <th>TVA (%)</th>
                                    <th>Total TTC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estimate.estimateDetails != undefined && estimate.estimateDetails.length > 0 ?
                                    estimate.estimateDetails.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.label}</td>
                                            <td></td>
                                            <td>{item.price}</td>
                                            <td>20</td>
                                            <td>{item.price + (item.price * 1.2)}</td>
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
                                        <td>Total HT (€)</td>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <td>TVA</td>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <td>Total (€)</td>
                                        <td>0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}