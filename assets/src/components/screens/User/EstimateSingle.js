import React, { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import UserHeader from "../../parts/UserHeader"
import LinkButton from "../../parts/LinkButton"
import Notification from "../../parts/Notification"
import PrivateResources from "../../utils/PrivateResources"
import { formatDate, lastMonthDay } from "../../utils/DomElement"
import axios from "axios"

export default function EstimateSingle() {
    const { estimateID } = useParams()
    if(isNaN(estimateID)) {
        return <Navigate to={"/user/estimate"} />
    }

    const storageUser = localStorage.getItem("user") ?? []
    const user = JSON.parse(storageUser)
    const [error, setError] = useState(false)
    const { loading, items: estimate, load } = PrivateResources(`${window.location.origin}/api/estimate/${estimateID}`)

    useEffect(() => {
        load()
    }, [])

    const handleGeneratePDF = async (e) => {
        setError(false)
        
        if(!estimateID) {
            setError(true)
            return
        }

        try {
            await fetch(`${window.location.origin}/api/estimate/${estimateID}/pdf`, {
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
                link.setAttribute('download', decodeURI('estimate.pdf'));
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                link.remove();
                setError(false)
            })
        } catch(error) {
            console.log(error)
            setError(true)
        }
    }

    return (
        <UserHeader>
            
            <LinkButton 
                classname={"btn-blue"} 
                url={"/user/estimate"} 
                value={"Return"}
                defaultIMG={"arrow-left"} 
            />

            <div className={"page-section"}>
                {!loading && Object.keys(estimate).length > 0 ? (
                    <>
                        {error && (
                            <Notification classname={"danger"} message={"An error has been encountered. The PDF estimate couldn't be downloded."} />
                        )}
                        <div className={"d-flex"}>
                            <div className={"w-50"}>
                                <h2>{estimate.label}</h2>
                                <div className={"d-column"}>
                                    <span>Date d'émission : { formatDate(estimate.estimateDate, "fr") }</span>
                                    <span>Date d'échéance : { formatDate(lastMonthDay(estimate.estimateDate), "fr") }</span>
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
                                                    {estimate.user.freelance != null && (
                                                        <>
                                                            <span>SIREN : {estimate.user.freelance ? estimate.user.freelance.siren : null}</span>
                                                            <span>SIRET : {estimate.user.freelance? estimate.user.freelance.siret : null}</span>
                                                        </>
                                                    )}
                                                </div>
                                                
                                                {estimate.user.freelance != null && (
                                                    <div className={"-address"}>
                                                        <span>{
                                                            estimate.user.freelance.address + ", " +
                                                            estimate.user.freelance.city + " " +
                                                            estimate.user.freelance.zipCode + ", " +
                                                            estimate.user.freelance.country
                                                        }</span>
                                                    </div>
                                                )}
                                                <div className={"-contact"}>
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
                                                    {estimate.company && (
                                                        <>
                                                            <span className={"-phone"}>{estimate.company.phone}</span>
                                                            <span className={"-email"}>{estimate.company.email}</span>
                                                        </>
                                                    )}
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
                                                <td className={"-title"}>{ item.label }</td>
                                                <td className={"-nbr-days txt-center"}>{ item.nbrDays }</td>
                                                <td className={"-price txt-center"}>{ item.price }</td>
                                                <td className={"-tva txt-center"}>{ estimate.applyTVA ? estimate.tva : 0 }</td>
                                                <td className={"-amount txt-center"}>{ item.totalAmount }</td>
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
                    </>
                ) : (
                    <Notification classname={"information"} message={"Loading ..."} />
                )}
            </div>
        </UserHeader>
    )
}