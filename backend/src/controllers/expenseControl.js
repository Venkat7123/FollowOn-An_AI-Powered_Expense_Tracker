import { supabaseAdmin } from "../config/supabase.js";

export const addExpense = async (req, res) => {
    try {
        const { userId, amount, title, type, date } = req.body;

        console.log("Add expense request - userId:", userId, "amount:", amount, "title:", title, "type:", type, "date:", date);

        if (!userId || !amount || !title || !type || !date) {
            console.log("Missing required fields");
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { data, error } = await supabaseAdmin
            .from('expenses')
            .insert([{ user_id: userId, amount, name: title, type, date }])
            .select();

        if (error) {
            console.error("Supabase insert error:", JSON.stringify(error));
            console.error("Error details:", {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return res.status(500).json({ error: error.message });
        }
        
        console.log("Expense added successfully:", data);
        res.json(data);
    } catch (err) {
        console.error("Add expense exception:", err.message);
        res.status(500).json({ error: err.message || "Failed to add expense" });
    }
}

export const getExpense = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const { data, error } = await supabaseAdmin
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) {
            console.error("Supabase select error:", JSON.stringify(error));
            return res.status(500).json({ error: error.message });
        }
        res.json(data);
    } catch (err) {
        console.error("Get expense exception:", err.message);
        res.status(500).json({ error: err.message || "Failed to fetch expenses" });
    }
}

export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabaseAdmin
            .from('expenses')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Supabase delete error:", JSON.stringify(error));
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error("Delete expense exception:", err.message);
        res.status(500).json({ error: err.message || "Failed to delete expense" });
    }
}

export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount, type } = req.body;

        if (!name || !amount || !type) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { data, error } = await supabaseAdmin
            .from('expenses')
            .update({ name, amount: parseFloat(amount), type })
            .eq('id', id)
            .select();

        if (error) {
            console.error("Supabase update error:", JSON.stringify(error));
            return res.status(500).json({ error: error.message });
        }

        console.log("Expense updated successfully:", data);
        res.json(data);
    } catch (err) {
        console.error("Update expense exception:", err.message);
        res.status(500).json({ error: err.message || "Failed to update expense" });
    }
}