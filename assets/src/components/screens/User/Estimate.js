import React, { useEffect } from "react";
import UserHeader from "../../parts/UserHeader";
import SeeMoreButton from "../../parts/SeeMoreButton";
import PrivateResources from "../../utils/PrivateResources";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Estimate() {

    const {loading, items: estimates, load} = PrivateResources("estimate")

    useEffect(() => {
        load()
    }, [])

    return (
        <UserHeader>
            <div className={"page-section"}>
                <Link className={"btn btn-green"} to={"/user/estimate/new"}>
                    <span>Add an estimate</span>
                </Link>

                <div className={"mt-15px"}>
                    {!loading ? (
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
                                        <tr key={index}>
                                            <td className={"-id txt-center"}>1</td>
                                            <td className={"-client-name txt-center"}>VIAPROD</td>
                                            <td className={"-estimate-name txt-center"}>Devis n°1</td>
                                            <td className={"-date txt-center"}>2023/05</td>
                                            <td className={"-action txt-right"}>
                                                <SeeMoreButton url={"/user/estimate/1"} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5}>There is no estimate registered</td>
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