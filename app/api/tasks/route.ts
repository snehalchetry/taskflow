import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

/**
 * Hybrid auth: tries cookie-based auth first (OAuth callback flow),
 * then falls back to Bearer token auth (hash-fragment login flow).
 */
async function getAuthenticatedClient(request: Request) {
    // 1. Try cookie-based auth (preferred)
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user }, error: cookieError } = await supabase.auth.getUser();
        console.log("[API Auth] Cookie auth:", user ? `✅ ${user.email}` : `❌ ${cookieError?.message || "no session"}`);
        if (user) return { supabase, user };
    } catch (e) {
        console.log("[API Auth] Cookie auth threw:", e);
    }

    // 2. Fallback: Bearer token auth (for hash-fragment sessions)
    const authHeader = request.headers.get("Authorization");
    console.log("[API Auth] Bearer header present:", !!authHeader);
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        console.log("[API Auth] Token length:", token.length);
        const anonClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { user: tokenUser }, error: tokenError } = await anonClient.auth.getUser(token);
        console.log("[API Auth] Token auth:", tokenUser ? `✅ ${tokenUser.email}` : `❌ ${tokenError?.message || "invalid token"}`);
        if (tokenUser) return { supabase: anonClient, user: tokenUser };
    }

    console.log("[API Auth] ❌ All auth methods failed");
    return null;
}

export async function GET(request: Request) {
    try {
        const auth = await getAuthenticatedClient(request);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data, error } = await auth.supabase
            .from("tasks")
            .select("*")
            .eq("user_id", auth.user.id)
            .order("created_at", { ascending: false });

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
        const { title, priority, category, time, projectId } = body;

        if (!title) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const { data, error } = await auth.supabase
            .from("tasks")
            .insert([
                {
                    title,
                    priority,
                    category,
                    time: time || null,
                    user_id: auth.user.id,
                    project_id: projectId || null,
                    completed: false,
                },
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const auth = await getAuthenticatedClient(request);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, completed, title, priority } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const { data, error } = await auth.supabase
            .from("tasks")
            .update({ completed, title, priority })
            .eq("id", id)
            .eq("user_id", auth.user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const auth = await getAuthenticatedClient(request);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const { error } = await auth.supabase
            .from("tasks")
            .delete()
            .eq("id", id)
            .eq("user_id", auth.user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
