import React, { useEffect, useState } from "react";
import Badge from "../../parts/Badge";
import UserHeader from "../../parts/UserHeader";
import LinkButton from "../../parts/LinkButton";
import RemoveButton from "../../parts/RemoveButton";
import Notification from "../../parts/Notification";
import SeeMoreButton from "../../parts/SeeMoreButton";
import FormControl from "../../utils/FormControl";
import PrivateResources from "../../utils/PrivateResources";

export default function Invoice() {

    const storageUser = localStorage.getItem("user") ?? []
    const user = JSON.parse(storageUser)
    const [offset, setOffset] = useState(1)
    const formControl = new FormControl()
    const [ responseMessage, setResponseMessage ] = useState({})
    const { loading, items: invoices, load } = PrivateResources(`${window.location.origin}/api/invoices?offset=${offset}`)
    
    useEffect(() => {
        load()
    }, [offset])

    const handlePagination = (e) => {
        setOffset(
            parseInt(e.currentTarget.value)
        )
    }

    const handleDownload = async (e) => {
        setResponseMessage({})

        let invoiceID = e.currentTarget.getAttribute("data-invoice")
        if(!formControl.checkMinLength(invoiceID, 1)) {
            setResponseMessage({classname: "danger", message: "A necessary information is missing. Please check that you didn't change anything."})
            return
        }

        if(!formControl.checkNumber(invoiceID)) {
            setResponseMessage({classname: "danger", message: "The invoice id isn't numeric"})
            return
        }

        try {
            await fetch(`${window.location.origin}/api/invoice/${invoiceID}/pdf`, {
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
                link.setAttribute('download', decodeURI('invoice.pdf'));
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                link.remove();
            })
        } catch(error) {
            console.log(error)
            alert("An error has been encountered. The PDF invoice couldn't be downloded.")
        }
    }

    return (
        <UserHeader>
            <LinkButton 
                classname={"btn-green"} 
                url={"/user/invoice/new"}
                value={"Add an invoice"}
            />

            <div className={"page-section"}>
                {Object.keys(responseMessage).length > 0 && (
                    <Notification {...responseMessage} />
                )}

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
                                {invoices.results ? (
                                    invoices.results.map((item, index) => (
                                        <tr id={`-invoice-row-${index + 1}`} key={index}>
                                            <td className={"-invoice-date txt-center"}>{item.filename}</td>
                                            <td className={"-client-name txt-center"}>{item.company.name}</td>
                                            <td className={"-status txt-center"}>
                                                {item.status && (
                                                    <Badge txtContent={item.status} />
                                                )}
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

                        {offset > 0 && offset <= invoices.maxOffset && invoices.maxOffset > 1 && (
                            <div className={"pagination"}>
                                {offset - 1 > 0 && (
                                    <div className={"item"}>
                                        <button onClick={(e) => handlePagination(e)} value={offset - 1}>{offset - 1}</button>
                                    </div>
                                )}

                                <div className={"item current-page"}>
                                    <span>{offset}</span>
                                </div>

                                {offset + 1 <= invoices.maxOffset && (
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