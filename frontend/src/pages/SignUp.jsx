import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../api";

function SignUp({ onSwitchToLogin }) {
    const [name, setName] = useState("");
    const [email, setemail] = useState("");
    const [pwd, setpwd] = useState("");
    const [viewpwd, setviewpwd] = useState(false);
    const [msg, setmsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name || !email || !pwd) {
            setmsg("Please fill in all fields");
            return;
        }
        
        setLoading(true);
        setmsg("");

        try {
            const { data } = await api.post("/api/auth/signup", {
                email,
                pwd,
                name
            });


            if (data) {
                setmsg("Sign Up Successful! Please Login...");
                setTimeout(() => {
                    onSwitchToLogin();
                }, 1500);
            }
        } catch (error) {
            console.error("Signup error:", error);
            console.error("Error response:", error.response);
            console.error("Error status:", error.response?.status);
            
            let errorMsg = "Sign up failed. Please try again.";
            if (error.response?.status === 400) {
                errorMsg = error.response.data?.error || "Invalid input. Please check your details.";
            } else if (error.response?.data?.error) {
                errorMsg = error.response.data.error;
            } else if (error.message === "Network Error") {
                errorMsg = "Cannot connect to server. Make sure the backend is running.";
            } else if (error.message) {
                errorMsg = error.message;
            }
            
            setmsg(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-start p-8 bg-black text-white">
            <div className="p-8 rounded-3xl w-full max-w-md border bg-gray-800 border-gray-700">
                <div className="text-center font-bold mb-6 text-3xl">
                    <h1>Sign Up</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter your Name"
                        className="w-full p-4 rounded-xl focus:outline-none bg-gray-700 border-gray-600 mb-5"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Enter your Email"
                        className="w-full p-4 rounded-xl focus:outline-none bg-gray-700 border-gray-600 mb-5"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                    />

                    <div className="relative mb-5">
                        <input
                            type={viewpwd ? "text" : "password"}
                            placeholder="Enter your Password"
                            className="w-full p-4 rounded-xl focus:outline-none bg-gray-700 border-gray-600"
                            value={pwd}
                            onChange={(e) => setpwd(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setviewpwd(!viewpwd)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-white"
                        >
                            {viewpwd ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    <input
                        type="submit"
                        value={loading ? "Signing up..." : "Submit"}
                        className="w-full p-4 rounded-xl font-bold transition hover:bg-green-400 focus:outline-none bg-green-500 border-gray-600 mb-5 cursor-pointer disabled:opacity-50"
                        disabled={loading}
                    />
                </form>

                {msg && <p className={`text-center text-lg ${msg.includes("Successful") ? "text-green-500" : "text-red-500"}`}>{msg}</p>}

                <div className="text-center mt-4">
                    <h1>
                        Already have an account?{" "}
                        <span
                            onClick={onSwitchToLogin}
                            className="font-bold cursor-pointer text-green-500"
                        >
                            Login
                        </span>
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
