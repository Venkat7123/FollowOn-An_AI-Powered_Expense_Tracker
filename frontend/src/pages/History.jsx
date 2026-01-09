import { useEffect, useState, useMemo } from "react";
import { categoryIcons } from "../components/ExpenseSummary";
import api from "../api";
import { ExpenseCard } from "../components/ExpenseCard";
import MoneySpinner from "../components/Loading";

function History() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [sortDate, setSortDate] = useState("desc");
    const [sortAmt, setSortAmt] = useState("desc");
    const [selected, setSelected] = useState(null)
    const [months, setMonth] = useState([])

    useEffect(() => {
        generateLast12Months();
    }, []);

    useEffect(() => {
        if (selected) {
            fetchData(selected.month, selected.year);
        }
    }, [selected]);

    function generateLast12Months() {
        const result = [];
        const today = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            result.push({
                month: date.getMonth(),
                year: date.getFullYear(),
                label: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
            });
        }
        setMonth(result);
        setSelected(result[1]);
    }
    const fetchData = async (monthIdx, year) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoading(false);
                return;
            }

            const response = await api.post("/api/expense/getExpense", { userId });
            const allExpenses = response.data;

            const currentYear = new Date().getFullYear();
            const monthExpenses = allExpenses.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === monthIdx && expDate.getFullYear() === year;
            });

            setData(monthExpenses);
            console.log("Data fetched and updated:", monthExpenses);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false);
        }
    }

    // Refetch data when selected month changes
    useEffect(() => {
        if (selected) {
            setLoading(true);
            fetchData(selected.month, selected.year);
        }
    }, [selected]);

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
    }, [data, filter, sortDate, sortAmt])

    if (loading) {
        return <MoneySpinner />
    }
    return (
        <div className="bg-gray-950 min-h-screen">
            <div className="md:pt-10 pt-20 md:ml-60 text-white p-2 md:p-5">
                <h1 className="text-2xl font-bold">All Expenses</h1>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-2 m-2 md:m-5 flex-wrap">
                    <div className="w-full md:w-auto">
                        <label className="font-medium text-lg block md:inline-block md:mr-2">Select Month:</label>
                        <select
                            value={months.indexOf(selected)}
                            onChange={(e) => setSelected(months[Number(e.target.value)])}
                            className="rounded-lg p-2 outline-none bg-gray-900 text-white w-full md:w-auto"
                        >
                            {months.map((m, index) => (
                                <option key={m} value={index}>{m.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-auto">
                        <select
                            value={filter}
                            className="w-full md:w-auto p-2 bg-gray-900 outline-none rounded-md"
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {Object.entries(categoryIcons).map(([category, icon]) => (
                                <option key={category} value={category}>
                                    {icon} {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-auto">
                        <select
                            value={sortDate}
                            className="w-full md:w-auto p-2 bg-gray-900 outline-none rounded-md"
                            onChange={(e) => setSortDate(e.target.value)}
                        >
                            <option value="desc">Sort By Date - Recent</option>
                            <option value="asc">Sort By Date - Old</option>
                        </select>
                    </div>
                    <div className="w-full md:w-auto">
                        <select
                            value={sortAmt}
                            className="w-full md:w-auto p-2 bg-gray-900 outline-none rounded-md"
                            onChange={(e) => setSortAmt(e.target.value)}
                        >
                            <option value="desc">Sort By Amount - High</option>
                            <option value="asc">Sort By Amount - Low</option>
                        </select>
                    </div>
                </div>
                <ExpenseCard
                    arr={filteredData}
                    onUpdate={() => {
                        console.log("onUpdate called, refetching data...");
                        setLoading(true);
                        fetchData(selected.month, selected.year);
                    }}
                />
            </div>
        </div>
    )
}
export default History;