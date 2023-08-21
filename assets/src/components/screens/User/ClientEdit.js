import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import UserHeader from "../../parts/UserHeader";
import CompanyForm from "../../forms/CompanyForm";
import ReturnButton from "../../parts/ReturnButton";

export default function ClientEdit() {
    const { clientID } = useParams()
    const [client, setClient] = useState("")
    const [error, setError] = useState(false)

    useEffect(() => {
        axios
            .get("/api/company/" + clientID, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                alert(err.response.data.message)
                setError(true)
            })
        ;
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
                    <CompanyForm />
                </div>
            </div>
        </UserHeader>
    )
}