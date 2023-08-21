import React from "react";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";

export default function AccountingChart() {
    const months = ['0', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'September', 'October', 'November', 'December']
    const data = {
        labels: months,
        datasets: [{
            label: "# Accounting",
            data: [0, ...months.map(() => Math.random(0, 1000) * 1000)],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(255, 99, 132, 0.5)',
        }]
    }
    
    const config = {
        type: "bar",
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    }

    return (
        <div className={"sales-chart w-100"}>
            <Line {...config} />
        </div>
    )
}