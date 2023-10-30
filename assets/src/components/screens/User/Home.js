import React, { useEffect, useState } from "react";
import UserHeader from "../../parts/UserHeader";
import LinkButton from "../../parts/LinkButton";
import PrivateResources from "../../utils/PrivateResources";
import axios from "axios";

export default function Home() {

    const { loading, items, load } = PrivateResources(`${window.location.origin}/api/resume`)
    useEffect(() => {
        load()
    }, [])

    return (
        <UserHeader>
            {!loading ? (
                <div className={"page-section"}>
                    {/* Resume */}
                    <div className={"resume d-flex-row"}>
                        <div className={"card item-row"}>
                            <div className={"-header"}></div>
                            <div className={"-content txt-right"}>
                                <span className={"label"}>Clients</span>
                                <span className={"number"}>{items.nbrClients}</span>
                            </div>
                            <div className={"-footer"}>
                                <span><em>+ 100%</em> than the last year</span>
                            </div>
                        </div>
                        <div className={"card item-row"}>
                            <div className={"-header"}></div>
                            <div className={"-content txt-right"}>
                                <span className={"label"}>Last month</span>
                                <span className={"number"}>{items.lastMonthAmount} €</span>
                                {/* <span className={"number"}>2500 €</span> */}
                            </div>
                            <div className={"-footer"}>
                                <span><em>+ 3%</em> than the last month</span>
                            </div>
                        </div>
                        <div className={"card item-row"}>
                            <div className={"-header"}></div>
                            <div className={"-content txt-right"}>
                                <span className={"label"}>Ongoing month</span>
                                <span className={"number"}>{items.ongoingMonthAmout} €</span>
                                {/* <span className={"number"}>500 €</span> */}
                            </div>
                            <div className={"-footer"}>
                                <span><em>- 80%</em> than the last month</span>
                            </div>
                        </div>
                        <div className={"card item-row"}>
                            <div className={"-header"}></div>
                            <div className={"-content txt-right"}>
                                <span className={"label"}>Current year benefit</span>
                                <span className={"number"}>{items.currentYearBenefit} €</span>
                                {/* <span className={"number"}>3000 €</span> */}
                            </div>
                            <div className={"-footer"}>
                                <span><em>+ 100%</em> than the last year</span>
                            </div>
                        </div>
                    </div>

                    {/* Resume block 1 */}
                    <div className={"d-flex-row mt-15px"}>

                        {/* Client */}                    
                        <div className={"card item-row"}>
                            <div className={"-header"}>
                                <label>Client</label>
                            </div>
                            <div className={"-content"}>
                                <table className={"table"}>
                                    <thead>
                                        <tr>
                                            <th className={"column-client-name txt-left"}>Client</th>
                                            <th className={"column-client-address"}>Address</th>
                                            <th className={"column-action"}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values({...items.clients}).map((client, index) => (
                                            <tr key={index}>
                                                <td className={"-client-name"}>{client.name}</td>
                                                <td className={"-client-address"}>{client.address + " " + client.zipCode + " " + client.city + ", " + client.country}</td>
                                                <td className={"-action txt-right"}>
                                                    <LinkButton 
                                                        classname={"btn-blue"}
                                                        url={`/user/client/${client.id}`}
                                                        defaultIMG={"eye"}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        {/* Invoice */}
                        <div className={"card item-row"}>
                            <div className={"-header"}>
                                <label>Invoice</label>
                            </div>
                            <div className={"-content"}>
                                <table className={"table"}>
                                    <thead>
                                        <tr>
                                            <th className={"column-invoice-date txt-left"}>Date</th>
                                            <th className={"column-client-name"}>Client</th>
                                            <th className={"column-status"}>Status</th>
                                            <th className={"column-invoice-euro"}>Amount</th>
                                            <th className={"column-action"}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values({...items.invoices}).map((invoice, index) => (
                                            <tr key={index}>
                                                <td className={"-invoice-date"}>{invoice.invoiceDate}</td>
                                                <td className={"-client-name txt-center"}>{invoice.company.name}</td>
                                                <td className={"-status txt-center"}>
                                                    <span className={"badge badge-success"}>Paid</span>
                                                </td>
                                                <td className={"-invoice-euro txt-center"}>EURO</td>
                                                <td className={"-action txt-right"}>
                                                    <LinkButton 
                                                        classname={"btn-blue"}
                                                        url={`/user/invoice/${invoice.id}`}
                                                        defaultIMG={"eye"}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Resume block 2 */}
                    <div className={"d-flex-row mt-15px"}>
                        
                        {/* Estimates */}
                        <div className={"card item-row"}>
                            <div className={"-header"}>
                                <label>Estimates</label>
                            </div>
                            <div className={"-content"}>
                                <table className={"table"}>
                                    <thead>
                                        <tr>
                                            <th className={"column-date txt-left"}>Date</th>
                                            <th className={"column-client-name"}>Client</th>
                                            <th className={"column-estimate-name"}>Devis</th>
                                            <th className={"column-amount"}>Amounts (€)</th>
                                            <th className={"column-action"}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values({...items.estimates}).map((estimate, index) => (
                                            <tr key={index}>
                                                <td className={"-date"}>{estimate.createdAt}</td>
                                                <td className={"-client-name txt-center"}>{estimate.company.name}</td>
                                                <td className={"-estimate-name txt-center"}>{estimate.label}</td>
                                                <td className={"-amount txt-center"}>2500</td>
                                                <td className={"-action"}>
                                                    <LinkButton 
                                                        classname={"btn-blue"}
                                                        url={`/user/estimate/${estimate.id}`}
                                                        defaultIMG={"eye"}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (<p>Loading</p>)}
        </UserHeader>
    )
}