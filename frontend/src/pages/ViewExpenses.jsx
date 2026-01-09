import { useEffect, useState, useMemo } from "react";
import { categoryIcons } from "../components/ExpenseSummary";
import api from "../api";
import { ExpenseCard } from "../components/ExpenseCard";
import MoneySpinner from "../components/Loading";
import ExpenseChatbot from "./ExpenseChatbot";

function ViewExpense() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [sortDate, setSortDate] = useState("desc");
    const [sortAmt, setSortAmt] = useState("desc");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setErrorMsg("User not authenticated");
                setLoading(false);
                return;
            }

            const response = await api.post("/api/expense/getExpense", { userId });
            const allExpenses = response.data;
            
            // Filter for current month
            const now = new Date();
            const year = now.getFullYear();
            const monthIndex = now.getMonth();
            const startDate = new Date(year, monthIndex, 1);
            const endDate = new Date(year, monthIndex + 1, 0);

            const monthExpenses = allExpenses.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate >= startDate && expDate <= endDate;
            });

            setData(monthExpenses);
        } catch (err) {
            console.error("Error fetching expenses:", err);
            setErrorMsg("Failed to fetch expenses");
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        let temp = [...data];
        if (filter) {
            temp = temp.filter((item) => item.type === filter);
        }
        temp.sort((a, b) => {
            const dateCompare =
                sortDate === "asc"
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);

            if (dateCompare !== 0) return dateCompare;

            if (sortAmt === "asc") return a.amount - b.amount;
            if (sortAmt === "desc") return b.amount - a.amount;

            return 0;
        });
        return temp;
    }, [data, filter, sortDate, sortAmt]);

    if (loading) {
        return <MoneySpinner />;
    }

    return (
        <div className="bg-gray-950 min-h-screen">
            <div className="md:pt-10 pt-20 md:ml-60 text-white p-2 md:p-5">
                <h1 className="text-2xl font-bold">All Expenses</h1>

                <div className="flex flex-col md:flex-row gap-2 md:gap-4 m-2 md:m-4 justify-end ">
                    <select
                        value={filter}
                        className="bg-gray-900 outline-none rounded-md p-2"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {Object.entries(categoryIcons).map(([category, icon]) => (
                            <option key={category} value={category}>
                                {icon} {category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortDate}
                        className="bg-gray-900 outline-none rounded-md p-2"
                        onChange={(e) => setSortDate(e.target.value)}
                    >
                        <option value="desc">Sort By Date - Recent</option>
                        <option value="asc">Sort By Date - Old</option>
                    </select>

                    <select
                        value={sortAmt}
                        className="bg-gray-900 outline-none rounded-md p-2"
                        onChange={(e) => setSortAmt(e.target.value)}
                    >
                        <option value="desc">Sort By Amount - High</option>
                        <option value="asc">Sort By Amount - Low</option>
                    </select>
                </div>

                {errorMsg ? (
                    <div className="text-red-400 my-4">{errorMsg}</div>
                ) : filteredData.length === 0 ? (
                    <div className="text-gray-300 text-center my-8">No expenses found for the current month.</div>
                ) : (
                    <ExpenseCard arr={filteredData} 
                    onUpdate={() => {
                        setLoading(true);
                        fetchData();
                    }} />
                )}
            </div>
        </div>
    );
}

export default ViewExpense;
