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
            const { data: { session } } = await supabase.auth.getSession();
            console.log("AuthSync: Current session:", session ? "Found" : "Not Found");
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
            console.log("AuthSync: Syncing user data:", userData.email);
            localStorage.setItem("taskflow_user", JSON.stringify(userData));

            if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
                console.log("AuthSync: Redirecting to dashboard...");
                router.push("/dashboard");
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("AuthSync: Auth event:", event);
            if (session?.user) {
                handleAuth(session);
            } else if (event === 'SIGNED_OUT') {
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
