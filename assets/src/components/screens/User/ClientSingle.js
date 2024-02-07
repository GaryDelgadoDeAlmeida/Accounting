import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Badge from "../../parts/Badge";
import UserHeader from "../../parts/UserHeader";
import LinkButton from "../../parts/LinkButton";
import ReturnButton from "../../parts/ReturnButton";
import RemoveButton from "../../parts/RemoveButton";
import Notification from "../../parts/Notification";
import PrivateRessources from "../../utils/PrivateResources";

export default function ClientSingle() {

    const { clientID } = useParams()
    if(isNaN(clientID)) {
        return <Navigate to={"/user/client"} replace={true} />
    }

    const { loading, items: client, load, error } = PrivateRessources(`${window.location.origin}/api/company/${clientID}`)
    useEffect(() => {
        load()
    }, [])
    
    return (
        <UserHeader>
            <ReturnButton path={"/user/client"} />
            
            {!loading && Object.keys(client).length > 0 ? (
                <div className={"page-section"}>
                    {/* Client Address */}
                    <div className={"card client-identity"}>
                        <div className={"client-img"}>
                            <img src={`${window.location.origin}/content/img/client/viaprod.png`} alt={client.company.name} />
                        </div>
                        <div className={"client-infos"}>
                            <span className={"client-name"}>{client.company.name}</span>
                            <span className={"client-address"}>{
                                client.company.address + ", " + 
                                client.company.zipCode + " " + 
                                client.company.city + ", " + 
                                client.company.country
                            }</span>
                            <div>
                                <LinkButton
                                    classname={"btn-orange"}
                                    url={`/user/client/${clientID}/edit`}
                                    defaultIMG={"pencil"}
                                />
                            </div>
                        </div>
                    </div>

                    {/* All Estimate */}
                    <div className={"client-estimates mt-25px"}>
                        <div className={"txt-right mb-15px"}>
                            <h2>
                                Estimates
                                <LinkButton 
                                    classname={"btn-blue ml-15px"}
                                    url={"/user/client/" + clientID + "/estimate"}
                                    value={"+"}
                                />
                            </h2>
                        </div>
                        
                        <table className={"table"}>
                            <thead>
                                <tr>
                                    <th className={"column-date"}>Date</th>
                                    <th className={"column-estimate-name"}>Name</th>
                                    <th className={"column-signed"}>Signed</th>
                                    <th className={"column-action"}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {client.estimates && typeof client.estimates === "object" ? (
                                    client.estimates.map((item, index) => (
                                        <tr id={`-estimate-row-${index + 1}`} key={index}>
                                            <td className={"-date txt-center"}>
                                                {(new Date(item.createdAt)).toLocaleDateString(undefined, {year:"numeric", month:"numeric"})}
                                            </td>
                                            <td className={"-estimate-name txt-center"}>{item.label}</td>
                                            <td className={"-signed txt-center"}>
                                                <Badge txtContent={item.status} />
                                            </td>
                                            <td className={"-action txt-right"}>
                                                <LinkButton 
                                                    classname={"btn-blue"}
                                                    url={"/user/estimate/" + item.id}
                                                    defaultIMG={"eye"}
                                                />
                                                <RemoveButton
                                                    removeUrl={`${window.location.origin}/api/estimate/${item.id}/remove`}
                                                    parentElementId={`-estimate-row-${index + 1}`}
                                                />
                                            </td>
                                        </tr>
                                    )
                                )) : (
                                    <tr className={"txt-center"}>
                                        <td colSpan={4}>There is no estimate registered for this client</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* All Invoices */}
                    <div className={"client-invoices mt-25px"}>
                        <div className={"txt-right  mb-15px"}>
                            <h2>
                                Invoices
                                <LinkButton 
                                    classname={"btn-blue ml-15px"}
                                    url={"/user/client/" + clientID + "/invoice"}
                                    value={"+"}
                                />
                            </h2>
                        </div>

                        <table className={"table"}>
                            <thead>
                                <tr>
                                    <th className={"column-invoice-date"}>Date</th>
                                    <th className={"column-status"}>Status</th>
                                    <th className={"column-invoice-euro"}>Amount (€)</th>
                                    <th className={"column-action"}>Action</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                {client.invoices && typeof client.invoices === "object" ? (
                                    client.invoices.map((item, index) => (
                                        <tr id={`-invoice-row-${index + 1}`} key={index}>
                                            <td className={"-invoice-date txt-center"}>{(new Date(item.invoiceDate)).toLocaleDateString(undefined, {year:"numeric", month:"numeric"})}</td>
                                            <td className={"-status txt-center"}>
                                                <Badge txtContent={item.status} />
                                            </td>
                                            <td className={"-invoice-euro txt-center"}>{item.totalAmount} €</td>
                                            <td className={"-action"}>
                                                <LinkButton 
                                                    classname={"btn-blue"}
                                                    url={"/user/invoice/" + item.id}
                                                    defaultIMG={"eye"}
                                                />
                                                <RemoveButton
                                                    removeUrl={`${window.location.origin}/api/invoice/${item.id}/remove`}
                                                    parentElementId={`-invoice-row-${index + 1}`}
                                                />
                                            </td>
                                        </tr>
                                    )
                                )) : (
                                    <tr className={"txt-center"}>
                                        <td colSpan={4}>There is no invoice registered for this client</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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