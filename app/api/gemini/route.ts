import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

function getModel() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    if (!apiKey) return null;
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export async function POST(req: NextRequest) {
    const { action, payload } = await req.json();
    const model = getModel();
    
    if (!model) {
        return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    try {
        if (action === "breakdown") {
            const prompt = `Break down this task/goal into 3-6 actionable subtasks: "${payload.goal}". 
            Return ONLY a JSON array of objects with the following format: 
            [{"title": "Subtask Name", "priority": "HIGH" | "MEDIUM" | "LOW"}]`;
            
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleaned = text.replace(/```json|```/g, "").trim();
            return NextResponse.json(JSON.parse(cleaned));
        }

        if (action === "priority") {
            const prompt = `Based on this task title: "${payload.title}", suggest a priority: HIGH, MEDIUM, or LOW. 
            Think about urgency and importance. Return ONLY the one-word priority in uppercase.`;
            
            const result = await model.generateContent(prompt);
            const priority = result.response.text().trim().toUpperCase();
            return NextResponse.json({ priority: ["HIGH", "MEDIUM", "LOW"].includes(priority) ? priority : "MEDIUM" });
        }

        if (action === "focus") {
            const taskData = payload.tasks.map((t: { title: string; priority: string; category: string }) => ({
                title: t.title, priority: t.priority, category: t.category,
            }));
            const prompt = `Look at these tasks: ${JSON.stringify(taskData)}. 
            Pick the top 3 most important ones for today and provide a short, 1-sentence reason for each.
            Return ONLY a JSON array of objects: [{"title": "Task Title", "reason": "Short reason"}]`;
            
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleaned = text.replace(/```json|```/g, "").trim();
            return NextResponse.json(JSON.parse(cleaned));
        }

        if (action === "nlp") {
            const now = new Date().toISOString();
            const prompt = `Parse this naturally written task: "${payload.input}". 
            The current time is ${now}.
            Extract the title, priority (HIGH, MEDIUM, or LOW), and deadline (as ISO string or null).
            Return ONLY a JSON object: {"title": "Cleaned Title", "priority": "HIGH" | "MEDIUM" | "LOW", "time": "ISO_STRING" | null}`;
            
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleaned = text.replace(/```json|```/g, "").trim();
            return NextResponse.json(JSON.parse(cleaned));
        }

        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    } catch (error) {
        console.error("[Gemini API]", error);
        return NextResponse.json({ error: "Gemini request failed" }, { status: 500 });
    }
}
