import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        // SignIn with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password,
        });

        if (error) {
            console.error("Supabase Login Error:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        // Return user info
        return NextResponse.json({
            success: true,
            user: { 
                name: data.user?.user_metadata?.full_name || "User", 
                email: data.user?.email,
                id: data.user?.id 
            },
            session: data.session
        });
    } catch (err: any) {
        console.error("Login Route Error:", err);
        return NextResponse.json(
            { error: err.message || "Internal server error." },
            { status: 500 }
        );
    }
}
