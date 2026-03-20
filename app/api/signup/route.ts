import { NextResponse } from "next/server";

// In-memory store (shared with login route for demo purposes)
// In production, use a database
const USERS: Record<string, { name: string; email: string; password: string }> = {
    "demo@taskflow.io": { name: "Demo User", email: "demo@taskflow.io", password: "demo123" },
    "admin@taskflow.io": { name: "Admin", email: "admin@taskflow.io", password: "admin123" },
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email and password are required." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters." },
                { status: 400 }
            );
        }

        // Check if user already exists
        if (USERS[email.toLowerCase()]) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 409 }
            );
        }

        // Create new user
        const newUser = {
            name,
            email: email.toLowerCase(),
            password,
        };
        USERS[email.toLowerCase()] = newUser;

        return NextResponse.json({
            message: "Account created successfully!",
            user: { name: newUser.name, email: newUser.email },
        });
    } catch {
        return NextResponse.json(
            { error: "Invalid request." },
            { status: 400 }
        );
    }
}
