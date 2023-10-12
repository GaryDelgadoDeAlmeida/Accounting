import React from "react";
import Chart from 'chart.js/auto';
import { Bar } from "react-chartjs-2";

export default function AccountingChart({benefits = {}, months = []}) {
    const config = {
        data: {
            labels: months.map((item, index) => {
                let month = new Date()
                month.setMonth(index)
                return month.toLocaleDateString("en-EN", {month: 'long'})
            }),
            datasets: [
                {
                    label: "Current Year Benefit",
                    data: months.map(item => benefits[item] ?? 0),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    }

    return (
        <div className={"sales-chart w-100"}>
            <Bar {...config} />
        </div>
    )
}