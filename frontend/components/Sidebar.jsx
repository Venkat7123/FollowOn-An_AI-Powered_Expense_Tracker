import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SummaryNav from "./SummaryNav";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsExpanded(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    if (userEmail || userName) {
      setUser({
        email: userEmail,
        user_metadata: { full_name: userName }
      });
    }
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Sidebar Overlay (Mobile when expanded) */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsExpanded(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900 text-white flex flex-col items-start p-6 space-y-6 shadow-lg z-40 transition-all duration-300 ${isMobile
            ? isExpanded
              ? "w-60"
              : "w-20"
            : "w-60"
          }`}
      >
        {/* Menu Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden text-green-500 text-2xl rounded-lg "
        >
          {isExpanded ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-bars" ></i>}
        </button>

        <h1 className={`font-bold text-2xl ${isMobile && !isExpanded ? "hidden" : ""}`}>
          <Link to="/">
            <span className="text-gray-600">Follow</span>
            <span className="text-green-500">On</span></Link>
        </h1>

        <Link
          to="/dashboard"
          className="flex items-center space-x-3 hover:text-green-400 w-full"
          title="Dashboard"
        >
          <span className="text-xl text-green-500"><i className ="fa-solid fa-house"></i></span>
          <span className={isMobile && !isExpanded ? "hidden" : ""}>Dashboard</span>
        </Link>

        <Link
          to="/add"
          className="flex items-center space-x-3 hover:text-green-400 w-full"
          title="Add Expenses"
        >
          <span className="text-xl text-green-500"><i className="fa-solid fa-plus
          "></i></span>
          <span className={isMobile && !isExpanded ? "hidden" : ""}>Add Expenses</span>
        </Link>

        <Link
          to="/expense"
          className="flex items-center space-x-3 hover:text-green-400 w-full"
          title="View Expenses"
        >
          <span className="text-xl text-green-500"><i className="fa-solid fa-coins"></i></span>
          <span className={isMobile && !isExpanded ? "hidden" : ""}>View Expenses</span>
        </Link>

        <Link
          to="/history"
          className="flex items-center space-x-3 hover:text-green-400 w-full"
          title="History"
        >
          <span className="text-xl text-green-500"><i className="fa-solid fa-landmark"></i></span>
          <span className={isMobile && !isExpanded ? "hidden" : ""}>History</span>
        </Link>

        <Link
          to="/view"
          className="flex items-center space-x-3 hover:text-green-400 w-full"
          title="Chart"
        >
          <span className="text-xl text-green-500"><i className="fa-solid fa-chart-line"></i></span>
          <span className={isMobile && !isExpanded ? "hidden" : ""}>Chart</span>
        </Link>

        <div className={isMobile && !isExpanded ? "hidden" : ""}>
          <SummaryNav />
        </div>

        <div className={`mt-auto w-full`}>
          {user && (
            <>
              <p className={`mb-2 ${isMobile && !isExpanded ? "hidden" : ""}`}><i className="fa-solid fa-user text-blue-500"></i> Hello, {user.user_metadata?.full_name || user.email}!</p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 py-2 px-2 rounded-lg hover:bg-red-600 cursor-pointer flex items-center justify-center space-x-2"
                title="Logout"
              >
                <span className="text-xl"><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
                <span className={isMobile && !isExpanded ? "hidden" : ""}>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
