import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * 1. AI Task Breakdown
 * Breaks a big goal into 3-6 subtasks.
 */
export async function breakdownTask(goal: string) {
    if (!API_KEY) return null;
    try {
        const prompt = `Break down this task/goal into 3-6 actionable subtasks: "${goal}". 
        Return ONLY a JSON array of objects with the following format: 
        [{"title": "Subtask Name", "priority": "HIGH" | "MEDIUM" | "LOW"}]`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean up the response if it contains markdown code blocks
        const cleanedText = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Gemini breakdown error:", error);
        return null;
    }
}

/**
 * 2. Smart Priority Suggester
 * Suggests a priority based on the task title.
 */
export async function suggestPriority(title: string) {
    if (!API_KEY || !title.trim()) return null;
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
        console.error("Gemini priority suggestion error:", error);
        return null;
    }
}

/**
 * 3. Daily Focus Mode
 * Picks top 3 tasks with reasons.
 */
export async function getDailyFocus(tasks: any[]) {
    if (!API_KEY || tasks.length === 0) return null;
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
        console.error("Gemini Daily Focus error:", error);
        return null;
    }
}

/**
 * 4. Natural Language Task Input
 * Parses a natural language string into fields.
 */
export async function parseNaturalLanguageTask(input: string) {
    if (!API_KEY || !input.trim()) return null;
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
        console.error("Gemini NLP parsing error:", error);
        return null;
    }
}
