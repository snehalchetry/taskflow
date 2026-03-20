"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const NebulaCube = dynamic(
    () => import("@/components/ui/explorations-with-gsap-and-scroll-trigger").then(mod => ({ default: mod.NebulaCube })),
    { ssr: false }
);

export default function Home() {
    return (
        <main className="relative">
            {/* Fixed navigation overlay */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-3">
                    <div className="bg-[#ea2a33] size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#ea2a33]/20">
                        <span className="material-symbols-outlined font-bold text-lg">layers</span>
                    </div>
                    <span className="text-white text-lg font-black tracking-tight uppercase">TaskFlow</span>
                </div>
                <div className="flex items-center gap-5">
                    <a
                        href="https://github.com/snehalchetry/taskflow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                        GitHub
                    </a>
                    <Link
                        href="/login"
                        className="bg-[#26d9d9] text-[#0a0a0a] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#26d9d9]/90 transition-all shadow-lg shadow-[#26d9d9]/20"
                    >
                        Get Started →
                    </Link>
                </div>
            </nav>

            {/* NebulaCube scroll experience */}
            <NebulaCube />
        </main>
    );
}
