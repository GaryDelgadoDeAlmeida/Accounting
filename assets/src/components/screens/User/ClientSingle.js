import React, { useEffect, useState } from "react";
import UserHeader from "../../parts/UserHeader";
import { Navigate, useParams } from "react-router-dom";
import ReturnButton from "../../parts/ReturnButton";
import LinkButton from "../../parts/LinkButton";
import Badge from "../../parts/Badge";
import axios from "axios";
import RemoveButton from "../../parts/RemoveButton";
import Notification from "../../parts/Notification";

export default function ClientSingle() {

    const { clientID } = useParams()
    const [loading, setLoading] = useState(false)
    const [client, setClient] = useState({})
    const [invoices, setInvoices] = useState({})
    const [estimates, setEstimates] = useState({})
    const [error, setError] = useState(false)

    // const { loading, items: client, load } = PrivateRessources(`${window.location.origin}/api/company/${clientID}`)
    
    useEffect(() => {
        setLoading(true)
        axios
            .get(`${window.location.origin}/api/company/${clientID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(res => {
                let {company, estimates, invoices} = res.data
                
                setClient(
                    JSON.parse(JSON.stringify(company))
                )
                setInvoices(
                    JSON.parse(JSON.stringify(invoices))
                )
                setEstimates(
                    JSON.parse(JSON.stringify(estimates))    
                )
            })
            .catch(err => {
                let message = err.response.data.message ?? err.response.data.detail
                alert(message)
                setError(true)
            })
        ;
        setLoading(false)
    }, [])
    
    return (
        <UserHeader>
            {error && <Navigate to={"/user/client"} replace={true} />}
            
            <ReturnButton path={"/user/client"} />
            
            {loading === false && client != null ? (
                <div className={"page-section"}>
                    {/* Client Address */}
                    <div className={"card client-identity"}>
                        <div className={"client-img"}>
                            <img src={`${window.location.origin}/content/img/client/viaprod.png`} alt={client.name} />
                        </div>
                        <div className={"client-infos"}>
                            <span className={"client-name"}>{client.name}</span>
                            <span className={"client-address"}>{
                                client.address + ", " + 
                                client.zipCode + " " + 
                                client.city + ", " + 
                                client.country
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
                    <div className={"client-estimates mt-15px"}>
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
                                {estimates.length > 0 && typeof estimates === "object" && client.estimates.map((item, index) => (
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
                                ))}

                                {estimates.length == 0 && (
                                    <tr className={"txt-center"}>
                                        <td colSpan={4}>There is no estimate registered for this client</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* All Invoices */}
                    <div className={"client-invoices mt-15px"}>
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
                                {invoices.length > 0 && typeof invoices === "object" && invoices.map((item, index) => (
                                    <tr id={`-invoice-row-${index + 1}`} key={index}>
                                        <td className={"-invoice-date txt-center"}>{(new Date(item.invoiceDate)).toLocaleDateString(undefined, {year:"numeric", month:"numeric"})}</td>
                                        <td className={"-status txt-center"}>
                                            <span className={"badge badge-success"}>Paid</span>
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
                                ))}

                                {invoices.length == 0 && (
                                    <tr className={"txt-center"}>
                                        <td colSpan={4}>There is no invoice registered for this client</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <Notification classname={"information"} message={"Loading ..."} />
            )}
        </UserHeader>
    )
}