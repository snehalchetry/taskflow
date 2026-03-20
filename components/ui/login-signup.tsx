"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    Eye,
    EyeOff,
    Github,
    Lock,
    Mail,
    ArrowRight,
    Chrome,
} from "lucide-react";

interface LoginCardSectionProps {
    onLogin?: (email: string, password: string) => Promise<boolean> | boolean;
    onCreateAccount?: () => void;
}

export default function LoginCardSection({ onLogin, onCreateAccount }: LoginCardSectionProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const setSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        setSize();

        type P = { x: number; y: number; v: number; o: number };
        let ps: P[] = [];
        let raf = 0;

        const make = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            v: Math.random() * 0.25 + 0.05,
            o: Math.random() * 0.35 + 0.15,
        });

        const init = () => {
            ps = [];
            const count = Math.floor((canvas.width * canvas.height) / 9000);
            for (let i = 0; i < count; i++) ps.push(make());
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ps.forEach((p) => {
                p.y -= p.v;
                if (p.y < 0) {
                    p.x = Math.random() * canvas.width;
                    p.y = canvas.height + Math.random() * 40;
                    p.v = Math.random() * 0.25 + 0.05;
                    p.o = Math.random() * 0.35 + 0.15;
                }
                ctx.fillStyle = `rgba(38,217,217,${p.o * 0.6})`;
                ctx.fillRect(p.x, p.y, 0.7, 2.2);
            });
            raf = requestAnimationFrame(draw);
        };

        const onResize = () => {
            setSize();
            init();
        };

        window.addEventListener("resize", onResize);
        init();
        raf = requestAnimationFrame(draw);
        return () => {
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(raf);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed. Please try again.");
                return;
            }

            // Store user info
            if (typeof window !== "undefined") {
                localStorage.setItem("taskflow_user", JSON.stringify(data.user));
                if (rememberMe) {
                    localStorage.setItem("taskflow_remember", "true");
                }
            }

            if (onLogin) {
                onLogin(email, password);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="fixed inset-0 bg-[#050a0a] text-white">
            <style>{`
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.35}
        .hline,.vline{position:absolute;background:#1a2e2e;will-change:transform,opacity}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
        .hline:nth-child(1){top:18%;animation-delay:.12s}
        .hline:nth-child(2){top:50%;animation-delay:.22s}
        .hline:nth-child(3){top:82%;animation-delay:.32s}
        .vline:nth-child(4){left:22%;animation-delay:.42s}
        .vline:nth-child(5){left:50%;animation-delay:.54s}
        .vline:nth-child(6){left:78%;animation-delay:.66s}
        .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(38,217,217,.12),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
        .hline:nth-child(1)::after{animation-delay:.12s}
        .hline:nth-child(2)::after{animation-delay:.22s}
        .hline:nth-child(3)::after{animation-delay:.32s}
        .vline:nth-child(4)::after{animation-delay:.42s}
        .vline:nth-child(5)::after{animation-delay:.54s}
        .vline:nth-child(6)::after{animation-delay:.66s}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.7}100%{transform:scaleX(1);opacity:.35}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.7}100%{transform:scaleY(1);opacity:.35}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}

        .card-animate {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) 0.4s forwards;
        }
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

            {/* Subtle teal vignette */}
            <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(38,217,217,0.02),transparent_60%)]" />

            {/* Animated accent lines */}
            <div className="accent-lines">
                <div className="hline" />
                <div className="hline" />
                <div className="hline" />
                <div className="vline" />
                <div className="vline" />
                <div className="vline" />
            </div>

            {/* Particles */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-35 mix-blend-screen pointer-events-none"
            />

            {/* Split-screen layout */}
            <div className="relative z-10 h-full w-full grid grid-cols-1 lg:grid-cols-2">
                {/* Left side — Branding */}
                <div className="hidden lg:flex flex-col justify-center items-start px-16 xl:px-24 border-r border-[#1a2e2e]/40">
                    <div className="max-w-md">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-[#ea2a33] size-11 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#ea2a33]/20">
                                <span className="material-symbols-outlined font-bold text-xl">layers</span>
                            </div>
                            <span className="text-xl font-black tracking-tight uppercase">TaskFlow</span>
                        </div>

                        <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] mb-6">
                            Focus<br />Awaits.
                        </h1>

                        <p className="text-[#6a8888] text-lg leading-relaxed">
                            Welcome back! Experience the next generation of task management. Stay organized, stay productive.
                        </p>
                    </div>
                </div>

                {/* Right side — Login Form */}
                <div className="flex items-center justify-center px-6 sm:px-12">
                    <Card className="card-animate w-full max-w-md border-[#1a2e2e]/40 bg-[#0a1212]/90 backdrop-blur-xl shadow-2xl shadow-black/40 rounded-2xl">
                        <CardHeader className="space-y-1 pb-2">
                            {/* Mobile branding */}
                            <div className="flex items-center gap-2 mb-4 lg:hidden">
                                <div className="bg-[#ea2a33] size-9 rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined font-bold text-lg">layers</span>
                                </div>
                                <span className="text-lg font-black tracking-tight uppercase">TaskFlow</span>
                            </div>
                            <CardTitle className="text-2xl font-black text-white">Welcome back</CardTitle>
                            <CardDescription className="text-[#6a8888]">
                                Sign in to continue managing your tasks
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="grid gap-5">
                            {error && (
                                <div className="bg-[#ea2a33]/10 border border-[#ea2a33]/30 text-[#ea2a33] text-sm px-4 py-2.5 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="grid gap-5" id="login-form">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-[#a0c4c4] text-xs font-bold uppercase tracking-wider">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5a8a8a]" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="demo@taskflow.io"
                                            className="pl-10 h-12 bg-[#0f1c1c] border-[#1a3030] text-white placeholder:text-[#3d6666] rounded-xl focus-visible:border-[#26d9d9] focus-visible:ring-[#26d9d9]/20"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-[#a0c4c4] text-xs font-bold uppercase tracking-wider">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5a8a8a]" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 h-12 bg-[#0f1c1c] border-[#1a3030] text-white placeholder:text-[#3d6666] rounded-xl focus-visible:border-[#26d9d9] focus-visible:ring-[#26d9d9]/20"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#3d6666] hover:text-[#26d9d9] transition-colors cursor-pointer"
                                            onClick={() => setShowPassword((v) => !v)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="remember"
                                            checked={rememberMe}
                                            onCheckedChange={(checked) => setRememberMe(checked === true)}
                                            className="border-[#1a3030] data-[state=checked]:bg-[#26d9d9] data-[state=checked]:text-[#050a0a] data-[state=checked]:border-[#26d9d9]"
                                        />
                                        <Label htmlFor="remember" className="text-[#6a8888] text-sm cursor-pointer">
                                            Remember me
                                        </Label>
                                    </div>
                                    <a href="#" className="text-sm text-[#26d9d9] hover:text-[#26d9d9]/80 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 rounded-xl bg-[#26d9d9] text-[#0d1a1a] font-bold text-sm uppercase tracking-wider hover:bg-[#26d9d9]/90 shadow-lg shadow-[#26d9d9]/20 cursor-pointer"
                                    id="login-button"
                                >
                                    {isLoading ? (
                                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    ) : (
                                        <>
                                            Log In
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="relative my-1">
                                <Separator className="bg-[#1a2e2e]/50" />
                                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#0a1212] px-3 text-[11px] uppercase tracking-widest text-[#3d6666]">
                                    or
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="h-11 rounded-xl border-[#1a3030] bg-[#0f1c1c] text-white hover:bg-[#0f1c1c]/80 hover:text-[#26d9d9] cursor-pointer"
                                    id="github-login"
                                >
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-11 rounded-xl border-[#1a3030] bg-[#0f1c1c] text-white hover:bg-[#0f1c1c]/80 hover:text-[#26d9d9] cursor-pointer"
                                    id="google-login"
                                >
                                    <Chrome className="h-4 w-4 mr-2" />
                                    Google
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="flex items-center justify-center text-sm text-[#6a8888] pb-8">
                            New to Taskflow?
                            <button
                                onClick={onCreateAccount}
                                className="ml-1 text-[#26d9d9] hover:underline font-medium cursor-pointer"
                                id="create-account-link"
                            >
                                Create an account
                            </button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}
