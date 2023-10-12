import React, { useEffect, useState } from "react";
import UserHeader from "../../parts/UserHeader";
import AccountingChart from "../../parts/AccountingChart";
import PrivateRessources from "../../utils/PrivateResources";

// Comptabilité
export default function Accounting() {

    const { loading, items: benefits, load } = PrivateRessources(`${window.location.origin}/api/graphic-accounting`)
    useEffect(() => {
        load()
    }, [])

    const callYearBenefit = (benefits) => {
        let benefit = 0

        Object.values(benefits).map(item => {
            benefit += item
        })

        return benefit
    }

    const generateAllMonth = () => {
        let date = new Date()
        let months = []

        for(let $i = 0; $i < 12; $i++) {
            date.setMonth($i)
            months.push((date.getMonth() + 1))
        }

        return Object.assign({}, months)
    }

    const handleYearBenefitClick = (e, year) => {
        console.log("Hi handleYearBenefitClick ! onclick year : " + year)
    }

    return (
        <UserHeader>
            <div className={"page-section"}>
                <h2>Accounting</h2>

                <div className={"d-flex-col"}>
                    <div className={"d-flex-row"}>
                        <button className={"btn btn-grey"} onClick={(e) => handleYearBenefitClick(e, 2022)}>2022</button>
                        <button className={"btn btn-grey"} onClick={(e) => handleYearBenefitClick(e, 2023)}>2023</button>
                    </div>
                    <div className={"amount-table"}>
                        {!loading && (
                            <table className={"table"}>
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th>Amount (€)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(generateAllMonth()).length > 0 && typeof generateAllMonth() === "object" ? (
                                        Object.values(generateAllMonth()).map((item, index) => {
                                            let date = new Date()
                                            date.setMonth(index - 1)

                                            return (
                                                <tr key={index} className={"txt-center"}>
                                                    <td className={"-m-hidden"}>{date.toLocaleDateString("en-EN", {month: 'long'})}</td>
                                                    <td className={`-${date.toLocaleDateString("en-EN", {month: 'long'}).toLowerCase()}`}>{benefits[index + 1] ?? 0}</td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={2}>There is no registered invoice</td>
                                        </tr>
                                    )}
                                    
                                    <tr className={"txt-center txt-bold"}>
                                        <td className={"-m-hidden"}>Total</td>
                                        <td className={"-total"}>{callYearBenefit(benefits)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className={"amount-graph"}>
                        <AccountingChart benefits={benefits} months={Object.values(generateAllMonth())} />
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}