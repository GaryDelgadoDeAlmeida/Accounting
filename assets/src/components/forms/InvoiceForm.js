import React, { useState } from "react";
import Notification from "../parts/Notification";
import axios from "axios";

export default function InvoiceForm() {
    const [formResponse, setFormResponse] = useState({})

    const handleChange = (e, fieldName) => {
        // 
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // axios.post(`${window.location.origin}/api/invoice/${invoiceID}`, {})
    }

    return (
        <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
            {Object.keys(formResponse).length > 0 && (
                <Notification {...formResponse} />
            )}

            <table className={"table"}></table>
        </form>
    )
}