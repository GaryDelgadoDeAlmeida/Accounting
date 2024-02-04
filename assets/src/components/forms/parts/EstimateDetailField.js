import React, { useState } from "react";

export default function estimateDetailField({update}) {

    const [estimateDetails, setEstimateDetails] = useState([])
    let keys = estimateDetails.length

    const updateCredentials = () => {
        update("details", estimateDetails)
    }

    const handleNew = (e) => {
        let $max = 0
        keys.map((item) => {
            if($max < parseInt(item)) {
                $max = parseInt(item)
            }
        })
        $max += 1

        setEstimateDetails({
            ...estimateDetails,
            [$max]: {
                title: "",
                quantity: 0,
                price: 0
            }
        })
    }

    const handleChange = (e, fieldName) => {
        let parent = findParent(e.currentTarget, "form-field-inline")
        let fieldValue = e.currentTarget.value
        let row = parent.id

        setEstimateDetails({
            ...estimateDetails,
            [row]: {
                ...estimateDetails[row],
                [fieldName]: fieldValue
            }
        })
    }

    const handleRemove = (e) => {
        let parent = findParent(e.currentTarget, "form-field-inline")
        let row = parent.id

        let answers = {...credentialAnswers}
        delete answers[row]

        setCredentialAnswers({
            ...answers
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
                            <th>Amount Unit. (€)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id={"estimate-details"}>
                        {objectKeys.length > 0 && typeof credentials.details == "object" && Object.values(credentials.details).map((item, index) => (
                            <tr id={objectKeys[index]} className={"-item-cell"} key={index}>
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