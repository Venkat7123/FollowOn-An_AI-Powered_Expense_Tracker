import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function HomePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate()
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
            setIsAuthenticated(true);
        }
    }, []);
    
    return (
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden px-4">
            <img src="/bg.png"
                className="absolute z-0 w-full min-h-screen object-cover brightness-50"
                alt="FollowOn Background Image" />
            <div className="relative z-10 text-center flex-column">
                <h1 className="font-bold text-[50px] mb-6">Welcome to <span className="text-green-400">FollowOn</span></h1>
                <div>
                    {isAuthenticated ? (
                        <button
                            onClick={() => {
                                navigate("/dashboard")
                            }}
                            className="relative bg-green-500 p-4 pl-12 pr-12 
                            rounded-full hover:scale-[1.1] duration-300 ease-in-out 
                            animate-colour-slide text-[20px] cursor-pointer"
                        >
                            Go to DashBoard
                        </button>
                    ) : (
                        <Link to="/login"
                            className="relative bg-green-500 p-4 pl-12 pr-12 
                            rounded-full duration-300 ease-in-out text-[20px] cursor-pointer">
                            Login
                        </Link>
                    )}

                </div>
            </div>
        </section>
    )
}
export default HomePage;