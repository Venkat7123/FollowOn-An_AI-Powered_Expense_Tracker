import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "../config/supabase.js";


export const handleChat = async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        if (!message || !userId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        // Fetch user's expenses
        console.log("Fetching expenses for user:", userId);
        const { data: expenses, error: expenseError } = await supabaseAdmin
            .from('expenses')
            .select('*')
            .eq('user_id', userId);

        if (expenseError) {
            console.error("Error fetching expenses:", expenseError);
            return res.status(500).json({ error: "Failed to fetch expense data" });
        }

        // Prepare expense summary for Gemini
        let expenseSummary = "No expenses found.";
        if (expenses && expenses.length > 0) {
            const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
            const categoryBreakdown = expenses.reduce((acc, e) => {
                acc[e.type] = (acc[e.type] || 0) + Number(e.amount);
                return acc;
            }, {});

            expenseSummary = `
Total Expenses: ₹${totalAmount.toFixed(2)}
Number of Transactions: ${expenses.length}

Breakdown by Category:
${Object.entries(categoryBreakdown)
    .map(([category, amount]) => `- ${category}: ₹${amount.toFixed(2)}`)
    .join('\n')}

Recent Transactions:
${expenses.slice(0, 5)
    .map(e => `- ${e.name}: ₹${e.amount} (${e.type}) on ${e.date}`)
    .join('\n')}
            `;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Chatbot error: GEMINI_API_KEY not found in environment variables");
            return res.status(500).json({ error: "API key not configured" });
        }

        console.log("Initializing Google Generative AI with API key length:", apiKey.length);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        
        const prompt = `You are an AI expense assistant. Analyze the user's expense data and answer their questions.

User's Expense Data:
${expenseSummary}

User ID: ${userId}

Rules:
- Answer only about expenses, money, budgeting, savings.
- Be short, clear, and helpful.
- Provide insights based on the expense data provided above.
- Suggest ways to save money if asked.
- If unrelated, politely redirect to expense topics.

Format responses using markdown:
- Headings
- Bullet points
- Line breaks

User question: "${message}"

Provide a helpful response based on the user's actual expense data.`;

        console.log("Sending request to Gemini API with expense data...");
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        console.log("Chatbot response generated successfully");
        res.json({ reply: response });
    }
    catch (err) {
        console.error("Chatbot error:", err.message);
        console.error("Chatbot error stack:", err.stack);
        res.status(500).json({ error: err.message || "Chatbot error" });
    }
}