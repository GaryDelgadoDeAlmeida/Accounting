import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import UserHeader from "../../parts/UserHeader"
import EstimateForm from "../../forms/EstimateForm"
import ReturnButton from "../../parts/ReturnButton"
import PrivateResources from "../../utils/PrivateResources"

export default function EstimateEdit() {

    const { estimateID } = useParams()
    const { load, items: estimate, loading } = PrivateResources(`${window.location.origin}/api/estimate/${estimateID}`)

    useEffect(() => {
        load()
    }, [])

    return (
        <UserHeader>
            <ReturnButton path={"/user/estimate"} />
            
            {!loading && (
                <div className={"page-section"}>
                    <EstimateForm estimate={estimate} />
                </div>
            )}
        </UserHeader>
    )
}