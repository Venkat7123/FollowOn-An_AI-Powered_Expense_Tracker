import { useEffect, useState } from "react";
import api from "../api";

function SummaryNav() {
  const [summary, setSummary] = useState({
    totalCount: 0,
    monthlyAmount: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await api.get(`/api/summary/${userId}`);
      const data = response.data;

      if (!data.expenses) return;

      const currentMonth = new Date().getMonth();
      const totalCount = data.expenses.filter(e => new Date(e.date).getMonth() === currentMonth).length;

      const monthlyAmount = data.expenses
        .filter(e => new Date(e.date).getMonth() === currentMonth)
        .reduce((sum, e) => sum + Number(e.amount), 0);

      setSummary({ totalCount, monthlyAmount });
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div className="bg-gray-700 p-5 text-white rounded-2xl shadow-lg w-full max-w-md mx-auto mt-6">
      <h2 className="font-semibold mb-4">Expense Summary</h2>
      <div className="space-y-2 text-sm">
        <p className="text-gray-300">📅 This Month: <br /> ₹{summary.monthlyAmount.toFixed(2)}</p>
        <p className="text-gray-300">🧾 Total Transactions: {summary.totalCount}</p>
      </div>
    </div>
  );
}

export default SummaryNav;
