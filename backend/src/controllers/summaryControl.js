import { supabaseAdmin } from "../config/supabase.js";

export const getSummary = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const { data, error } = await supabaseAdmin
            .from('expenses')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Supabase select error:", JSON.stringify(error));
            return res.status(500).json({ error: error.message });
        }
        const total = data.reduce((sum, e) => sum + Number(e.amount), 0);

        res.json({ total, expenses: data });
    } catch (err) {
        console.error("Get summary exception:", err.message);
        res.status(500).json({ error: err.message || "Failed to fetch summary" });
    }
}