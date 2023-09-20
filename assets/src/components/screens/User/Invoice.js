import React, { useEffect } from "react";
import UserHeader from "../../parts/UserHeader";
import SeeMoreButton from "../../parts/SeeMoreButton";
import PrivateResources from "../../utils/PrivateResources";
import { Link } from "react-router-dom";

export default function Invoice() {

    const { loading, items: invoices, load } = PrivateResources("invoice")

    useEffect(() => {
        load()
    }, [])

    return (
        <UserHeader>
            <div className={"page-section"}>
                <Link className={"btn btn-green"} to={"/user/invoice/new"}>
                    <span>Add an invoice</span>
                </Link>
                
                <div className={"mt-15px"}>
                    {!loading ? (
                        <table className={"table"}>
                            <thead>
                                <tr>
                                    <th className={"column-invoice-date"}>Date</th>
                                    <th className={"column-client-name"}>Client</th>
                                    <th className={"column-status"}>Status</th>
                                    <th className={"column-amount"}>Amount (€)</th>
                                    <th className={"column-action"}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length > 0 && typeof invoices === "object" ? (
                                    invoices.map((item, index) => (
                                        <tr key={index}>
                                            <td className={"-invoice-date txt-center"}>2023/04</td>
                                            <td className={"-client-name txt-center"}>VIAPROD</td>
                                            <td className={"-status txt-center"}>
                                                <span className={"badge badge-success"}>Paid</span>
                                            </td>
                                            <td className={"-amount txt-center"}>2500</td>
                                            <td className={"-action txt-right"}>
                                                <SeeMoreButton url={"/user/invoice/1"} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5}>There is no invoice registered</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <div className="">
                            <span>Loading ...</span>
                        </div>
                    )}
                </div>
            </div>
        </UserHeader>
    )
}