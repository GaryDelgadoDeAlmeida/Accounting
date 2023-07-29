import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import UserHeader from "../../parts/UserHeader";

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
            .then(res => console.log(res.data))
            .catch(err => {
                alert(err.response.data.message)
                setError(true)
            })
        ;
    }, [])

    return (
        <UserHeader>
            {error && (<Navigate to={"/user/client"} replace={true} />)}

            <div className={"card"}>
                <div className={"-header"}></div>
                <div className={"-body"}></div>
            </div>
        </UserHeader>
    )
}