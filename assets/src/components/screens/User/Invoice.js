import React, { useEffect, useState } from "react";
import UserHeader from "../../parts/UserHeader";
import SeeMoreButton from "../../parts/SeeMoreButton";
import PrivateResources from "../../utils/PrivateResources";
import { Link } from "react-router-dom";
import axios from "axios";
import FormControl from "../../utils/FormControl";
import Notification from "../../parts/Notification";
import { findParent } from "../../utils/DomElement";

export default function Invoice() {

    const formControl = new FormControl()
    const [ responseMessage, setResponseMessage ] = useState({})
    const { loading, items: invoices, load } = PrivateResources(`${window.location.origin}/api/invoices`)
    useEffect(() => {
        load()
    }, [])

    const handleRemove = (e) => {
        if(!confirm("Are you sure you want to delete this invoice ?")) {
            return
        }
        
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

        const trElement = e.currentTarget.parentNode.parentNode
        
        axios
            .delete(`${window.location.origin}/api/invoice/${invoiceID}/remove`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld"
                }
            })
            .then(response => {
                if(trElement.tagName == "TR") {
                    trElement.remove()
                }
            })
            .catch(error => {
                console.log(error)
                setResponseMessage({classname: "danger", message: "An error has been encountered during the delete process"})
            })
        ;
    }

    return (
        <UserHeader>
            <Link className={"btn btn-green"} to={"/user/invoice/new"}>
                <span>Add an invoice</span>
            </Link>

            <div className={"page-section"}>
                {Object.keys(responseMessage).length > 0 && (<Notification {...responseMessage} />)}

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
                                        <td className={"-invoice-date txt-center"}>{item.filename}</td>
                                        <td className={"-client-name txt-center"}>{item.company.name}</td>
                                        <td className={"-status txt-center"}>
                                            <span className={"badge badge-success"}>Paid</span>
                                        </td>
                                        <td className={"-amount txt-center"}>{item.totalAmount}</td>
                                        <td className={"-action txt-right"}>
                                            <SeeMoreButton url={"/user/invoice/" + item.id} />
                                            
                                            <button 
                                                className={"btn btn-red -inline-flex"} 
                                                data-invoice={item.id} 
                                                onClick={(e) => handleRemove(e)}
                                            >
                                                <img src={`${window.location.origin}/content/svg/trash.svg`} alt={""} />
                                            </button>

                                            <button className={"btn btn-blue -inline-flex"}>
                                                <img src={`${window.location.origin}/content/svg/download.svg`} alt={""} />
                                            </button>
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
                ) : (
                    <div className="">
                        <span>Loading ...</span>
                    </div>
                )}
            </div>
        </UserHeader>
    )
}