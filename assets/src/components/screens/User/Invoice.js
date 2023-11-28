import React, { useEffect, useState } from "react";
import UserHeader from "../../parts/UserHeader";
import SeeMoreButton from "../../parts/SeeMoreButton";
import PrivateResources from "../../utils/PrivateResources";
import Notification from "../../parts/Notification";
import FormControl from "../../utils/FormControl";
import LinkButton from "../../parts/LinkButton";
import RemoveButton from "../../parts/RemoveButton";
import axios from "axios";

export default function Invoice() {

    const formControl = new FormControl()
    const [offset, setOffset] = useState(1)
    const [limit, setLimit] = useState(20)
    const { loading, items: invoices, load } = PrivateResources(`${window.location.origin}/api/invoices?offset=${offset}&limit=${limit}`)
    useEffect(() => {
        load()
    }, [])

    const handlePagination = (e) => {
        setOffset(
            parseInt(e.currentTarget.value)
        )
    }

    const handleDownload = (e) => {
        // console.log("Hi handleDownload")

        let invoiceID = e.currentTarget.getAttribute("data-invoice")
        if(!formControl.checkMinLength(invoiceID, 1)) {
            setResponseMessage({classname: "danger", message: "A necessary information is missing. Please check that you didn't change anything."})
            return
        }

        if(!formControl.checkNumber(invoiceID)) {
            setResponseMessage({classname: "danger", message: "The invoice id isn't numeric"})
            return
        }

        axios
            .get(`${window.location.origin}/api/invoice/${invoiceID}/pdf`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/pdf"
                }
            })
            .then(response => {
                // console.log(response, response.data, response.status)
                // window.open("url", "_blank")
            })
            .catch(({response}) => {
                let errorMessage = "An error has been encountered. Please retry later"
                if(response.data != "") {
                    errorMessage = response.data
                }

                alert(errorMessage)
            })
        ;
    }

    return (
        <UserHeader>
            <LinkButton 
                classname={"btn-green"} 
                url={"/user/invoice/new"}
                value={"Add an invoice"}
            />

            <div className={"page-section"}>
                {!loading ? (
                    <>
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
                                        <tr id={`-invoice-row-${index + 1}`} key={index}>
                                            <td className={"-invoice-date txt-center"}>{item.filename}</td>
                                            <td className={"-client-name txt-center"}>{item.company.name}</td>
                                            <td className={"-status txt-center"}>
                                                <span className={"badge badge-success"}>Paid</span>
                                            </td>
                                            <td className={"-amount txt-center"}>{item.totalAmount}</td>
                                            <td className={"-action txt-right"}>
                                                <SeeMoreButton 
                                                    url={"/user/invoice/" + item.id} 
                                                    smallSizeBtn={true}
                                                />

                                                <LinkButton 
                                                    classname={"btn-orange"} 
                                                    url={`/user/invoice/${item.id}/edit`}
                                                    defaultIMG={"pencil"}
                                                    smallSizeBtn={true}
                                                />

                                                <button 
                                                    className={"btn btn-sm btn-blue -inline-flex"} 
                                                    onClick={(e) => handleDownload(e)}
                                                    data-invoice={item.id}
                                                >
                                                    <img src={`${window.location.origin}/content/svg/download-white.svg`} alt={""} />
                                                </button>

                                                <RemoveButton
                                                    removeUrl={`${window.location.origin}/api/invoice/${item.id}/remove`}
                                                    parentElementId={`-invoice-row-${index + 1}`}
                                                    smallSizeBtn={true}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className={"txt-center"}>
                                        <td colSpan={5}>There is no invoice registered</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {invoices.length > 0 && typeof invoices === "object" && (
                            <div className={"pagination"}>
                                {offset - 1 > 0 && (
                                    <div className={"item"}>
                                        <button onClick={(e) => handlePagination(e)} value={offset - 1}>{offset - 1}</button>
                                    </div>
                                )}

                                <div className={"item current-page"}>
                                    <span>{offset}</span>
                                </div>

                                {offset + 1 < 100 && (
                                    <div className={"item"}>
                                        <button onClick={(e) => handlePagination(e)} value={offset + 1}>{offset + 1}</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <Notification classname={"information"} message={"Loading ..."} />
                )}
            </div>
        </UserHeader>
    )
}