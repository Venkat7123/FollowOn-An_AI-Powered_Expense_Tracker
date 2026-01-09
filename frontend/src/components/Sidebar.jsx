import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SummaryNav from "./SummaryNav";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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

  // Mobile Top Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Navbar */}
        <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white shadow-lg z-40">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="font-bold text-xl">
              <Link to="/">
                <span className="text-gray-400">Follow</span>
                <span className="text-green-500">On</span>
              </Link>
            </h1>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-green-500 text-2xl"
            >
              {isExpanded ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-bars"></i>}
            </button>
          </div>

          {/* Expandable Menu */}
          {isExpanded && (
            <div className="px-4 pb-4 space-y-3 border-t border-gray-700">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-3 py-2 ${isActive('/dashboard') ? 'text-green-400 font-semibold' : 'hover:text-green-400'}`}
                onClick={() => setIsExpanded(false)}
              >
                <span className="text-xl text-green-500"><i className="fa-solid fa-house"></i></span>
                <span>Dashboard</span>
              </Link>

              <Link
                to="/add"
                className={`flex items-center space-x-3 py-2 ${isActive('/add') ? 'text-green-400 font-semibold' : 'hover:text-green-400'}`}
                onClick={() => setIsExpanded(false)}
              >
                <span className="text-xl text-green-500"><i className="fa-solid fa-plus"></i></span>
                <span>Add Expenses</span>
              </Link>

              <Link
                to="/expense"
                className={`flex items-center space-x-3 py-2 ${isActive('/expense') ? 'text-green-400 font-semibold' : 'hover:text-green-400'}`}
                onClick={() => setIsExpanded(false)}
              >
                <span className="text-xl text-green-500"><i className="fa-solid fa-coins"></i></span>
                <span>View Expenses</span>
              </Link>

              <Link
                to="/history"
                className={`flex items-center space-x-3 py-2 ${isActive('/history') ? 'text-green-400 font-semibold' : 'hover:text-green-400'}`}
                onClick={() => setIsExpanded(false)}
              >
                <span className="text-xl text-green-500"><i className="fa-solid fa-landmark"></i></span>
                <span>History</span>
              </Link>

              <Link
                to="/view"
                className={`flex items-center space-x-3 py-2 ${isActive('/view') ? 'text-green-400 font-semibold' : 'hover:text-green-400'}`}
                onClick={() => setIsExpanded(false)}
              >
                <span className="text-xl text-green-500"><i className="fa-solid fa-chart-line"></i></span>
                <span>Chart</span>
              </Link>

              <div className="py-2">
                <SummaryNav />
              </div>

              {user && (
                <div className="border-t border-gray-700 pt-3">
                  <p className="mb-2 text-sm">
                    <i className="fa-solid fa-user text-blue-500"></i> Hello, {user.user_metadata?.full_name || user.email}!
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 py-2 px-4 rounded-lg hover:bg-red-600 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Overlay when menu is open */}
        {isExpanded && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsExpanded(false)}
          ></div>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="fixed left-0 top-0 h-full w-65 text-white bg-gray-900 flex flex-col items-start p-7 pl-10 space-y-6 shadow-lg z-40">
      <h1 className="font-bold text-2xl">
        <Link to="/">
          <span className="text-gray-600">Follow</span>
          <span className="text-green-500">On</span>
        </Link>
      </h1>

      <Link
        to="/dashboard"
        className={`flex items-center space-x-3 w-full ${isActive('/dashboard') ? 'text-green-400 font-semibold' : 'hover:text-green-400'}`}
        title="Dashboard"
      >
        <span className="text-xl text-green-500"><i className="fa-solid fa-house"></i></span>
        <span>Dashboard</span>
      </Link>

      <Link
        to="/add"
        className={`flex items-center space-x-3 w-full ${isActive('/add') ? 'text-green-400 font-semibold' : 'hover:text-green-400'}`}
        title="Add Expenses"
      >
        <span className="text-xl text-green-500"><i className="fa-solid fa-plus"></i></span>
        <span>Add Expenses</span>
      </Link>

      <Link
        to="/expense"
        className={`flex items-center space-x-3 w-full ${isActive('/expense') ? 'text-green-400 font-semibold' : 'hover:text-green-400'}`}
        title="View Expenses"
      >
        <span className="text-xl text-green-500"><i className="fa-solid fa-coins"></i></span>
        <span>View Expenses</span>
      </Link>

      <Link
        to="/history"
        className={`flex items-center space-x-3 w-full ${isActive('/history') ? 'text-green-400 font-semibold' : 'hover:text-green-400'}`}
        title="History"
      >
        <span className="text-xl text-green-500"><i className="fa-solid fa-landmark"></i></span>
        <span>History</span>
      </Link>

      <Link
        to="/view"
        className={`flex items-center space-x-3 w-full ${isActive('/view') ? 'text-green-400 font-semibold' : 'hover:text-green-400'}`}
        title="Chart"
      >
        <span className="text-xl text-green-500"><i className="fa-solid fa-chart-line"></i></span>
        <span>Chart</span>
      </Link>

      <div>
        <SummaryNav />
      </div>

      <div className="mt-auto w-full">
        {user && (
          <>
            <p className="mb-2">
              <i className="fa-solid fa-user text-blue-500"></i> Hello, {user.user_metadata?.full_name || user.email}!
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 py-2 px-2 rounded-lg hover:bg-red-600 cursor-pointer flex items-center justify-center space-x-2"
              title="Logout"
            >
              <span className="text-xl"><i className="fa-solid fa-arrow-right-from-bracket"></i></span>
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
