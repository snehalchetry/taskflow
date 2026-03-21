/**
 * Client-side helpers that call /api/gemini server route.
 * API key stays server-side — no NEXT_PUBLIC_ needed.
 */

async function callGemini<T>(action: string, payload: Record<string, unknown>): Promise<T | null> {
    try {
        const res = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, payload }),
        });
        if (!res.ok) {
            const err = await res.json();
            console.error("[Gemini]", action, "failed:", err.error);
            return null;
        }
        return await res.json();
    } catch (error) {
        console.error("[Gemini]", action, "error:", error);
        return null;
    }
}

/** Breaks a big goal into 3-6 subtasks */
export async function breakdownTask(goal: string) {
    return callGemini<{ title: string; priority: string }[]>("breakdown", { goal });
}

/** Suggests a priority based on the task title */
export async function suggestPriority(title: string) {
    const result = await callGemini<{ priority: string }>("priority", { title });
    return result?.priority ?? null;
}

/** Picks top 3 tasks with reasons */
export async function getDailyFocus(tasks: { title: string; priority: string; category: string }[]) {
    return callGemini<{ title: string; reason: string }[]>("focus", { tasks });
}

/** Parses a natural language string into task fields */
export async function parseNaturalLanguageTask(input: string) {
    return callGemini<{ title: string; priority: string; time: string | null }>("nlp", { input });
}
