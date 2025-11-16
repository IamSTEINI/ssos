"use client";
import React, { useEffect, useState } from "react";
import Stars from "./Stars";

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthCheck({ children }: AuthGuardProps) {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("astronaut_token");

            if (!token) {
                window.location.href = "/";
                return;
            }

            const response = await fetch("/api/auth/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data = await response.json();
            if (!data.success) {
                window.location.href = "/";
                localStorage.removeItem("astronaut_token");
            } else {
                localStorage.setItem("astronautId", data.astronautId)
                setAuthenticated(true);
            }
        };

        checkAuth();
    }, []);

    return authenticated ? (
        <>{children}</>
    ) : (
        <div className="w-screen h-screen fixed flex flex-col items-center justify-center">
            <Stars />
            <h1 className="font-black italic text-[120px] z-10">SSOS</h1>
            <span className="z-10">SIEGE SPACE OS v3.2</span>
            <h2 className="font-thin text-xl positive-color z-10 mt-2 animate-pulse">
                Checking authentication...
            </h2>
        </div>
    );
}
