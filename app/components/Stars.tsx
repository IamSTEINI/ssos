"use client"
import { useMemo } from "react";

const Stars = () => {
    const stars = useMemo(
        () =>
            Array.from({ length: 200 }, (_, i) => ({
                id: i,
                top: Math.random() * 100,
                left: Math.random() * 100,
                delay: Math.random() * 2,
            })),
        []
    );

    return (
        <div className="pointer-events-none fixed top-0 left-0 w-screen h-screen overflow-hidden z-0">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute w-px h-px text-sm text-green-200"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        animation: `sparkle 1.5s ease-in-out ${star.delay}s infinite`,
                    }}>
                    +
                </div>
            ))}
        </div>
    );
};

export default Stars;
