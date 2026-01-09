export default function MoneySpinner() {
  return (
    <div className="flex justify-center items-center h-screen pl-0 md:pl-60 bg-gray-950">
      <div className="relative w-24 h-24">
        {/* Spinning coin ring */}
        <svg
          className="w-24 h-24"
          style={{ animation: "spin 5s linear infinite" }}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="gold"
            strokeWidth="6"
            strokeOpacity="0.4"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="gold"
            strokeWidth="6"
            strokeDasharray="10 10"
            strokeLinecap="round"
          />
        </svg>

        {/* Static dollar sign in center */}
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-green-500 text-4xl font-bold">₹</span>
        </div>
      </div>
    </div>
  );
}
