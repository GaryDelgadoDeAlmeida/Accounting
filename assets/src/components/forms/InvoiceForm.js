import React, { useState } from "react";
import Notification from "../parts/Notification";
import PrivatePostRessource from "../utils/PrivatePostRessource";

export default function InvoiceForm() {
    const [formResponse, setFormResponse] = useState([])

    const handleChange = (e, fieldName) => {
        // 
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // await PrivatePostRessource("invoice", {})
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {formResponse.length > 0 && (<Notification {...formResponse} />)}

            <table className={"table"}></table>
        </form>
    )
}