import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Check dashboard routes
    const dashboardPaths = ["/dashboard", "/add", "/expense" ,"/history", "/view"];
    const isDashboard = dashboardPaths.some(path => location.pathname.startsWith(path));

    // Check user from localStorage
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        
        if (userId && userEmail) {
            setUser({
                id: userId,
                email: userEmail,
                user_metadata: { full_name: userName }
            });
        }
    }, []);

    // Logout handler
    const handleLogout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        setUser(null);
        window.dispatchEvent(new Event('auth-change'));
        navigate("/", { replace: true });
    };
    if (isDashboard) {
        return <Sidebar />
    }
    return (
        <nav className="bg-black text-white p-6">
            <div className="flex justify-between items-center">
                <Link to="/"><h1 className="ml-6 font-bold text-2xl">
                    <span className="text-gray-600">Follow</span>
                    <span className="text-green-500">On</span></h1></Link>

                <div className="space-x-10 flex flex-row items-center mr-5">

                    <Link
                        to="/login"
                        className="bg-green-500 p-2 pl-4 pr-4 rounded-full hover:scale-[1.1] duration-150 ease-in-out"
                    >
                        Login
                    </Link>

                </div>
            </div>
        </nav>
    );
}
