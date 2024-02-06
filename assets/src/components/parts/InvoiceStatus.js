import React from "react";

export default function InvoiceStatus({currentStatus = ""}) {

    const status = [
        {
            value: "send",
            text: "Envoyer"
        },
        {
            value: "ongoing",
            text: "En cours"
        },
        {
            value: "paiement_ongoing",
            text: "En cours de paiement"
        },
        {
            value: "paid",
            text: "Payer"
        }
    ]

    return (
        <div className={"sending-status"}>
            {status.map((item, index) => (
                <div key={index} className={`item ${currentStatus.length > 0 ? (item.text == currentStatus ? "-ongoing" : "-active") : null}`}>
                    <span className={"txt-bold"}>{item.text}</span>
                </div>
            ))}
        </div>
    )
}