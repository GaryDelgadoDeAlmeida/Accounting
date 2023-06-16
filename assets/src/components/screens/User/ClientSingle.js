import React, { useEffect } from "react";
import UserHeader from "../../parts/UserHeader";
import { useParams } from "react-router-dom";
import ReturnButton from "../../parts/ReturnButton";
import LinkButton from "../../parts/LinkButton";
import PrivateResources from "../../utils/PrivateResources";
import Badge from "../../parts/Badge";

export default function ClientSingle() {

    const { clientID } = useParams()
    const { loading, items: client, load } = PrivateResources("company/" + clientID)
    
    useEffect(() => {
        load()
    }, [])
    
    return (
        <UserHeader>
            <ReturnButton path={"/user/client"} />

            <div className={"page-section"}>
                {/* Client Address */}
                <div className={"card client-identity"}>
                    <div className={"client-img"}>
                        <img src={`${window.location.origin}/content/img/client/viaprod.png`} alt={client.name} />
                    </div>
                    <div className={"client-infos"}>
                        <span className={"client-name"}>{client.name}</span>
                        <span className={"client-address"}>{client.address}, {client.city} {client.zip_code}, {client.country}</span>
                        <div>
                            <LinkButton
                                classname={"btn-blue"}
                                url={`/user/${clientID}/edit`}
                                defaultIMG={"pencil"}
                            />
                        </div>
                    </div>
                </div>

                {/* All Estimate */}
                <div className={"client-estimates mt-15px"}>
                    <div className={"txt-right mb-15px"}>
                        <LinkButton 
                            classname={"btn-blue"}
                            url={"/user/client/" + clientID + "/estimate"}
                            value={"+"}
                        />
                    </div>
                    
                    <table className={"card table"}>
                        <thead>
                            <tr>
                                <th className={"column-date"}>Date</th>
                                <th className={"column-estimate-name"}>Name</th>
                                <th className={"column-signed"}>Signed</th>
                                <th className={"column-action"}>Action</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            <tr>
                                <td className={"-date txt-center"}>2023/04</td>
                                <td className={"-estimate-name txt-center"}>Devis n°2</td>
                                <td className={"-signed txt-center"}>
                                    <Badge type={"success"} txtContent={"SIGNED"} />
                                </td>
                                <td className={"-action txt-right"}>
                                    <LinkButton 
                                        classname={"btn-blue"}
                                        url={"/user/client/estimate/1"}
                                        defaultIMG={"eye"}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className={"-date txt-center"}>2023/04</td>
                                <td className={"-estimate-name txt-center"}>Devis n°3</td>
                                <td className={"-signed txt-center"}>
                                    <Badge type={"success"} txtContent={"SIGNED"} />
                                </td>
                                <td className={"-action txt-right"}>
                                    <LinkButton 
                                        classname={"btn-blue"}
                                        url={"/user/client/estimate/2"}
                                        defaultIMG={"eye"}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className={"-date txt-center"}>2023/05</td>
                                <td className={"-estimate-name txt-center"}>Devis n°4</td>
                                <td className={"-signed txt-center"}>
                                    <Badge type={"success"} txtContent={"SIGNED"} />
                                </td>
                                <td className={"-action txt-right"}>
                                    <LinkButton 
                                        classname={"btn-blue"}
                                        url={"/user/client/estimate/3"}
                                        defaultIMG={"eye"}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* All Invoices */}
                <div className={"client-invoices mt-15px"}>
                    <div className={"txt-right  mb-15px"}>
                        <LinkButton 
                            classname={"btn-blue"}
                            url={"/user/client/" + clientID + "/invoice"}
                            value={"+"}
                            // value={"Add an invoice"}
                        />
                    </div>

                    <table className={"card table"}>
                        <thead>
                            <tr>
                                <th className={"column-invoice-date"}>Date</th>
                                <th className={"column-status"}>Status</th>
                                <th className={"column-invoice-euro"}>Amount (€)</th>
                                <th className={"column-action"}>Action</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            <tr>
                                <td className={"-invoice-date txt-center"}>2023/04</td>
                                <td className={"-status txt-center"}>
                                    <span className={"badge badge-success"}>Paid</span>
                                </td>
                                <td className={"-invoice-euro txt-center"}>2500 €</td>
                                <td className={"-action"}>
                                    <LinkButton 
                                        classname={"btn-blue"}
                                        url={"/user/invoice/1"}
                                        defaultIMG={"eye"}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className={"-invoice-date txt-center"}>2023/05</td>
                                <td className={"-status txt-center"}>
                                    <span className={"badge badge-warning"}>Ongoing</span>
                                </td>
                                <td className={"-invoice-euro txt-center"}>500 €</td>
                                <td className={"-action"}>
                                    <LinkButton 
                                        classname={"btn-blue"}
                                        url={"/user/invoice/2"}
                                        defaultIMG={"eye"}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </UserHeader>
    )
}