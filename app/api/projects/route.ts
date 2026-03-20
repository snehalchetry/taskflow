import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

/**
 * Hybrid auth: tries cookie-based auth first (OAuth callback flow),
 * then falls back to Bearer token auth (hash-fragment login flow).
 */
async function getAuthenticatedClient(request: Request) {
    // 1. Try cookie-based auth (preferred)
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return { supabase, user };

    // 2. Fallback: Bearer token auth (for hash-fragment sessions)
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const anonClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user: tokenUser } } = await anonClient.auth.getUser(token);
        if (tokenUser) return { supabase: anonClient, user: tokenUser };
    }

    return null;
}

export async function GET(request: Request) {
    try {
        const auth = await getAuthenticatedClient(request);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await auth.supabase
            .from("projects")
            .select("*")
            .eq("user_id", auth.user.id)
            .order("created_at", { ascending: true });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await getAuthenticatedClient(request);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, color } = body;

        if (!name || !color) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const { data, error } = await auth.supabase
            .from("projects")
            .insert([{ name, color, user_id: auth.user.id }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
