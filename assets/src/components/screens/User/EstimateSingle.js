import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import UserHeader from "../../parts/UserHeader"
import LinkButton from "../../parts/LinkButton"
import PrivateResources from "../../utils/PrivateResources"

export default function EstimateSingle() {
    const { estimateID } = useParams()
    const { loading, items: estimate, load } = PrivateResources(`/estimate/${estimateID}`)

    useEffect(() => {
        load()
    })

    const handleGeneratePDF = (e) => {
        // 
    }

    return (
        <UserHeader>
            <div className={"page-section"}>
                <LinkButton 
                    classname={"btn-blue"} 
                    url={"/user/estimate"} 
                    value={"Return"}
                    defaultIMG={"arrow-left"} 
                />

                <div className={"mt-15px"}>
                    <div className={""}></div>
                </div>
            </div>
        </UserHeader>
    )
}