import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "TaskFlow — Modern Task Management",
    description:
        "TaskFlow helps you organize, track, and complete your tasks with a beautiful, modern interface. Boost your productivity with smart task management.",
    keywords: ["task management", "productivity", "organize", "taskflow"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;900&family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen antialiased">{children}</body>
        </html>
    );
}
