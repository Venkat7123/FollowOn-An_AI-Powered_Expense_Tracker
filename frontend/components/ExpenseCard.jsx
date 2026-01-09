import { useEffect, useState } from "react";
import api from "../api";
import { categoryIcons } from "./ExpenseSummary";

export function ExpenseCard({ arr, onUpdate }) {
    // Group by date
    const [open, setOpen] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(false);

    // Close edit form when array changes
    useEffect(() => {
        setEditingId(null);
        setEditData({});
        setOpen(null);
    }, [arr]);

    const grouped = arr.reduce((acc, item) => {
        acc[item.date] = acc[item.date] ? [...acc[item.date], item] : [item];
        return acc;
    }, {})

    const handleDelete = async (item) => {
        if (window.confirm(`Delete "${item.name}" (₹${item.amount})?`)) {
            setLoading(true);
            try {
                await api.delete(`/api/expense/deleteExpense/${item.id}`);
                setOpen(null);
                onUpdate && onUpdate();
            } catch (error) {
                console.error("Error deleting expense:", error);
                alert("Failed to delete expense");
            } finally {
                setLoading(false);
                window.location.reload();
            }
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setEditData({ name: item.name, amount: item.amount, type: item.type });
        setOpen(null);
    };

    const handleSaveEdit = async (item) => {
        if (!editData.name || !editData.amount) {
            alert("Please fill all fields");
            return;
        }
        setLoading(true);
        try {
            await api.put(`/api/expense/updateExpense/${item.id}`, {
                name: editData.name,
                amount: parseFloat(editData.amount),
                type: editData.type
            });
            setEditingId(null);
            onUpdate && onUpdate();
        } catch (error) {
            console.error("Error updating expense:", error);
            alert("Failed to update expense");
        } finally {
            setLoading(false);
            window.location.reload();
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };
    return (
        <div>
            {arr.length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([date, expenses]) => (
                        <div key={date} className="bg-gray-800 rounded-lg p-5 shadow-md">
                            <div className="font-semibold text-white text-lg mb-3 border-b border-gray-600 pb-1">
                                {date}
                            </div>

                            <div className="space-y-3">
                                {expenses.map((item, index) => (
                                    <div key={index}>
                                        {editingId === item.id ? (
                                            <div className="bg-gray-700 p-4 rounded-lg space-y-3 border border-green-500">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                    <div>
                                                        <label className="text-sm text-gray-300 block mb-1">Name</label>
                                                        <input
                                                            type="text"
                                                            value={editData.name}
                                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                            className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-green-500 outline-none"
                                                            placeholder="Expense name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-300 block mb-1">Amount</label>
                                                        <input
                                                            type="number"
                                                            value={editData.amount}
                                                            onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                                            className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-green-500 outline-none"
                                                            placeholder="Amount"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm text-gray-300 block mb-1">Category</label>
                                                        <select
                                                            value={editData.type}
                                                            onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                                            className="cursor-pointer w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-green-500 outline-none"
                                                        >
                                                            {Object.entries(categoryIcons).map(([category, icon]) => (
                                                                <option key={category} value={category}>
                                                                    {icon} {category}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex gap-2 items-end">
                                                        <button
                                                            onClick={() => handleSaveEdit(item)}
                                                            disabled={loading}
                                                            className="flex-1 bg-green-500 text-white px-3 py-2 rounded cursor-pointer hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            disabled={loading}
                                                            className="flex-1 bg-gray-600 text-white px-3 py-2 rounded cursor-pointer hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-900 p-3 md:p-4 rounded-lg hover:bg-gray-650 transition gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium truncate">{item.name}</p>
                                                    <p className="text-gray-400 text-sm">{item.type}</p>
                                                </div>
                                                <div className="flex items-center justify-between md:justify-end gap-4">
                                                    <div className="text-right">
                                                        <p className="text-green-400 font-bold text-lg">₹{item.amount.toFixed(2)}</p>
                                                    </div>
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            className="cursor-pointer text-gray-300 hover:text-white text-xl p-2 rounded hover:bg-gray-600 transition"
                                                            onClick={() => {
                                                                setOpen(open === `${date}-${index}` ? null : `${date}-${index}`);
                                                            }}>
                                                            ⋮
                                                        </button>
                                                        {open === `${date}-${index}` && (
                                                            <div className="absolute right-0 mt-1 bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden z-20 min-w-max">
                                                                <button
                                                                    className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-500 transition"
                                                                    onClick={() => handleEdit(item)}
                                                                    disabled={loading}
                                                                >
                                                                    <i class="fa-solid fa-pencil"></i> Edit
                                                                </button>
                                                                <button
                                                                    className="cursor-pointer block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-500 transition"
                                                                    onClick={() => handleDelete(item)}
                                                                    disabled={loading}
                                                                >
                                                                    <i class="fa-regular fa-trash-can"></i> Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>) : (
                <p className="text-gray-500 text-center mt-4">No data found.</p>
            )}
        </div>
    );
}
