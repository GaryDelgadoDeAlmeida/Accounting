import React, { useEffect, useState } from "react";
import UserHeader from "../../parts/UserHeader";
import SeeMoreButton from "../../parts/SeeMoreButton";
import PrivateResources from "../../utils/PrivateResources";
import { Link } from "react-router-dom";
import LinkButton from "../../parts/LinkButton";
import RemoveButton from "../../parts/RemoveButton";

export default function Estimate() {

    const [offset, setOffset] = useState(1)
    const limit = 20
    const {loading, items: estimates, load} = PrivateResources(`${window.location.origin}/api/estimate?offset=${offset}&limit=${limit}`)

    useEffect(() => {
        load()
    }, [])

    const handlePagination = (e) => {
        setOffset(
            parseInt(e.target.value)
        )
    }

    return (
        <UserHeader>
            <Link className={"btn btn-green"} to={"/user/estimate/new"}>
                <span>Add an estimate</span>
            </Link>
            
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
                                {estimates.length > 0 && typeof estimates === "object" ? (
                                    estimates.map((item, index) => (
                                        <tr id={`-estimate-row-${index + 1}`} key={index}>
                                            <td className={"-id txt-center"}>{item.id}</td>
                                            <td className={"-client-name txt-center"}>{item.company.name}</td>
                                            <td className={"-estimate-name txt-center"}>{item.label}</td>
                                            <td className={"-date txt-center"}>2023/05</td>
                                            <td className={"-action txt-right"}>
                                                <SeeMoreButton url={"/user/estimate/" + item.id} />

                                                <LinkButton
                                                    classname={"btn-orange"}
                                                    url={`/user/estimate/${item.id}/edit`} 
                                                    defaultIMG={"pencil"}
                                                />

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

                        <div className={"pagination"}>
                            {offset - 1 > 0 && (
                                <div>
                                    <button onClick={(e) => handlePagination(e)} value={offset - 1}>{offset - 1}</button>
                                </div>
                            )}

                            <div className={"current-page"}>
                                <span>{offset}</span>
                            </div>
                            
                            {offset + 1 < 100 && (
                                <div>
                                    <button onClick={(e) => handlePagination(e)} value={offset + 1}>{offset + 1}</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="">
                        <span>Loading ...</span>
                    </div>
                )}
            </div>
        </UserHeader>
    )
}