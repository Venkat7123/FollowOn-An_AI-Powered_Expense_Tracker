import { supabase } from "../config/supabase.js";

export const signup = async (req, res) => {
    try {
        const { email, pwd, name } = req.body;

        if (!email || !pwd) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Use signUp with user metadata
        const { data, error } = await supabase.auth.signUp({
            email,
            password: pwd,
            options: {
                data: {
                    full_name: name || email,
                },
            },
        });

        if (error) {
            console.error("Signup error:", error);
            return res.status(400).json({ error: error.message });
        }

        res.json({ user: data.user, session: data.session });
    } catch (err) {
        console.error("Signup exception:", err);
        res.status(500).json({ error: "Signup failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, pwd } = req.body;

        if (!email || !pwd) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pwd
        });

        if (error) {
            console.error("Supabase login error:", error.message);
            return res.status(401).json({ error: error.message || "Invalid credentials" });
        }

        if (!data.user || !data.session) {
            console.error("No user or session returned from Supabase");
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.json(data);
    } catch (err) {
        console.error("Login exception:", err.message);
        res.status(500).json({ error: err.message || "Login failed" });
    }
};