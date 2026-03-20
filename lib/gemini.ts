import { GoogleGenerativeAI } from "@google/generative-ai";

function getModel() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    if (!apiKey) {
        console.warn("[Gemini] No API key found in NEXT_PUBLIC_GEMINI_API_KEY");
        return null;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

/**
 * 1. AI Task Breakdown
 * Breaks a big goal into 3-6 subtasks.
 */
export async function breakdownTask(goal: string) {
    const model = getModel();
    if (!model) return null;
    try {
        const prompt = `Break down this task/goal into 3-6 actionable subtasks: "${goal}". 
        Return ONLY a JSON array of objects with the following format: 
        [{"title": "Subtask Name", "priority": "HIGH" | "MEDIUM" | "LOW"}]`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const cleanedText = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("[Gemini] breakdownTask error:", error);
        return null;
    }
}

/**
 * 2. Smart Priority Suggester
 * Suggests a priority based on the task title.
 */
export async function suggestPriority(title: string) {
    const model = getModel();
    if (!model || !title.trim()) return null;
    try {
        const prompt = `Based on this task title: "${title}", suggest a priority: HIGH, MEDIUM, or LOW. 
        Think about urgency and importance. Return ONLY the one-word priority in uppercase.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const priority = response.text().trim().toUpperCase();
        
        if (["HIGH", "MEDIUM", "LOW"].includes(priority)) {
            return priority;
        }
        return "MEDIUM";
    } catch (error) {
        console.error("[Gemini] suggestPriority error:", error);
        return null;
    }
}

/**
 * 3. Daily Focus Mode
 * Picks top 3 tasks with reasons.
 */
export async function getDailyFocus(tasks: { title: string; priority: string; category: string }[]) {
    const model = getModel();
    if (!model || tasks.length === 0) return null;
    try {
        const taskData = tasks.map(t => ({ title: t.title, priority: t.priority, category: t.category }));
        const prompt = `Look at these tasks: ${JSON.stringify(taskData)}. 
        Pick the top 3 most important ones for today and provide a short, 1-sentence reason for each.
        Return ONLY a JSON array of objects: [{"title": "Task Title", "reason": "Short reason"}]`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("[Gemini] getDailyFocus error:", error);
        return null;
    }
}

/**
 * 4. Natural Language Task Input
 * Parses a natural language string into fields.
 */
export async function parseNaturalLanguageTask(input: string) {
    const model = getModel();
    if (!model || !input.trim()) return null;
    try {
        const now = new Date().toISOString();
        const prompt = `Parse this naturally written task: "${input}". 
        The current time is ${now}.
        Extract the title, priority (HIGH, MEDIUM, or LOW), and deadline (as ISO string or null).
        Return ONLY a JSON object: {"title": "Cleaned Title", "priority": "HIGH" | "MEDIUM" | "LOW", "time": "ISO_STRING" | null}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("[Gemini] parseNaturalLanguageTask error:", error);
        return null;
    }
}
