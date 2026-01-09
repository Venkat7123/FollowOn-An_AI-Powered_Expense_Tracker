import { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import MoneySpinner from "./Loading";
import api from "../api";

export const categoryIcons = {
    "Housing / Living": "🏠",
    "Food & Groceries": "🍎",
    "Transportation": "🚗",
    "Health & Fitness": "💊",
    "Personal Care": "👗",
    "Entertainment & Leisure": "🎬",
    "Education & Learning": "📚",
    "Savings & Investments": "💰",
    "Debt Payments": "💳",
    "Gifts & Donations": "🎁",
    "Pets & Animals": "🐶",
    "Miscellaneous": "❓",
};

export default function ExpenseSummary() {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await api.get(`/api/summary/${userId}`);
            const data = response.data;
            
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            
            const monthExpenses = data.expenses.filter(e => {
                const expenseDate = new Date(e.date);
                return expenseDate.getMonth() + 1 === currentMonth && expenseDate.getFullYear() === currentYear;
            });

            const grouped = monthExpenses.reduce((acc, e) => {
                if (!acc[e.type]) acc[e.type] = 0;
                acc[e.type] += Number(e.amount);
                return acc;
            }, {});
            const summaryArray = Object.keys(categoryIcons).map((type) => ({
                type,
                total: grouped[type] || 0,
                icon: categoryIcons[type]
            }));
            setSummary(summaryArray);
        }
        catch (err) {
            console.error("Error fetching Summary: " + err.message);
            const fallbackArray = Object.keys(categoryIcons).map((type) => ({
                type,
                total: 0,
                icon: categoryIcons[type]
            }));
            setSummary(fallbackArray);
        }
        finally {
            setLoading(false)
        }
    };
    if (loading) {
        return (
            <MoneySpinner />
        );
        
    }

    return (
        <div className="bg-gray-950">
            <h1 className="text-xl font-bold text-white">Monthly Expense Summary</h1>
            <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(300px,3fr))] gap-3 ">
                {summary.map((item, idx) => (
                    <SummaryCard
                        key={idx}
                        type={item.type}
                        total={item.total}
                        icon={item.icon}
                    />
                ))}
            </div>
        </div>
    )
}
