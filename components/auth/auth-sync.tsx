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
            const hash = window.location.hash;
            if (hash && hash.includes("access_token")) {
                console.log("AuthSync: Found access_token in hash! Manually syncing...");
                try {
                    // Extract tokens from hash
                    const params = new URLSearchParams(hash.substring(1));
                    const accessToken = params.get("access_token");
                    const refreshToken = params.get("refresh_token");
                    
                    if (accessToken && refreshToken) {
                        const { data, error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken
                        });
                        console.log("AuthSync: setSession result:", error ? "Error" : "Success");
                        if (data.session) {
                            handleAuth(data.session);
                            return; // Stop here, handleAuth will redirect
                        }
                    }
                } catch (err) {
                    console.error("AuthSync: Error parsing hash:", err);
                }
            }

            const { data: { session } } = await supabase.auth.getSession();
            console.log("AuthSync: getSession status:", session ? "Authenticated" : "Not Found");
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
            console.log("AuthSync: User validated:", userData.email);
            localStorage.setItem("taskflow_user", JSON.stringify(userData));

            const currentPath = window.location.pathname;
            if (currentPath === "/" || currentPath === "/login" || currentPath === "/signup") {
                console.log("AuthSync: Redirecting to dashboard...");
                window.location.href = "/dashboard";
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("AuthSync: Event:", event);
            if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
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
