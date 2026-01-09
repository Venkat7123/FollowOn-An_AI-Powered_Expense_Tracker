function SummaryCard({ type, total, icon }) {
    return (
        <div className="flex-shrink-0 w-[300px] h-28 bg-gray-800 rounded-lg flex flex-col  shadow-md p-5 pl-7 hover:bg-gray-700 transition-colors">
            <div className="text-md font-semibold text-white mt-1">{icon} {type}</div>
            <div className="text-green-400 text-white font-bold text-lg mt-2">
                ₹{total ? total.toFixed(2) : "0.00"}
            </div>
        </div>
    );
}

export default SummaryCard;
