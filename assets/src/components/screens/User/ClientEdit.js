import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import UserHeader from "../../parts/UserHeader";
import CompanyForm from "../../forms/CompanyForm";
import ReturnButton from "../../parts/ReturnButton";
import PrivateResources from "../../utils/PrivateResources"
import Notification from "../../parts/Notification";

export default function ClientEdit() {
    const { clientID } = useParams()
    const [error, setError] = useState(false)
    const { loading, items, load } = PrivateResources(`${window.location.origin}/api/company/${clientID}`)

    useEffect(() => {
        load()
    }, [])

    return (
        <UserHeader>
            {error && (<Navigate to={"/user/client"} replace={true} />)}

            <ReturnButton path={"/user/client/" + clientID}/>

            <div className={"card mt-25px"}>
                <div className={"-header"}>
                    <label>Edit company</label>
                </div>
                <div className={"-content"}>
                    {!loading && items.company != null ? (
                        <CompanyForm company={items.company} />
                    ) : (
                        <Notification classname={"information"} message={"Loading ..."} />
                    )}
                </div>
            </div>
        </UserHeader>
    )
}