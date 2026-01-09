import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const categoryIcons = {
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

function AddExpense() {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setMessage("User not authenticated");
                setLoading(false);
                return;
            }
            
            const expenseData = {
                userId,
                title,
                type: selectedCategory,
                amount: parseFloat(amount),
                date: new Date().toISOString().split('T')[0]
            }

            console.log("Sending expense data:", expenseData);
            const response = await api.post(`/api/expense/addExpense`, expenseData);
            console.log("Add expense response:", response.data);
            
            setTitle("");
            setAmount("");
            setSelectedCategory("");
            setMessage("Expense added successfully!");
            setTimeout(() => {navigate("/expense"); window.location.reload();}, 0);
            
        } catch (error) {
            console.error("Error adding expense:", error);
            console.error("Error response data:", error.response?.data);
            setMessage(error.response?.data?.error || "Error adding expense. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-gray-950">
            <div className="md:pt-10 pt-20 md:ml-60 text-white p-2 md:p-6">
                <h1 className="text-2xl font-bold p-2 md:p-6">Add Monthly Expenses</h1>
                <form onSubmit={handleSubmit} className="border rounded-lg p-3 md:p-5 m-2 md:m-5 space-y-7 flex flex-col">
                    <div>
                        <label className="text-lg font-bold">
                            Enter Title
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="bg-gray-800 mt-3 text-white w-full rounded-lg 
                            p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none 
                            transition ease-in-out duration-150 hover:bg-gray-700"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-lg font-bold">
                            Enter Amount
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            className="bg-gray-800 mt-3 text-white w-full rounded-lg 
                            p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none 
                            transition ease-in-out duration-150 hover:bg-gray-700"
                            placeholder="Enter Amount"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-lg font-bold">
                            Select Category
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            required
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-gray-800 mt-3 text-white w-full rounded-lg
                            p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none 
                            transition ease-in-out duration-150 hover:bg-gray-700"
                        >
                            <option value="" disabled>-- Select a Category --</option>
                            {Object.entries(categoryIcons).map(([category, icon]) => (
                                <option key={category} value={category}>
                                    {icon} {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-500 mt-3 text-white w-full 
                            rounded-lg p-2 focus:ring-2 focus:ring-blue-500 
                            focus:outline-none transition hover:bg-green-400 
                            cursor-pointer flex justify-center items-center"
                        >
                            {loading ? (
                                <svg
                                    className="w-6 h-6 text-white animate-spin mr-2"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="2" />
                                    <text
                                        x="12"
                                        y="16"
                                        textAnchor="middle"
                                        fontSize="12"
                                        fill="currentColor"
                                        fontWeight="bold"
                                    >
                                        ₹
                                    </text>
                                </svg>
                            ) : null}
                            {loading ? "Adding..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddExpense;