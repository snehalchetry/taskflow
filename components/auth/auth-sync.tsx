"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthSync() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                // Sync to localStorage for existing dashboard logic compatibility
                const userData = {
                    name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || "User",
                    email: session.user.email!,
                    id: session.user.id
                };
                localStorage.setItem("taskflow_user", JSON.stringify(userData));

                // If user is on landing/login, send them to dashboard
                if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
                    router.push("/dashboard");
                }
            } else {
                // Handle signed out state if needed
                if (pathname === "/dashboard") {
                    localStorage.removeItem("taskflow_user");
                    router.push("/login");
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [router, pathname]);

    return null;
}
