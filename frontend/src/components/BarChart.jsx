import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import api from '../api';

export default function Barchart() {
    const [data, setData] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        fetchData();

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    async function fetchData() {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await api.post('/api/expense/getExpense', { userId });
            const allExpenses = response.data;

            // Calculate last 12 months
            const today = new Date();
            const monthTotals = Array(12).fill(0);
            const monthLabels = [];

            // Generate last 12 months
            for (let i = 11; i >= 0; i--) {
                const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthIndex = date.getMonth();
                const year = date.getFullYear();

                const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
                monthLabels.push(`${monthName} ${year.toString().slice(-2)}`);
            }

            // Filter expenses for last 12 months
            const last12MonthsDate = new Date(today);
            last12MonthsDate.setMonth(today.getMonth() - 12);

            allExpenses.forEach(exp => {
                const expDate = new Date(exp.date);
                if (expDate >= last12MonthsDate && expDate <= today) {
                    const monthsFromNow = (today.getFullYear() - expDate.getFullYear()) * 12 + (today.getMonth() - expDate.getMonth());
                    if (monthsFromNow >= 0 && monthsFromNow < 12) {
                        const index = 11 - monthsFromNow;
                        monthTotals[index] += exp.amount;
                    }
                }
            });

            const chartData = monthLabels.map((month, index) => {
                const [shortmonth, year] = month.split(" ");
                return {
                    month,
                    fullMonth: `${monthMap[shortmonth]} ${year}`,
                    Expense: monthTotals[index]
                }
            });
            setData(chartData);
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    }
    const colors = [
        '#FF6384', '#FFCE56', '#36A2EB', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6666', '#66FF66',
        '#66B2FF', '#FFB266', '#C0C0C0', '#FF99CC'
    ];
    const monthMap = {
        Jan: "January",
        Feb: "February",
        Mar: "March",
        Apr: "April",
        May: "May",
        Jun: "June",
        Jul: "July",
        Aug: "August",
        Sep: "September",
        Oct: "October",
        Nov: "November",
        Dec: "December",
    };

    return (
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 500}>
            <BarChart 
                data={data} 
                margin={isMobile 
                    ? { top: 15, right: 10, left: -10, bottom: 50 } 
                    : { top: 20, right: 30, left: 20, bottom: 5 }
                }
            >
                <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? "end" : "middle"}
                    interval={0}
                />
                <YAxis 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    width={isMobile ? 40 : 60}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "5px",
                        color: "white",
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.3)",
                        padding: "5px",
                        fontSize: isMobile ? "12px" : "14px"
                    }}
                    itemStyle={{ color: "white" }}
                    labelFormatter={(label, payload) =>
                        payload?.[0]?.payload?.fullMonth
                    }
                    formatter={(value) => `₹${value}`}
                />
                <Bar dataKey="Expense">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                    {!isMobile && (
                        <LabelList dataKey="Expense" position="top" formatter={(val) => `₹ ${val}`} />
                    )}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}