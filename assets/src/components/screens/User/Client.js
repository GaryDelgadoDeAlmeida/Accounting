import React, { useEffect, useState } from "react";
import UserHeader from "../../parts/UserHeader";
import LinkButton from "../../parts/LinkButton";
import Notification from "../../parts/Notification";
import PrivateResources from "../../utils/PrivateResources";
import axios from "axios";
import { findParent } from "../../utils/DomElement";

export default function Client() {

    const [offset, setOffset] = useState(1)
    const [limit, setLimit] = useState(20)
    const [nbrOffset, setNbrOffset] = useState(1)
    const { loading, items: clients, load } = PrivateResources(`${window.location.origin}/api/companies?offset=${offset}&limit=${limit}`)
    useEffect(() => {
        load()
    }, [])

    const handlePagination = (e) => {
        setOffset(
            parseInt(e.currentTarget.value)
        )
    }

    const handleClientRemove = (e) => {
        const companyID = e.currentTarget.getAttribute("data-company")
        const currentElement = e.currentTarget
        axios
            .delete(`${window.location.origin}/api/company/${companyID}/remove`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json+ld",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
            .then((response) => {
                let parent = findParent(currentElement, "card")
                if(parent != null) {
                    parent.remove()
                }
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
                url={"/user/client/new"}
                value={"Add a client"}
            />

            <div className={"page-section"}>
                {!loading ? (
                    <div className={"d-flex-col -g-15px -no-reverse"}>
                        {clients.length > 0 ? (
                            <>
                                {clients.map((item, index) => (
                                    <div key={index} className={"card"}>
                                        <div className={"-content"}>
                                            <div className={"d-flex-col -g-5px"}>
                                                <span className={"txt-bold"}>{item.name}</span>
                                                <span>{item.address}, {item.city} {item.zip_code}, {item.country}</span>
                                            </div>
                                            
                                            <div className={"d-flex-row -g-5px"}>
                                                <LinkButton 
                                                    classname={"btn-blue"}
                                                    url={`/user/client/${item.id}`}
                                                    defaultIMG={"eye"}
                                                />
        
                                                <LinkButton 
                                                    classname={"btn-orange"}
                                                    url={`/user/client/${item.id}/edit`}
                                                    defaultIMG={"pencil"}
                                                />

                                                <button 
                                                    className={"btn btn-red -inline-flex"}
                                                    onClick={(e) => handleClientRemove(e)}
                                                    data-company={item.id}
                                                >
                                                    <img src={`${window.location.origin}/content/svg/trash-white.svg`} alt={"trash"} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {offset >= 1 && offset < nbrOffset && (
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
                            <Notification classname={"information"} message={"Vous n'avez aucun client enregistrer dans la base de données"} />
                        )}
                    </div>
                ) : (
                    <span>Loading ...</span>
                )}
            </div>
        </UserHeader>
    )
}