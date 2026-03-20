"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthSync() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        console.log("AuthSync: Initializing...");
        
        const checkSession = async () => {
            // 1. Check for manual hash (Implicit flow fail-safe)
            if (window.location.hash.includes("access_token")) {
                console.log("AuthSync: Found access_token in hash, waiting for Supabase...");
            }

            const { data: { session } } = await supabase.auth.getSession();
            console.log("AuthSync: Current session status:", session ? "Authenticated" : "Not Found");
            if (session?.user) {
                handleAuth(session);
            }
        };

        const handleAuth = (session: any) => {
            const userData = {
                name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || "User",
                email: session.user.email!,
                id: session.user.id
            };
            console.log("AuthSync: Syncing user:", userData.email);
            localStorage.setItem("taskflow_user", JSON.stringify(userData));

            // Force redirect if we are on landing/login/signup
            const currentPath = window.location.pathname;
            if (currentPath === "/" || currentPath === "/login" || currentPath === "/signup") {
                console.log("AuthSync: Forcing redirect to /dashboard...");
                window.location.href = "/dashboard";
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("AuthSync: Auth event detected:", event);
            if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED')) {
                handleAuth(session);
            } else if (event === 'SIGNED_OUT') {
                if (window.location.pathname === "/dashboard") {
                    localStorage.removeItem("taskflow_user");
                    window.location.href = "/login";
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [router, pathname]);

    return null;
}
