import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./frontend/components/Navbar";
import HomePage from "./frontend/pages/Homepage";
import AuthPage from "./frontend/pages/AuthPage";
import Dashboard from "./frontend/pages/Dashboard";
import AddExpense from "./frontend/pages/AddExpense";
import ViewExpense from "./frontend/pages/ViewExpenses";
import Chart from "./frontend/pages/Chart";
import History from "./frontend/pages/History";
import ExpenseChatbotButton from "./frontend/pages/ExpenseChatbot";
import { useState, useEffect } from "react";

// Helper function to check if user is authenticated
const isUserAuthenticated = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return !!(token && userId);
};

function App() {
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);
    const [authState, setAuthState] = useState(false);

    useEffect(() => {
        // Initial check
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                
                if (token && userId) {
                    setUser(userId);
                    setAuthState(true);
                } else {
                    setAuthState(false);
                }
            } catch (error) {
                console.error("Auth check error:", error);
                setAuthState(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
        
        // Listen for auth changes
        const handleStorageChange = () => {
            checkAuth();
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth-change', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', handleStorageChange);
        };
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // Use the helper function for route protection to always check latest localStorage
    const isAuth = isUserAuthenticated();

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={isAuth ? <Navigate to="/dashboard" replace /> : <HomePage />} />
                <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
                <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
                <Route path="/add" element={isAuth ? <AddExpense /> : <Navigate to="/login" replace />} />
                <Route path="/expense" element={isAuth ? <ViewExpense /> : <Navigate to="/login" replace />} />
                <Route path="/view" element={isAuth ? <Chart /> : <Navigate to="/login" replace />} />
                <Route path="/history" element={isAuth ? <History /> : <Navigate to="/login" replace />} />
            </Routes>
            {isAuth && <ExpenseChatbotButton userId={user} />}
        </BrowserRouter >
    )
}

export default App;