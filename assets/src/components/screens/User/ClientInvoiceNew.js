import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import UserHeader from "../../parts/UserHeader";
import ReturnButton from "../../parts/ReturnButton";
import axios from "axios";

export default function ClientInvoiceNew() {
    const { clientID } = useParams()
    const [client, setClient] = useState({})
    const [error, setError] = useState(false)

    useEffect(() => {
        axios
            .get("/client/" + clientID, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                console.log(res)
                setClient(res.data)
            })
            .catch(err => {
                alert(err.response.data.message)
                setError(true)
            })
        ;
    }, [])

    return (
        <UserHeader>
            {error && <Navigate to={"/user/client/" + clientID} replace={true} />}
            
            <div className={"page-section"}>
                <ReturnButton path={"/user/client/" + clientID} />

                <div className={""}></div>
            </div>
        </UserHeader>
    )
}