import React, { useEffect, useState } from "react";
import FormControl from "../../utils/FormControl";

export default function EstimateDetailField({update, setFormResponse}) {

    const formControl = new FormControl()
    const [details, setDetails] = useState([])
    const [detail, setDetail] = useState({
        label: "",
        description: "",
        quantity: 1,
        nbr_days: 1,
        price: 0
    })
    let keys = Object.keys(details)

    useEffect(() => {
        updateCredentials()
    }, [details])

    const updateCredentials = () => {
        update("details", details)
    }

    const handleChange = (e, fieldName) => {
        let fieldValue = e.target.value
        switch(fieldName) {
            case "label":
                if(!formControl.checkMaxLength(fieldValue, 255)) {
                    setFormResponse({classname: "danger", message: "The title exceed 255 characters length"})
                    return
                }
                break

            case "description":
                if(!formControl.checkMaxLength(fieldValue, 1000)) {
                    setFormResponse({classname: "danger", message: "The description exceed 1000 characters length"})
                    return
                }
                break

            case "quantity":
            case "price":
            case "nbr_days":
                if(!formControl.checkNumber(fieldValue)) {
                    setFormResponse({classname: "danger", message: `The field name ${fieldName}`})
                    return
                }
                fieldValue = parseFloat(fieldValue)
                break

            default:
                setFormResponse({classname: "danger", message: `The field name '${fieldName}' isn't allowed`})
                break
        }

        setDetail({
            ...detail,
            [fieldName]: fieldValue
        })
    }

    const handleNew = (e) => {
        let $max = 0
        keys.map((item) => {
            if($max < parseInt(item)) {
                $max = parseInt(item)
            }
        })
        
        if(keys.length > 0) {
            $max += 1
        }

        setDetails({
            ...details,
            [$max]: {
                ...details[$max],
                ...detail
            }
        })

        setDetail({
            label: "",
            description: "",
            quantity: 1,
            nbr_days: 1,
            price: 0
        })
    }

    return (
        <>
            <div className={"form-field"}>
                <label htmlFor={"title"}>Title</label>
                <input type={"text"} maxLength={"255"} value={detail.label} onChange={(e) => handleChange(e, "label")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"description"}>Description</label>
                <textarea id={"description"} onChange={(e) => handleChange(e, "description")}>{detail.description}</textarea>
            </div>

            <div className={"form-field"}>
                <label htmlFor={"quantity"}>Quantity</label>
                <input id={"quantity"} type={"number"} min={1} value={detail.quantity} onChange={(e) => handleChange(e, "quantity")} />
            </div>

            <div className={"form-field"}>
                <label htmlFor={"daystime"}>Number of days</label>
                <input id={"daystime"} type={"number"} min={1} value={detail.nbr_days} onChange={(e) => handleChange(e, "nbr_days")} />
            </div>
            
            <div className={"form-field"}>
                <label htmlFor={"budget"}>Budget</label>
                <input id={"budget"} type={"number"} min={0} value={detail.price} onChange={(e) => handleChange(e, "price")} />
            </div>
            
            <div className={"form-button"}>
                <button className={"btn btn-blue"} type={"button"} onClick={(e) => handleNew(e)}>Ajouter</button>
            </div>
        </>
    )
}