"use client";

import React from "react";

interface LogoProps {
    className?: string;
    showText?: boolean;
    textSize?: string;
}

export const Logo = ({ className = "size-10", showText = true, textSize = "text-lg" }: LogoProps) => {
    return (
        <div className="flex items-center gap-3">
            <div className={`${className} bg-gradient-to-br from-[#26d9d9] to-[#1ab3b3] rounded-xl flex items-center justify-center text-[#050a0a] shadow-lg shadow-[#26d9d9]/20 transition-transform hover:scale-105 active:scale-95`}>
                <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-3/5"
                >
                    <path
                        d="M 7 20 L 14 27 L 33 8 M 27 8 L 33 8 L 33 14"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                    />
                </svg>
            </div>
            {showText && (
                <span className={`${textSize} text-white font-black tracking-tight uppercase`}>
                    TaskFlow
                </span>
            )}
        </div>
    );
};
