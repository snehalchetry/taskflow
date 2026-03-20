"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Signup failed.");
                return;
            }

            // Auto-login after signup
            localStorage.setItem("taskflow_user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="fixed inset-0 bg-[#050a0a] text-white flex items-center justify-center">
            {/* Subtle radial glow */}
            <div className="absolute inset-0 pointer-events-none [background:radial-gradient(60%_50%_at_50%_40%,rgba(38,217,217,0.03),transparent_70%)]" />

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-[#ea2a33] size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#ea2a33]/20">
                        <span className="material-symbols-outlined font-bold text-lg">layers</span>
                    </div>
                    <span className="text-lg font-black tracking-tight uppercase">TaskFlow</span>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl p-8 border"
                    style={{
                        background: "linear-gradient(135deg, rgba(10,18,18,0.95), rgba(15,28,28,0.95))",
                        borderColor: "rgba(38,217,217,0.08)",
                    }}
                >
                    <h1 className="text-2xl font-bold mb-1">Create your account</h1>
                    <p className="text-white/40 text-sm mb-6">Start managing your tasks effortlessly</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2.5 rounded-lg mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 h-12 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-[#26d9d9]/40 transition-all placeholder:text-white/15 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 h-12 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-[#26d9d9]/40 transition-all placeholder:text-white/15 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider block mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    className="w-full pl-10 pr-10 h-12 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-[#26d9d9]/40 transition-all placeholder:text-white/15 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#26d9d9] transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl font-bold text-sm uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{
                                background: "linear-gradient(135deg, #26d9d9, #1ab3b3)",
                                color: "#050a0a",
                            }}
                        >
                            {isLoading ? (
                                <span className="inline-block size-4 border-2 border-[#050a0a] border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-white/30 mt-6">
                        Already have an account?{" "}
                        <button onClick={() => router.push("/login")} className="text-[#26d9d9] hover:underline font-medium cursor-pointer">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </section>
    );
}
