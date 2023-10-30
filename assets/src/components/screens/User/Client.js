import React, { useEffect, useState } from "react";
import UserHeader from "../../parts/UserHeader";
import { Link } from "react-router-dom";
import LinkButton from "../../parts/LinkButton";
import PrivateResources from "../../utils/PrivateResources";

export default function Client() {

    const [offset, setOffset] = useState(1)
    const [limit, setLimit] = useState(20)
    const { loading, items: clients, load } = PrivateResources(`${window.location.origin}/api/companies?offset=${offset}&limit=${limit}`)
    useEffect(() => {
        load()
    }, [])

    const handlePagination = (e) => {
        setOffset(
            parseInt(e.currentTarget.value)
        )
    }

    return (
        <UserHeader>
            <Link 
                to={"/user/client/new"}
                className={"btn btn-green"} 
            >
                <span>Add a client</span>
            </Link>

            <div className={"page-section"}>
                {!loading ? (
                    <div className={"d-flex-col -no-reverse"}>
                        {clients.map((item, index) => (
                            <div key={index} className={"card"}>
                                <div className={"-content"}>
                                    <div className={"d-flex-col"}>
                                        <span className={""}>{item.name}</span>
                                        <span>{item.address}, {item.city} {item.zip_code}, {item.country}</span>
                                    </div>
                                    
                                    <div className={"d-flex-row"}>
                                        <LinkButton 
                                            classname={"btn-blue"}
                                            url={"/user/client/1"}
                                            defaultIMG={"eye"}
                                        />

                                        <LinkButton 
                                            classname={"btn-blue"}
                                            url={"/user/client/1/edit"}
                                            defaultIMG={"pencil"}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

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
                    </div>
                ) : (
                    <span>Loading ...</span>
                )}
            </div>
        </UserHeader>
    )
}