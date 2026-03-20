"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Particles from "@/components/ui/Particles";
import { Logo } from "@/components/ui/logo";

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
    user_id?: string;
    name: string;
    color: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string; id: string } | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("taskflow_user");
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            router.push("/login");
        }
    }, [router]);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch initial data
    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [tasksRes, projectsRes] = await Promise.all([
                    fetch(`/api/tasks?userId=${user.id}`),
                    fetch(`/api/projects?userId=${user.id}`)
                ]);
                
                if (tasksRes.ok && projectsRes.ok) {
                    const [tasksData, projectsData] = await Promise.all([
                        tasksRes.json(),
                        projectsRes.json()
                    ]);
                    setTasks(tasksData);
                    setProjects(projectsData);
                }
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

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = showOnlyCompleted === null ? true : task.completed === showOnlyCompleted;
            const matchesProject = activeProjectFilter === null ? true : task.category === activeProjectFilter;
            return matchesSearch && matchesStatus && matchesProject;
        });
    }, [tasks, searchQuery, showOnlyCompleted, activeProjectFilter]);

    const addTask = async () => {
        if (!newTaskTitle.trim() || !user) return;
        setIsAdding(true);

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newTaskTitle,
                    priority: newTaskPriority,
                    category: activeProjectFilter || "Inbox",
                    time: newTaskDate || null,
                    userId: user.id
                }),
            });

            if (res.ok) {
                const newTask = await res.json();
                setTasks([newTask, ...tasks]);
                setNewTaskTitle("");
                setNewTaskDate("");
                setNewTaskPriority(PRIORITY.MEDIUM);
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
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newProjectName,
                    color: newProjectColor,
                    userId: user.id
                }),
            });

            if (res.ok) {
                const newProj = await res.json();
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
            const res = await fetch("/api/tasks", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    completed: !task.completed,
                    userId: user.id
                }),
            });

            if (!res.ok) throw new Error("Failed to update task");
        } catch (error) {
            console.error("Error toggling task:", error);
            setTasks(originalTasks); // Revert on failure
        }
    };

    const deleteTask = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;

        // Optimistic update
        const originalTasks = [...tasks];
        setTasks(prev => prev.filter(t => t.id !== id));

        try {
            const res = await fetch(`/api/tasks?id=${id}&userId=${user.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete task");
        } catch (error) {
            console.error("Error deleting task:", error);
            setTasks(originalTasks); // Revert on failure
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("taskflow_user");
        router.push("/login");
    };

    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = tasks.filter((t) => !t.completed).length;
    const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    if (!user || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#050a0a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-10 border-2 border-[#26d9d9] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[#26d9d9]/60 text-sm">{loading ? "Fetching your workspace..." : "Redirecting to login..."}</span>
                </div>
            </div>
        );
    }

    const priorityConfig = {
        [PRIORITY.HIGH]: { label: "High", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
        [PRIORITY.MEDIUM]: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
        [PRIORITY.LOW]: { label: "Low", color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.2)" },
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#050a0a] text-white">
            {/* New Project Modal */}
            {isProjectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                    <div
                        className="w-full max-w-md rounded-2xl p-8 shadow-2xl border"
                        style={{
                            background: "linear-gradient(135deg, rgba(10,18,18,0.98), rgba(15,28,28,0.98))",
                            borderColor: "rgba(38,217,217,0.1)",
                        }}
                    >
                        <h3 className="text-xl font-bold mb-1">Create New Project</h3>
                        <p className="text-sm text-white/40 mb-6">Organize your tasks into focused workspaces</p>
                        <div className="space-y-5">
                            <div>
                                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider block mb-2">Project Name</label>
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#26d9d9]/50 focus:ring-1 focus:ring-[#26d9d9]/20 transition-all placeholder:text-white/20"
                                    placeholder="e.g. Website Redesign"
                                    onKeyDown={(e) => e.key === "Enter" && createProject()}
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider block mb-3">Color</label>
                                <div className="flex gap-3">
                                    {["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#06b6d4"].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setNewProjectColor(color)}
                                            className="size-8 rounded-full transition-all cursor-pointer"
                                            style={{
                                                backgroundColor: color,
                                                boxShadow: newProjectColor === color ? `0 0 0 3px rgba(5,10,10,1), 0 0 0 5px ${color}` : "none",
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
                                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createProject}
                                disabled={!newProjectName.trim()}
                                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-30"
                                style={{
                                    background: "linear-gradient(135deg, #26d9d9, #1ab3b3)",
                                    color: "#050a0a",
                                }}
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside
                className="w-[260px] flex-shrink-0 flex flex-col justify-between py-6 px-5 border-r"
                style={{
                    background: "linear-gradient(180deg, rgba(5,10,10,0.95), rgba(8,15,15,0.98))",
                    borderColor: "rgba(38,217,217,0.06)",
                }}
            >
                <div className="flex flex-col gap-7">
                    {/* Logo */}
                    <div className="px-2">
                        <Logo className="size-9" textSize="text-lg" />
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1">
                        <SidebarItem
                            icon="space_dashboard"
                            label="All Tasks"
                            count={tasks.length}
                            active={showOnlyCompleted === null && activeProjectFilter === null}
                            onClick={() => { setShowOnlyCompleted(null); setActiveProjectFilter(null); }}
                        />
                        <SidebarItem
                            icon="task_alt"
                            label="Completed"
                            count={completedCount}
                            active={showOnlyCompleted === true}
                            onClick={() => { setShowOnlyCompleted(true); setActiveProjectFilter(null); }}
                        />
                        <SidebarItem
                            icon="schedule"
                            label="Pending"
                            count={pendingCount}
                            active={showOnlyCompleted === false}
                            onClick={() => { setShowOnlyCompleted(false); setActiveProjectFilter(null); }}
                        />

                        {/* Projects section */}
                        <div className="mt-6 mb-2 flex items-center justify-between px-3">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Projects</span>
                            <button
                                onClick={() => setIsProjectModalOpen(true)}
                                className="size-5 rounded-md bg-white/5 hover:bg-[#26d9d9]/10 flex items-center justify-center transition-all cursor-pointer group"
                            >
                                <span className="material-symbols-outlined text-[14px] text-white/30 group-hover:text-[#26d9d9]">add</span>
                            </button>
                        </div>
                        {projects.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setActiveProjectFilter(activeProjectFilter === p.name ? null : p.name)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer"
                                style={{
                                    background: activeProjectFilter === p.name ? "rgba(38,217,217,0.06)" : "transparent",
                                }}
                            >
                                <span className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className={`text-sm ${activeProjectFilter === p.name ? "text-white font-semibold" : "text-white/40"}`}>
                                    {p.name}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* User section */}
                <div
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group transition-all hover:bg-white/5"
                    onClick={handleLogout}
                >
                    <div className="size-9 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ background: "linear-gradient(135deg, #26d9d9, #1ab3b3)", color: "#050a0a" }}
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-[10px] text-white/30 truncate">{user.email}</p>
                    </div>
                    <span className="material-symbols-outlined text-white/20 group-hover:text-red-400 text-lg transition-colors">logout</span>
                </div>
            </aside>

            {/* Main Content */}
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

                {/* Header */}
                <header
                    className="sticky top-0 z-20 px-8 py-5 flex items-center justify-between border-b"
                    style={{
                        background: "rgba(5,10,10,0.85)",
                        backdropFilter: "blur(20px)",
                        borderColor: "rgba(38,217,217,0.06)",
                    }}
                >
                    <div>
                        <h2 className="text-2xl font-bold">
                            {activeProjectFilter || "Workspace"}
                        </h2>
                        <p className="text-white/30 text-sm mt-0.5">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-lg">search</span>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-sm w-56 outline-none focus:border-[#26d9d9]/30 focus:bg-white/[0.07] transition-all placeholder:text-white/20"
                                placeholder="Search tasks..."
                                type="text"
                            />
                        </div>
                        <button
                            onClick={() => { setShowOnlyCompleted(null); setActiveProjectFilter(null); setSearchQuery(""); }}
                            className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-white/40 text-lg">tune</span>
                        </button>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="relative z-[1] flex-1 p-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
                        {/* Left Column — Tasks */}
                        <div className="space-y-6">
                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <StatCard label="Total Tasks" value={tasks.length} icon="assignment" color="#26d9d9" />
                                <StatCard label="Completed" value={completedCount} icon="check_circle" color="#10b981" />
                                <StatCard label="Pending" value={pendingCount} icon="pending" color="#f59e0b" />
                            </div>

                            {/* Add Task Card */}
                            <div
                                className="p-5 rounded-2xl border space-y-4"
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    borderColor: "rgba(38,217,217,0.08)",
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-[#26d9d9]/10 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[#26d9d9] text-lg">add_task</span>
                                    </div>
                                    <input
                                        className="flex-1 bg-transparent text-base font-medium placeholder:text-white/20 outline-none"
                                        placeholder={`Add a task${activeProjectFilter ? ` to ${activeProjectFilter}` : ""}...`}
                                        type="text"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addTask()}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/5 gap-4">
                                    <div className="flex flex-wrap gap-3 items-center">
                                        <div className="flex bg-white/5 rounded-lg p-0.5 gap-0.5">
                                            {(["LOW", "MED", "HIGH"] as const).map((label, idx) => {
                                                const val = [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH][idx];
                                                const colors = ["#6b7280", "#f59e0b", "#ef4444"];
                                                const isActive = newTaskPriority === val;
                                                return (
                                                    <button
                                                        key={label}
                                                        onClick={() => setNewTaskPriority(val)}
                                                        className="px-3 py-1.5 text-[10px] font-bold rounded-md transition-all cursor-pointer"
                                                        style={{
                                                            background: isActive ? `${colors[idx]}20` : "transparent",
                                                            color: isActive ? colors[idx] : "rgba(255,255,255,0.3)",
                                                        }}
                                                    >
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/30">
                                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                                            <input
                                                type="date"
                                                value={newTaskDate}
                                                onChange={(e) => setNewTaskDate(e.target.value)}
                                                className="bg-transparent border-none text-xs text-white/50 outline-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={addTask}
                                        disabled={isAdding || !newTaskTitle.trim()}
                                        className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-20"
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

                            {/* Task List */}
                            <div className="space-y-2">
                                {filteredTasks.length === 0 ? (
                                    <div className="text-center py-16">
                                        <span className="material-symbols-outlined text-4xl text-white/10 mb-3 block">inbox</span>
                                        <p className="text-white/20 text-sm">No tasks found</p>
                                    </div>
                                ) : (
                                    filteredTasks.map((task, index) => (
                                        <div
                                            key={task.id}
                                            onClick={() => toggleTask(task.id)}
                                            className="group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer"
                                            style={{
                                                background: task.completed ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.03)",
                                                borderColor: task.completed ? "rgba(255,255,255,0.03)" : "rgba(38,217,217,0.06)",
                                                opacity: task.completed ? 0.5 : 1,
                                                animationDelay: `${index * 50}ms`,
                                            }}
                                        >
                                            <div
                                                className="flex items-center justify-center size-5 rounded-full border-2 transition-all flex-shrink-0"
                                                style={{
                                                    borderColor: task.completed ? "#10b981" : "rgba(255,255,255,0.15)",
                                                    background: task.completed ? "#10b981" : "transparent",
                                                }}
                                            >
                                                {task.completed && (
                                                    <span className="material-symbols-outlined text-[12px] text-[#050a0a] font-bold">check</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className={`text-sm font-medium block ${task.completed ? "line-through text-white/30" : "text-white/80"}`}>
                                                    {task.title}
                                                </span>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span
                                                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md"
                                                        style={{
                                                            background: priorityConfig[task.priority].bg,
                                                            color: priorityConfig[task.priority].color,
                                                            border: `1px solid ${priorityConfig[task.priority].border}`,
                                                        }}
                                                    >
                                                        P{task.priority}
                                                    </span>
                                                    {task.time && (
                                                        <span className="text-[10px] text-white/25 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[11px]">calendar_today</span>
                                                            {task.time}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-white/20 px-2 py-0.5 rounded-md bg-white/5">{task.category}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => deleteTask(task.id, e)}
                                                className="material-symbols-outlined text-white/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-lg cursor-pointer"
                                            >
                                                delete
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Column — Widgets */}
                        <div className="space-y-6">
                            {/* Progress Ring */}
                            <div
                                className="p-6 rounded-2xl border flex flex-col items-center"
                                style={{
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(38,217,217,0.02))",
                                    borderColor: "rgba(38,217,217,0.08)",
                                }}
                            >
                                <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.15em] mb-6 w-full">Daily Focus</h3>
                                <div className="relative size-36 flex items-center justify-center">
                                    <svg className="size-full -rotate-90">
                                        <circle cx="72" cy="72" fill="transparent" r="62" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                                        <circle
                                            cx="72"
                                            cy="72"
                                            fill="transparent"
                                            r="62"
                                            stroke="url(#progressGradient)"
                                            strokeWidth="10"
                                            strokeDasharray={2 * Math.PI * 62}
                                            strokeDashoffset={2 * Math.PI * 62 * (1 - progressPercent / 100)}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                        />
                                        <defs>
                                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#26d9d9" />
                                                <stop offset="100%" stopColor="#10b981" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-white">{progressPercent}%</span>
                                        <span className="text-[9px] font-bold text-white/25 tracking-widest mt-0.5">COMPLETE</span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/30 mt-5">
                                    {pendingCount === 0 ? "All done! 🎉" : `${pendingCount} task${pendingCount > 1 ? "s" : ""} remaining`}
                                </p>
                            </div>

                            {/* Quick Stats */}
                            <div
                                className="p-6 rounded-2xl border"
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    borderColor: "rgba(38,217,217,0.08)",
                                }}
                            >
                                <h3 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.15em] mb-4">By Priority</h3>
                                <div className="space-y-3">
                                    {[PRIORITY.HIGH, PRIORITY.MEDIUM, PRIORITY.LOW].map((p) => {
                                        const count = tasks.filter((t) => t.priority === p && !t.completed).length;
                                        const config = priorityConfig[p];
                                        return (
                                            <div key={p} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full" style={{ backgroundColor: config.color }} />
                                                    <span className="text-xs text-white/40">{config.label}</span>
                                                </div>
                                                <span className="text-xs font-bold text-white/60">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* New Project Button */}
                            <button
                                onClick={() => setIsProjectModalOpen(true)}
                                className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all cursor-pointer border flex items-center justify-center gap-3 group"
                                style={{
                                    background: "linear-gradient(135deg, rgba(38,217,217,0.08), rgba(38,217,217,0.04))",
                                    borderColor: "rgba(38,217,217,0.15)",
                                }}
                            >
                                <span className="material-symbols-outlined text-[#26d9d9] text-lg group-hover:rotate-90 transition-transform duration-300">add</span>
                                <span className="text-[#26d9d9]">New Project</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ─── Sub-components ─── */

function SidebarItem({ icon, label, count, active, onClick }: { icon: string; label: string; count?: number; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer"
            style={{
                background: active ? "rgba(38,217,217,0.08)" : "transparent",
            }}
        >
            <span
                className="material-symbols-outlined text-lg"
                style={{ color: active ? "#26d9d9" : "rgba(255,255,255,0.25)" }}
            >
                {icon}
            </span>
            <span className={`text-sm flex-1 text-left ${active ? "text-white font-semibold" : "text-white/40"}`}>
                {label}
            </span>
            {count !== undefined && (
                <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{
                        background: active ? "rgba(38,217,217,0.15)" : "rgba(255,255,255,0.05)",
                        color: active ? "#26d9d9" : "rgba(255,255,255,0.3)",
                    }}
                >
                    {count}
                </span>
            )}
        </button>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
    return (
        <div
            className="p-4 rounded-xl border flex items-center gap-4"
            style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: `${color}15`,
            }}
        >
            <div
                className="size-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}12` }}
            >
                <span className="material-symbols-outlined text-lg" style={{ color }}>{icon}</span>
            </div>
            <div>
                <p className="text-2xl font-black">{value}</p>
                <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">{label}</p>
            </div>
        </div>
    );
}
