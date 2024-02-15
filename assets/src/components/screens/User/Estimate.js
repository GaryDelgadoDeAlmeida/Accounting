import React, { useEffect, useState } from "react";
import UserHeader from "../../parts/UserHeader";
import SeeMoreButton from "../../parts/SeeMoreButton";
import PrivateResources from "../../utils/PrivateResources";
import LinkButton from "../../parts/LinkButton";
import RemoveButton from "../../parts/RemoveButton";
import Notification from "../../parts/Notification";
import { formatDate } from "../../utils/DomElement";

export default function Estimate() {

    const storageUser = localStorage.getItem("user") ?? []
    const user = JSON.parse(storageUser)
    
    const [offset, setOffset] = useState(1)
    const {loading, items: estimates, load} = PrivateResources(`${window.location.origin}/api/estimate?offset=${offset}`)

    useEffect(() => {
        load()
    }, [])

    const handlePagination = (e) => {
        setOffset(
            parseInt(e.target.value)
        )
    }

    const handleDownload = async (e) => {
        const estimateID = e.currentTarget.getAttribute("data-estimateid")
        if(!estimateID) {
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
            })
        } catch(error) {
            console.log(error)
            alert("An error has been encountered. The PDF estimate couldn't be downloded.")
        }
    }

    return (
        <UserHeader>
            <LinkButton
                classname={"btn-green"}
                value={"Add an estimate"}
                url={"/user/estimate/new"}
            />
            
            <div className={"page-section"}>
                {!loading ? (
                    <>
                        <table className={"table"}>
                            <thead>
                                <tr>
                                    <th className={"column-id"}>ID</th>
                                    <th className={"column-client-name"}>Client</th>
                                    <th className={"column-estimate-name"}>Name</th>
                                    <th className={"column-date"}>Date</th>
                                    <th className={"column-action"}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {estimates.results && typeof estimates === "object" ? (
                                    estimates.results.map((item, index) => (
                                        <tr id={`-estimate-row-${index + 1}`} key={index}>
                                            <td className={"-id txt-center"}>{item.id}</td>
                                            <td className={"-client-name txt-center"}>{item.company.name}</td>
                                            <td className={"-estimate-name txt-center"}>{item.label}</td>
                                            <td className={"-date txt-center"}>{item.estimateDate ? formatDate(item.estimateDate) : null}</td>
                                            <td className={"-action txt-right"}>
                                                <SeeMoreButton url={"/user/estimate/" + item.id} />

                                                <LinkButton
                                                    classname={"btn-orange"}
                                                    url={`/user/estimate/${item.id}/edit`} 
                                                    defaultIMG={"pencil"}
                                                />

                                                <button 
                                                    className={"btn btn-green -inline-flex"}
                                                    data-estimateid={item.id}
                                                    onClick={(e) => handleDownload(e)}
                                                >
                                                    <img src={`${window.location.origin}/content/svg/download-white.svg`} alt={"download"} />
                                                </button>

                                                <RemoveButton
                                                    removeUrl={`${window.location.origin}/api/estimate/${item.id}/remove`}
                                                    parentElementId={`-estimate-row-${index + 1}`}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className={"txt-center"}>
                                        <td colSpan={5}>There is no estimate registered</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {offset > 0 && offset <= estimates.maxOffset && estimates.maxOffset > 1 && (
                            <div className={"pagination"}>
                                {offset - 1 > 0 && (
                                    <div className={"item"}>
                                        <button onClick={(e) => handlePagination(e)} value={offset - 1}>{offset - 1}</button>
                                    </div>
                                )}

                                <div className={"item current-page"}>
                                    <span>{offset}</span>
                                </div>
                                
                                {offset + 1 <= estimates.maxOffset && (
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