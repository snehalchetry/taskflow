"use client";

import { useRouter } from "next/navigation";
import LoginCardSection from "@/components/ui/login-signup";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = () => {
        // The LoginCardSection component handles the API call internally
        // and stores the user in localStorage. We just redirect on success.
        router.push("/dashboard");
        return true;
    };

    const handleCreateAccount = () => {
        router.push("/signup");
    };

    return (
        <LoginCardSection
            onLogin={handleLogin}
            onCreateAccount={handleCreateAccount}
        />
    );
}
