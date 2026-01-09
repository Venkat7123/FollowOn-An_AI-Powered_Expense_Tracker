import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import api from '../api';

const COLORS = [
    '#FF6384', '#FFCE56', '#36A2EB', '#4BC0C0',
    '#9966FF', '#FF9F40', '#FF6666', '#66FF66',
    '#66B2FF', '#FFB266', '#C0C0C0', '#FF99CC'
];

export default function Piechart() {
    const [data, setData] = useState([]);
    const [month, setMonth] = useState([]);
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        generateLast12Months();
    }, []);

    useEffect(() => {
        if(selected){
            fetchData(selected.month, selected.year);
        }
    }, [selected]);

    function generateLast12Months() {
        const result = [];
        const today = new Date();
        for(let i = 0; i < 12; i++){
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            result.push({
                month: date.getMonth(),
                year: date.getFullYear(),
                label: `${date.toLocaleString('default', {month: 'long'})} ${date.getFullYear()}`
            });
        }
        setMonth(result);
        setSelected(result[0]);
    }


    async function fetchData(monthIndex, year) {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await api.post('/api/expense/getExpense', { userId });
            const allExpenses = response.data;

            const monthExpenses = allExpenses.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === monthIndex && expDate.getFullYear() === year;
            });

            const grouped = monthExpenses.reduce((acc, curr) => {
                const category = curr.type || "Uncategorized";
                acc[category] = (acc[category] || 0) + curr.amount;
                return acc;
            }, {});

            const chartData = Object.entries(grouped).map(([name, value]) => ({
                name, value
            }));
            setData(chartData);
        } catch (error) {
            console.error('Error fetching pie chart data:', error);
        }
    }


    return (
        <div className="flex flex-col gap-4 min-h-screen">
            <h1 className="text-2xl text-center p-5 font-bold">Category-wise Expense Breakdown</h1>

            {/* 🔽 Month Selector */}
            <div className="flex justify-end items-center gap-2 mr-5">
                <label className="font-medium text-lg">Select Month:</label>
                <select
                    value={month.indexOf(selected)}
                    onChange={(e) => setSelected(month[Number(e.target.value)])}
                    className="rounded-lg p-2 outline-none bg-gray-900 text-gray-800 text-white"
                >
                    {month.map((m, index) => (
                        <option key={index} value={index}>{m.label}</option>
                    ))}
                </select>
            </div>

            {/* 🥧 Pie Chart */}
            <h2 className="text-xl text-center font-semibold mt-2">{selected?.label} Expenses</h2>
            {data.length > 0 ? (
                <div className="flex justify-center items-center">
                    <PieChart width={550} height={400}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percent }) =>
                                `${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "none",
                                borderRadius: "5px",
                                color: "white",
                                boxShadow: "0px 2px 8px rgba(0,0,0,0.3)",
                                padding: "5px",
                                fontSize: "14px"
                            }}
                            itemStyle={{ color: "white" }}
                            formatter={(value, name) => [`₹${value}`, name]}
                        />
                    </PieChart>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-lg font-semibold text-white">Categories</h3>
                        <ul className="space-y-2">
                            {data.map((entry, index) => (
                                <li key={index} className="flex items-center gap-2 text-white">
                                    <span
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></span>
                                    <span>{entry.name} - ₹{entry.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-4">No data found for {selected?.label}.</p>
            )
            }
        </div >
    );
}