import { useState, useEffect } from "react";
import Piechart from "../components/PieChart";
import Barchart from "../components/BarChart";
import MoneySpinner from "../components/Loading";
function Chart() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000); 
        return () => clearTimeout(timer);
    }, []);
    if(loading){
        return (
            <MoneySpinner />
        )
    }
    return (
        <div className="bg-gray-950 min-h-screen">
            <div className="md:pt-10 pt-20 md:ml-60 text-white p-2 md:p-5">
                <h1 className="text-2xl font-bold p-2 md:p-3">Chart View</h1>
                <div className="p-2 md:p-3 mb-4 md:mb-6">
                    <Piechart />
                </div>
                <h1 className="text-2xl text-center p-2 md:p-3 font-bold">Monthly Expense Trend</h1>
                <div className="p-2 md:p-3 overflow-x-auto mt-4 md:mt-6">
                    <Barchart />
                </div>
            </div>
        </div>
    )
}

export default Chart;