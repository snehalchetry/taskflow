import { NextResponse } from "next/server";

// Mock user database — replace with real DB/auth provider later
const MOCK_USERS = [
    { email: "demo@taskflow.io", password: "demo123", name: "Demo User" },
    { email: "admin@taskflow.io", password: "admin123", name: "Admin" },
];

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        const user = MOCK_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        // Return user info (without password)
        return NextResponse.json({
            success: true,
            user: { name: user.name, email: user.email },
        });
    } catch {
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
