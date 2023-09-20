import React from "react";
import AccountingChart from "../../parts/AccountingChart";
import UserHeader from "../../parts/UserHeader";

// Comptabilité
export default function Accounting() {

    const year_benefit = [
        {
            month: "January",
            amount: 8000
        },
        {
            month: "February",
            amount: 0
        },
        {
            month: "March",
            amount: 0
        },
        {
            month: "April",
            amount: 0
        },
        {
            month: "May",
            amount: 0
        },
        {
            month: "Jun",
            amount: 1500
        },
        {
            month: "July",
            amount: 0
        },
        {
            month: "August",
            amount: 0
        },
        {
            month: "September",
            amount: 0
        },
        {
            month: "October",
            amount: 0
        },
        {
            month: "November",
            amount: 0
        },
        {
            month: "December",
            amount: 0
        }
    ]

    const callYearBenefit = (year_benefits) => {
        let benefit = 0

        year_benefits.map(item => {
            benefit += item.amount
        })

        return benefit
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
                        <table className={"table"}>
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Amount (€)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {year_benefit.map((item, index) => (
                                    <tr key={index} className={"txt-center"}>
                                        <td className={"-m-hidden"}>{item.month}</td>
                                        <td className={`-${item.month.toLocaleLowerCase()}`}>{item.amount}</td>
                                    </tr>
                                ))}
                                
                                <tr className={"txt-center txt-bold"}>
                                    <td className={"-m-hidden"}>Total</td>
                                    <td className={"-total"}>{callYearBenefit(year_benefit)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={"amount-graph"}>
                        <AccountingChart benefits={year_benefit}/>
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}