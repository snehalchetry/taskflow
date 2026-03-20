"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import Particles from "@/components/ui/Particles";
import { Logo } from "@/components/ui/logo";
import { supabase } from "@/lib/supabase";
import { 
    breakdownTask, 
    suggestPriority, 
    getDailyFocus, 
    parseNaturalLanguageTask 
} from "@/lib/gemini";

const PRIORITY = {
    HIGH: "1",
    MEDIUM: "2",
    LOW: "3",
} as const;

type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

interface Task {
    id: string;
    user_id?: string;
    title: string;
    priority: Priority;
    time?: string;
    category: string;
    completed: boolean;
}

interface Project {
    id: string;
    name: string;
    color: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string; id: string } | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // AI Features State
    const [isAILoading, setIsAILoading] = useState(false);
    const [aiPrioritySuggestion, setAiPrioritySuggestion] = useState<Priority | null>(null);
    const [nlpEnabled, setNlpEnabled] = useState(false);
    const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
    const [focusTasks, setFocusTasks] = useState<{ title: string; reason: string }[]>([]);

    // Sync Auth State
    useEffect(() => {
        const syncAuth = async () => {
            // 1. Try LocalStorage
            const storedUser = localStorage.getItem("taskflow_user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            // 2. Check Supabase Session (for OAuth)
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const userData = {
                    name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || "User",
                    email: session.user.email!,
                    id: session.user.id
                };
                setUser(userData);
                localStorage.setItem("taskflow_user", JSON.stringify(userData));
            } else if (!storedUser) {
                router.push("/login");
            }
        };

        syncAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            if (session?.user) {
                const userData = {
                    name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || "User",
                    email: session.user.email!,
                    id: session.user.id
                };
                setUser(userData);
                localStorage.setItem("taskflow_user", JSON.stringify(userData));
            } else {
                setUser(null);
                localStorage.removeItem("taskflow_user");
                router.push("/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    // Fetch initial data â€” direct Supabase client (no API routes)
    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [tasksResult, projectsResult] = await Promise.all([
                    supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
                    supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
                ]);

                if (tasksResult.data) setTasks(tasksResult.data);
                if (projectsResult.data) setProjects(projectsResult.data);
                if (tasksResult.error) console.error("Tasks fetch error:", tasksResult.error);
                if (projectsResult.error) console.error("Projects fetch error:", projectsResult.error);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>(PRIORITY.MEDIUM);
    const [newTaskDate, setNewTaskDate] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnlyCompleted, setShowOnlyCompleted] = useState<boolean | null>(null);
    const [activeProjectFilter, setActiveProjectFilter] = useState<string | null>(null);

    // New Project Modal State
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectColor, setNewProjectColor] = useState("#3b82f6");

    // Feature 2: Smart Priority Suggester
    // NOTE: Disabled auto-fire to conserve Gemini API quota.
    // The suggestPriority function fires on every keystroke (800ms debounce),
    // which exhausts free-tier limits in seconds. Re-enable when on a paid plan.
    /*
    useEffect(() => {
        if (!newTaskTitle.trim() || nlpEnabled || isAILoading) {
            setAiPrioritySuggestion(null);
            return;
        }

        const timeoutId = setTimeout(async () => {
            if (newTaskTitle.length > 3) {
                const suggestion = await suggestPriority(newTaskTitle);
                if (suggestion) {
                    const mappedPriority = 
                        suggestion === "HIGH" ? PRIORITY.HIGH : 
                        suggestion === "LOW" ? PRIORITY.LOW : 
                        PRIORITY.MEDIUM;
                    setAiPrioritySuggestion(mappedPriority);
                }
            }
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [newTaskTitle, nlpEnabled]);
    */

    // Feature 1: AI Task Breakdown
    const handleAIBreakdown = async () => {
        if (!newTaskTitle.trim() || !user) return;
        setIsAILoading(true);
        try {
            const subtasks = await breakdownTask(newTaskTitle);
            if (subtasks && Array.isArray(subtasks)) {
                // Auto-create "AI Breakdown" project if it doesn't exist
                const aiProjectExists = projects.some(p => p.name === "AI Breakdown");
                if (!aiProjectExists) {
                    const { data: newProj } = await supabase
                        .from("projects")
                        .insert([{ name: "AI Breakdown", color: "#8b5cf6", user_id: user.id }])
                        .select()
                        .single();
                    if (newProj) setProjects(prev => [...prev, newProj]);
                }

                for (const sub of subtasks) {
                    await supabase.from("tasks").insert([{
                        title: sub.title,
                        priority: sub.priority === "HIGH" ? PRIORITY.HIGH : sub.priority === "LOW" ? PRIORITY.LOW : PRIORITY.MEDIUM,
                        category: "AI Breakdown",
                        time: null,
                        user_id: user.id,
                        completed: false,
                    }]);
                }
                // Refresh tasks
                const { data } = await supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
                if (data) setTasks(data);
                setNewTaskTitle("");
            }
        } catch (error) {
            console.error("Error breaking down task:", error);
        } finally {
            setIsAILoading(false);
        }
    };

    // Feature 4: Natural Language Parsing
    const handleNLPInput = async (val: string) => {
        setNewTaskTitle(val);
        if (!nlpEnabled || val.length < 5) return;

        const timeoutId = setTimeout(async () => {
            const parsed = await parseNaturalLanguageTask(val);
            if (parsed) {
                if (parsed.title) setNewTaskTitle(parsed.title);
                if (parsed.priority) {
                    const mappedPriority = 
                        parsed.priority === "HIGH" ? PRIORITY.HIGH : 
                        parsed.priority === "LOW" ? PRIORITY.LOW : 
                        PRIORITY.MEDIUM;
                    setNewTaskPriority(mappedPriority);
                }
                if (parsed.time) setNewTaskDate(parsed.time.split('T')[0]);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    };

    // Feature 3: Focus Mode
    const openFocusMode = async () => {
        if (tasks.length === 0) return;
        setIsFocusModalOpen(true);
        setIsAILoading(true);
        try {
            const focus = await getDailyFocus(tasks);
            if (focus) setFocusTasks(focus);
        } catch (error) {
            console.error("Error getting focus tasks:", error);
        } finally {
            setIsAILoading(false);
        }
    };


    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = showOnlyCompleted === null ? true : task.completed === showOnlyCompleted;
            const matchesProject = activeProjectFilter === null ? true : task.category === activeProjectFilter;
            return matchesSearch && matchesStatus && matchesProject;
        });
    }, [tasks, searchQuery, showOnlyCompleted, activeProjectFilter]);

    // Group tasks by category for organized display
    const groupedTasks = useMemo(() => {
        const groups: Record<string, Task[]> = {};
        filteredTasks.forEach((task) => {
            const cat = task.category || "Inbox";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(task);
        });
        return groups;
    }, [filteredTasks]);

    const addTask = async () => {
        if (!newTaskTitle.trim() || !user) return;
        setIsAdding(true);

        try {
            const { data: newTask, error } = await supabase
                .from("tasks")
                .insert([{
                    title: newTaskTitle,
                    priority: newTaskPriority,
                    category: activeProjectFilter || "Inbox",
                    time: newTaskDate || null,
                    user_id: user.id,
                    completed: false,
                }])
                .select()
                .single();

            if (error) throw error;
            if (newTask) {
                setTasks([newTask, ...tasks]);
                setNewTaskTitle("");
                setNewTaskDate("");
                setNewTaskPriority(PRIORITY.MEDIUM);
                setAiPrioritySuggestion(null);
            }
        } catch (error) {
            console.error("Error adding task:", error);
        } finally {
            setIsAdding(false);
        }
    };

    const createProject = async () => {
        if (!newProjectName.trim() || !user) return;
        
        try {
            const { data: newProj, error } = await supabase
                .from("projects")
                .insert([{ name: newProjectName, color: newProjectColor, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            if (newProj) {
                setProjects([...projects, newProj]);
                setNewProjectName("");
                setIsProjectModalOpen(false);
            }
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task || !user) return;

        // Optimistic update
        const originalTasks = [...tasks];
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

        try {
            const { error } = await supabase
                .from("tasks")
                .update({ completed: !task.completed })
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) throw error;
        } catch (error) {
            console.error("Error toggling task:", error);
            setTasks(originalTasks);
        }
    };

    const deleteTask = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;

        // Optimistic update
        const originalTasks = [...tasks];
        setTasks(prev => prev.filter(t => t.id !== id));

        try {
            const { error } = await supabase
                .from("tasks")
                .delete()
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) throw error;
        } catch (error) {
            console.error("Error deleting task:", error);
            setTasks(originalTasks);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("taskflow_user");
        router.push("/login");
    };

    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = tasks.filter((t) => !t.completed).length;
    const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    // Time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    if (!user || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#050a0a]">
                <div className="flex flex-col items-center gap-5">
                    <div className="relative">
                        <div className="size-12 border-2 border-[#26d9d9]/30 rounded-full" />
                        <div className="absolute inset-0 size-12 border-2 border-[#26d9d9] border-t-transparent rounded-full animate-spin" />
                    </div>
                    <span className="text-white/30 text-sm font-medium">
                        {loading ? "Loading your workspace..." : "Redirecting..."}
                    </span>
                </div>
            </div>
        );
    }

    const priorityConfig = {
        [PRIORITY.HIGH]: { label: "High", color: "#ef4444", bg: "rgba(239,68,68,0.1)", gradient: "linear-gradient(180deg, #ef4444, #dc2626)" },
        [PRIORITY.MEDIUM]: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", gradient: "linear-gradient(180deg, #f59e0b, #d97706)" },
        [PRIORITY.LOW]: { label: "Low", color: "#64748b", bg: "rgba(100,116,139,0.1)", gradient: "linear-gradient(180deg, #64748b, #475569)" },
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#050a0a] text-white">
            {/* â”€â”€â”€ Focus Mode Modal â”€â”€â”€ */}
            {isFocusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-2xl p-4">
                    <div className="modal-enter w-full max-w-2xl rounded-3xl p-10 glass-strong shadow-2xl overflow-hidden relative">
                        {/* Decorative glows */}
                        <div className="absolute -top-32 -right-32 size-64 bg-[#26d9d9]/8 blur-[120px] rounded-full" />
                        <div className="absolute -bottom-20 -left-20 size-40 bg-[#10b981]/5 blur-[80px] rounded-full" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-display italic flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[#26d9d9]">auto_awesome</span>
                                        Daily Focus
                                    </h3>
                                    <p className="text-white/30 text-sm mt-1">AI-selected priorities for today</p>
                                </div>
                                <button 
                                    onClick={() => setIsFocusModalOpen(false)}
                                    className="size-10 rounded-xl glass hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-sm text-white/40">close</span>
                                </button>
                            </div>

                            {isAILoading ? (
                                <div className="py-20 flex flex-col items-center gap-5">
                                    <div className="relative">
                                        <div className="size-14 border-2 border-[#26d9d9]/20 rounded-full" />
                                        <div className="absolute inset-0 size-14 border-2 border-[#26d9d9] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                    <p className="text-white/25 text-sm font-medium">Analyzing your tasks...</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {focusTasks.length > 0 ? (
                                        focusTasks.map((item, idx) => (
                                            <div 
                                                key={idx} 
                                                className="task-enter p-5 rounded-2xl glass hover-lift group"
                                                style={{ animationDelay: `${idx * 80}ms` }}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-xl flex items-center justify-center text-sm font-bold"
                                                        style={{ background: "linear-gradient(135deg, rgba(38,217,217,0.15), rgba(16,185,129,0.1))", color: "#26d9d9" }}
                                                    >
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-[15px] group-hover:text-[#26d9d9] transition-colors">{item.title}</h4>
                                                        <p className="text-white/25 text-[13px] mt-1 leading-relaxed">{item.reason}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <span className="material-symbols-outlined text-4xl text-white/[0.06] block mb-3">psychology</span>
                                            <p className="text-white/20 text-sm">No tasks to analyze yet</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-8">
                                <button
                                    onClick={() => setIsFocusModalOpen(false)}
                                    className="w-full py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer glow-teal"
                                    style={{
                                        background: "linear-gradient(135deg, #26d9d9, #1ab3b3)",
                                        color: "#050a0a",
                                    }}
                                >
                                    Let&apos;s get to work
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* â”€â”€â”€ New Project Modal â”€â”€â”€ */}
            {isProjectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-4">
                    <div className="modal-enter w-full max-w-md rounded-2xl p-8 glass-strong shadow-2xl">
                        <h3 className="text-xl font-display italic mb-1">New project</h3>
                        <p className="text-sm text-white/25 mb-6">Organize tasks into focused workspaces</p>
                        <div className="space-y-5">
                            <div>
                                <label className="text-[11px] font-medium text-white/30 tracking-wide block mb-2">Name</label>
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-[#26d9d9]/40 transition-all placeholder:text-white/15"
                                    placeholder="e.g. Website Redesign"
                                    onKeyDown={(e) => e.key === "Enter" && createProject()}
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-medium text-white/30 tracking-wide block mb-3">Color</label>
                                <div className="flex gap-3">
                                    {["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#06b6d4"].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setNewProjectColor(color)}
                                            className="size-8 rounded-full transition-all cursor-pointer"
                                            style={{
                                                backgroundColor: color,
                                                boxShadow: newProjectColor === color ? `0 0 0 3px #050a0a, 0 0 0 5px ${color}, 0 0 20px ${color}40` : "none",
                                                transform: newProjectColor === color ? "scale(1.15)" : "scale(1)",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => { setIsProjectModalOpen(false); setNewProjectName(""); }}
                                className="flex-1 py-3 rounded-xl font-medium text-sm glass hover:bg-white/[0.06] transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createProject}
                                disabled={!newProjectName.trim()}
                                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-20 glow-teal"
                                style={{
                                    background: "linear-gradient(135deg, #26d9d9, #1ab3b3)",
                                    color: "#050a0a",
                                }}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* â”€â”€â”€ Sidebar â”€â”€â”€ */}
            <aside className="w-[260px] flex-shrink-0 flex flex-col justify-between py-6 px-4 glass-strong border-r border-white/[0.04]">
                <div className="flex flex-col gap-7">
                    {/* Logo */}
                    <div className="px-2">
                        <Logo className="size-9" textSize="text-lg" />
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-0.5">
                        <SidebarItem icon="space_dashboard" label="All Tasks" count={tasks.length}
                            active={showOnlyCompleted === null && activeProjectFilter === null}
                            onClick={() => { setShowOnlyCompleted(null); setActiveProjectFilter(null); }}
                        />
                        <SidebarItem icon="check_circle" label="Completed" count={completedCount}
                            active={showOnlyCompleted === true}
                            onClick={() => { setShowOnlyCompleted(true); setActiveProjectFilter(null); }}
                        />
                        <SidebarItem icon="schedule" label="Pending" count={pendingCount}
                            active={showOnlyCompleted === false}
                            onClick={() => { setShowOnlyCompleted(false); setActiveProjectFilter(null); }}
                        />

                        {/* Projects */}
                        <div className="mt-7 mb-2 flex items-center justify-between px-3">
                            <span className="text-[10px] font-medium text-white/20 tracking-widest uppercase">Projects</span>
                            <button
                                onClick={() => setIsProjectModalOpen(true)}
                                className="size-5 rounded-md glass hover:bg-[#26d9d9]/10 flex items-center justify-center transition-all cursor-pointer group"
                            >
                                <span className="material-symbols-outlined text-[13px] text-white/20 group-hover:text-[#26d9d9]">add</span>
                            </button>
                        </div>
                        {projects.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setActiveProjectFilter(activeProjectFilter === p.name ? null : p.name)}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all cursor-pointer group"
                                style={{
                                    background: activeProjectFilter === p.name ? "rgba(38,217,217,0.05)" : "transparent",
                                }}
                            >
                                <span
                                    className={`size-2.5 rounded-full transition-all ${activeProjectFilter === p.name ? "pulse-dot" : ""}`}
                                    style={{ backgroundColor: p.color }}
                                />
                                <span className={`text-[13px] ${activeProjectFilter === p.name ? "text-white font-medium" : "text-white/30 group-hover:text-white/50"}`}>
                                    {p.name}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* User Section */}
                <div
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group transition-all hover:bg-white/[0.03]"
                    onClick={handleLogout}
                >
                    <div className="relative">
                        <div className="size-9 rounded-xl flex items-center justify-center text-sm font-bold"
                            style={{ background: "linear-gradient(135deg, #26d9d9, #1ab3b3)", color: "#050a0a" }}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 border-2 border-[#050a0a]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate">{user.name}</p>
                        <p className="text-[10px] text-white/20 truncate">{user.email}</p>
                    </div>
                    <span className="material-symbols-outlined text-white/0 group-hover:text-white/20 text-[18px] transition-all">logout</span>
                </div>
            </aside>

            {/* â”€â”€â”€ Main Content â”€â”€â”€ */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
                {/* Particle Background */}
                <div className="fixed inset-0 z-0" style={{ left: "260px" }}>
                    <Particles
                        particleColors={["#26d9d9", "#ffffff"]}
                        particleCount={100}
                        particleSpread={12}
                        speed={0.05}
                        particleBaseSize={60}
                        alphaParticles={true}
                        moveParticlesOnHover={false}
                        disableRotation={false}
                    />
                </div>

                {/* Header â€” Greeting Hero */}
                <header className="sticky top-0 z-20 px-8 py-6 border-b border-white/[0.04]"
                    style={{ background: "rgba(5,10,10,0.8)", backdropFilter: "blur(20px)" }}
                >
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl font-display italic tracking-tight text-white/90">
                                {getGreeting()}, {user.name.split(" ")[0]}
                            </h1>
                            <p className="text-white/25 text-[13px] mt-1.5 font-medium">
                                {pendingCount === 0
                                    ? "All caught up â€” take a break âœ¨"
                                    : `${pendingCount} task${pendingCount > 1 ? "s" : ""} remaining Â· ${completedCount} completed`
                                }
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/15 text-[16px]">search</span>
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 glass rounded-xl text-[13px] w-52 outline-none focus:border-[#26d9d9]/20 focus:glow-teal transition-all placeholder:text-white/15"
                                    placeholder="Search..."
                                    type="text"
                                />
                            </div>
                            <button
                                onClick={openFocusMode}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer hover-lift"
                                style={{
                                    background: "linear-gradient(135deg, rgba(38,217,217,0.12), rgba(38,217,217,0.06))",
                                    border: "1px solid rgba(38,217,217,0.15)",
                                    color: "#26d9d9",
                                }}
                            >
                                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                Focus Mode
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="relative z-[1] flex-1 p-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Stat Cards â€” Gradient Glass */}
                            <div className="grid grid-cols-3 gap-4">
                                <StatCard label="Total" value={tasks.length} icon="assignment"
                                    gradient="linear-gradient(135deg, rgba(38,217,217,0.1), rgba(38,217,217,0.03))"
                                    glowColor="rgba(38,217,217,0.08)" iconColor="#26d9d9" />
                                <StatCard label="Done" value={completedCount} icon="check_circle"
                                    gradient="linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.03))"
                                    glowColor="rgba(16,185,129,0.08)" iconColor="#10b981" />
                                <StatCard label="Remaining" value={pendingCount} icon="pending"
                                    gradient="linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.03))"
                                    glowColor="rgba(245,158,11,0.08)" iconColor="#f59e0b" />
                            </div>

                            {/* Add Task â€” Floating Glass Bar */}
                            <div className="p-5 rounded-2xl glass hover:border-white/[0.08] transition-all group/add focus-within:glow-teal focus-within:border-[#26d9d9]/15">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className="size-8 rounded-lg flex items-center justify-center transition-all"
                                            style={{ background: "linear-gradient(135deg, rgba(38,217,217,0.12), rgba(38,217,217,0.05))" }}
                                        >
                                            <span className="material-symbols-outlined text-[#26d9d9] text-[16px]">
                                                {nlpEnabled ? "magic_button" : "add"}
                                            </span>
                                        </div>
                                        <input
                                            className="flex-1 bg-transparent text-[14px] font-medium placeholder:text-white/15 outline-none text-white/80"
                                            placeholder={nlpEnabled ? "e.g. Call John tomorrow 3pm high priority" : `Add a task${activeProjectFilter ? ` to ${activeProjectFilter}` : ""}...`}
                                            type="text"
                                            value={newTaskTitle}
                                            onChange={(e) => nlpEnabled ? handleNLPInput(e.target.value) : setNewTaskTitle(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addTask()}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setNlpEnabled(!nlpEnabled)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-wider transition-all cursor-pointer ${nlpEnabled ? "text-[#050a0a] glow-teal" : "glass text-white/25 hover:text-white/40"}`}
                                            style={nlpEnabled ? { background: "linear-gradient(135deg, #26d9d9, #1ab3b3)" } : {}}
                                        >
                                            NLP
                                        </button>
                                        <button
                                            onClick={handleAIBreakdown}
                                            disabled={isAILoading || !newTaskTitle.trim()}
                                            className="size-8 rounded-lg glass hover:bg-[#26d9d9]/10 hover:border-[#26d9d9]/15 flex items-center justify-center transition-all group disabled:opacity-15 cursor-pointer"
                                            title="AI Breakdown"
                                        >
                                            <span className="material-symbols-outlined text-[14px] text-white/25 group-hover:text-[#26d9d9]">
                                                {isAILoading ? "sync" : "temp_preferences_custom"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between pt-4 mt-4 border-t border-white/[0.04] gap-4">
                                    <div className="flex flex-wrap gap-3 items-center">
                                        <div className="flex glass rounded-lg p-0.5 gap-0.5 relative">
                                            {aiPrioritySuggestion && (
                                                <div 
                                                    className="absolute -top-11 left-0 animate-bounce cursor-pointer z-10" 
                                                    onClick={() => setNewTaskPriority(aiPrioritySuggestion)}
                                                >
                                                    <div className="text-[#050a0a] text-[9px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 glow-teal whitespace-nowrap"
                                                        style={{ background: "linear-gradient(135deg, #26d9d9, #1ab3b3)" }}
                                                    >
                                                        <span className="material-symbols-outlined text-[11px]">auto_awesome</span>
                                                        AI: {aiPrioritySuggestion === PRIORITY.HIGH ? "HIGH" : aiPrioritySuggestion === PRIORITY.LOW ? "LOW" : "MED"}
                                                    </div>
                                                </div>
                                            )}
                                            {(["Low", "Med", "High"] as const).map((label, idx) => {
                                                const val = [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH][idx];
                                                const dotColors = ["#64748b", "#f59e0b", "#ef4444"];
                                                const isActive = newTaskPriority === val;
                                                return (
                                                    <button
                                                        key={label}
                                                        onClick={() => setNewTaskPriority(val)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold rounded-md transition-all cursor-pointer"
                                                        style={{
                                                            background: isActive ? `${dotColors[idx]}15` : "transparent",
                                                            color: isActive ? dotColors[idx] : "rgba(255,255,255,0.25)",
                                                        }}
                                                    >
                                                        <span className="size-1.5 rounded-full" style={{ backgroundColor: dotColors[idx], opacity: isActive ? 1 : 0.4 }} />
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/20">
                                            <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                                            <input
                                                type="date"
                                                value={newTaskDate}
                                                onChange={(e) => setNewTaskDate(e.target.value)}
                                                className="bg-transparent border-none text-[11px] text-white/35 outline-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={addTask}
                                        disabled={isAdding || !newTaskTitle.trim()}
                                        className="px-5 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all cursor-pointer disabled:opacity-15 glow-teal hover-lift"
                                        style={{
                                            background: "linear-gradient(135deg, #26d9d9, #1ab3b3)",
                                            color: "#050a0a",
                                        }}
                                    >
                                        {isAdding ? (
                                            <span className="inline-block size-3 border-2 border-[#050a0a] border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            "Add Task"
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Task List â€” Grouped by Category */}
                            <div className="space-y-7">
                                {Object.keys(groupedTasks).length === 0 ? (
                                    <div className="text-center py-24">
                                        <span className="material-symbols-outlined text-5xl text-white/[0.04] block mb-4">inventory_2</span>
                                        <p className="text-white/20 text-sm font-medium">Nothing here yet</p>
                                        <p className="text-white/10 text-xs mt-1">Add your first task above to get started</p>
                                    </div>
                                ) : (
                                    Object.entries(groupedTasks).map(([category, categoryTasks]) => {
                                        const project = projects.find(p => p.name === category);
                                        const categoryColor = project?.color || "#26d9d9";
                                        return (
                                            <div key={category} className="fade-in">
                                                {/* Category Header */}
                                                <div className="flex items-center gap-3 mb-3 px-1">
                                                    <span className="size-2 rounded-full" style={{ backgroundColor: categoryColor }} />
                                                    <span className="text-[11px] font-semibold text-white/35 tracking-wide">{category}</span>
                                                    <span className="text-[10px] text-white/15 font-medium">{categoryTasks.length}</span>
                                                    <div className="flex-1 h-px bg-white/[0.03]" />
                                                </div>

                                                {/* Tasks */}
                                                <div className="space-y-1.5">
                                                    {categoryTasks.map((task, index) => (
                                                        <div
                                                            key={task.id}
                                                            onClick={() => toggleTask(task.id)}
                                                            className="task-enter group flex items-center gap-4 px-4 py-3.5 rounded-xl glass hover-lift cursor-pointer relative overflow-hidden"
                                                            style={{
                                                                opacity: task.completed ? 0.4 : 1,
                                                                animationDelay: `${index * 50}ms`,
                                                            }}
                                                        >
                                                            {/* Priority gradient left border */}
                                                            <div
                                                                className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
                                                                style={{ background: priorityConfig[task.priority].gradient }}
                                                            />

                                                            {/* Checkbox */}
                                                            <div
                                                                className={`flex items-center justify-center size-[18px] rounded-full border-[1.5px] transition-all flex-shrink-0 ml-1 ${task.completed ? "check-bounce" : ""}`}
                                                                style={{
                                                                    borderColor: task.completed ? "#10b981" : "rgba(255,255,255,0.1)",
                                                                    background: task.completed ? "#10b981" : "transparent",
                                                                }}
                                                            >
                                                                {task.completed && (
                                                                    <span className="material-symbols-outlined text-[10px] text-[#050a0a] font-bold">check</span>
                                                                )}
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <span className={`text-[13px] font-medium block leading-snug ${task.completed ? "line-through text-white/20" : "text-white/70 group-hover:text-white/90"}`}>
                                                                    {task.title}
                                                                </span>
                                                                <div className="flex items-center gap-2.5 mt-1">
                                                                    <span className="flex items-center gap-1 text-[9px] font-medium" style={{ color: `${priorityConfig[task.priority].color}90` }}>
                                                                        <span className="size-1.5 rounded-full" style={{ backgroundColor: priorityConfig[task.priority].color }} />
                                                                        {priorityConfig[task.priority].label}
                                                                    </span>
                                                                    {task.time && (
                                                                        <span className="text-[10px] text-white/15 flex items-center gap-1">
                                                                            <span className="material-symbols-outlined text-[9px]">schedule</span>
                                                                            {task.time}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Delete */}
                                                            <button
                                                                onClick={(e) => deleteTask(task.id, e)}
                                                                className="material-symbols-outlined text-white/0 group-hover:text-white/10 hover:!text-red-400/70 transition-all text-[15px] cursor-pointer"
                                                            >
                                                                close
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Right Column â€” Widgets */}
                        <div className="space-y-5">
                            {/* Progress Ring */}
                            <div className="p-6 rounded-2xl glass flex flex-col items-center">
                                <h3 className="text-[11px] font-medium text-white/20 tracking-wide mb-5 w-full">Progress</h3>
                                <div className="relative size-32 flex items-center justify-center">
                                    <svg className="size-full -rotate-90">
                                        <circle cx="64" cy="64" fill="transparent" r="56" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                                        <circle
                                            cx="64" cy="64" fill="transparent" r="56"
                                            stroke="url(#progressGrad)"
                                            strokeWidth="7"
                                            strokeDasharray={2 * Math.PI * 56}
                                            strokeDashoffset={2 * Math.PI * 56 * (1 - progressPercent / 100)}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                        <defs>
                                            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#26d9d9" />
                                                <stop offset="100%" stopColor="#10b981" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-white/80 tracking-tight">{progressPercent}%</span>
                                        <span className="text-[9px] text-white/15 font-medium tracking-wider mt-0.5">complete</span>
                                    </div>
                                </div>
                                <p className="text-[12px] text-white/20 mt-4 font-medium">
                                    {pendingCount === 0 ? "All done! âœ¨" : `${pendingCount} remaining`}
                                </p>
                            </div>

                            {/* Priority Breakdown */}
                            <div className="p-6 rounded-2xl glass">
                                <h3 className="text-[11px] font-medium text-white/20 tracking-wide mb-4">By priority</h3>
                                <div className="space-y-3">
                                    {[PRIORITY.HIGH, PRIORITY.MEDIUM, PRIORITY.LOW].map((p) => {
                                        const count = tasks.filter((t) => t.priority === p && !t.completed).length;
                                        const config = priorityConfig[p];
                                        const barWidth = tasks.length > 0 ? Math.max(4, (count / Math.max(pendingCount, 1)) * 100) : 0;
                                        return (
                                            <div key={p} className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="size-1.5 rounded-full" style={{ backgroundColor: config.color }} />
                                                        <span className="text-[11px] text-white/30">{config.label}</span>
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-white/40">{count}</span>
                                                </div>
                                                <div className="h-1 rounded-full bg-white/[0.03] overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                                        style={{ width: `${barWidth}%`, background: config.gradient }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* New Project CTA */}
                            <button
                                onClick={() => setIsProjectModalOpen(true)}
                                className="w-full py-3.5 rounded-2xl text-[11px] font-semibold tracking-wide transition-all cursor-pointer glass hover:bg-white/[0.04] flex items-center justify-center gap-2 group"
                            >
                                <span className="material-symbols-outlined text-[#26d9d9]/60 text-[16px] group-hover:rotate-90 transition-transform duration-300">add</span>
                                <span className="text-white/30 group-hover:text-white/50 transition-colors">New project</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* â”€â”€â”€ Sub-components â”€â”€â”€ */

function SidebarItem({ icon, label, count, active, onClick }: { icon: string; label: string; count?: number; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer relative"
            style={{ background: active ? "rgba(38,217,217,0.05)" : "transparent" }}
        >
            {/* Active indicator â€” glowing left bar */}
            {active && (
                <div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
                    style={{ background: "linear-gradient(180deg, #26d9d9, transparent)", boxShadow: "0 0 8px rgba(38,217,217,0.3)" }}
                />
            )}
            <span
                className="material-symbols-outlined text-[18px] transition-colors"
                style={{ color: active ? "#26d9d9" : "rgba(255,255,255,0.18)" }}
            >
                {icon}
            </span>
            <span className={`text-[13px] flex-1 text-left transition-colors ${active ? "text-white/90 font-medium" : "text-white/30"}`}>
                {label}
            </span>
            {count !== undefined && (
                <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-md transition-all"
                    style={{
                        background: active ? "rgba(38,217,217,0.1)" : "rgba(255,255,255,0.03)",
                        color: active ? "#26d9d9" : "rgba(255,255,255,0.2)",
                    }}
                >
                    {count}
                </span>
            )}
        </button>
    );
}

function StatCard({ label, value, icon, gradient, glowColor, iconColor }: {
    label: string; value: number; icon: string; gradient: string; glowColor: string; iconColor: string;
}) {
    return (
        <div
            className="p-4 rounded-2xl flex items-center gap-4 shimmer hover-lift transition-all"
            style={{
                background: gradient,
                border: `1px solid ${glowColor}`,
                boxShadow: `0 4px 20px ${glowColor}`,
            }}
        >
            <div className="size-10 rounded-xl flex items-center justify-center"
                style={{ background: `${iconColor}15` }}
            >
                <span className="material-symbols-outlined text-[18px]" style={{ color: iconColor }}>{icon}</span>
            </div>
            <div>
                <p className="text-2xl font-bold tracking-tight">{value}</p>
                <p className="text-[10px] text-white/25 font-medium tracking-wide">{label}</p>
            </div>
        </div>
    );
}

