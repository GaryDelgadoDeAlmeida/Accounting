import React, { useEffect, useState } from "react";
import { findParent } from "../../utils/DomElement";

export default function EstimateDetailTable({estimate_details, update}) {

    const [estimateDetails, setEstimateDetails] = useState(estimate_details ?? [])
    let keys = Object.keys(estimateDetails)

    useEffect(() => {
        updateCredentials()
    }, [estimateDetails])

    useEffect(() => {
        handleChange()
    }, [estimate_details])

    const updateCredentials = () => {
        update("details", estimateDetails)
    }

    const handleChange = () => {
        setEstimateDetails(estimate_details)
    }

    const handleRemove = (e) => {
        let parent = findParent(e.currentTarget, "-item-cell")
        let row = parent.id

        let details = {...estimateDetails}
        delete details[row]

        setEstimateDetails({
            ...details
        })
    }

    return (
        <div className={"card item-row"}>
            <div className={"-content"}>
                <table className={"table"}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Quantity</th>
                            <th>Unit. Price (€)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id={"estimate-details"}>
                        {keys.length > 0 && Object.values(estimateDetails).map((item, index) => (
                            <tr id={keys[index]} className={"-item-cell"} key={index}>
                                <td className={"-title"}>{item.label}</td>
                                <td className={"-quantity txt-center"}>{item.quantity}</td>
                                <td className={"-price txt-center"}>{item.price}</td>
                                <td className={"-action txt-right"}>
                                    <button 
                                        type={"button"} 
                                        className={"btn btn-red -inline-flex"} 
                                        onClick={(e) => handleRemove(e)}
                                    >
                                        <img src={`${window.location.origin}/content/svg/trash-white.svg`} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}