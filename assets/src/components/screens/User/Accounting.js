import React from "react";
import AccountingChart from "../../parts/AccountingChart";
import UserHeader from "../../parts/UserHeader";

// Comptabilité
export default function Accounting() {

    return (
        <UserHeader>
            <div className={"page-section"}>
                <h2>Accounting</h2>

                <div className={"d-flex-col"}>
                    <div className={"amount-table"}>
                        <table className={"table"}>
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Amount (€)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={"txt-center"}>
                                    <td>January</td>
                                    <td>0</td>
                                </tr>
                                <tr className={"txt-center"}>
                                    <td>February</td>
                                    <td>0</td>
                                </tr>
                                <tr className={"txt-center"}>
                                    <td>March</td>
                                    <td>0</td>
                                </tr>
                                <tr className={"txt-center"}>
                                    <td>April</td>
                                    <td>0</td>
                                </tr>
                                <tr className={"txt-center"}>
                                    <td>May</td>
                                    <td>0</td>
                                </tr>
                                <tr className={"txt-center"}>
                                    <td>Jun</td>
                                    <td>0</td>
                                </tr>
                                <tr className={"txt-center txt-bold"}>
                                    <td>Total :</td>
                                    <td>0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={"amount-graph"}>
                        <AccountingChart />
                    </div>
                </div>
            </div>
        </UserHeader>
    )
}