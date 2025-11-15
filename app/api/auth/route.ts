import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function randomAstronautId() {
    return String(
        Math.floor(100000000000000 + Math.random() * 900000000000000)
    );
}

export async function POST(req: Request) {
    try {
        const { input } = await req.json();
        if (!input || typeof input !== "string") {
            return NextResponse.json(
                { success: false, error: "No input" },
                { status: 400 }
            );
        }

        const isId = input.includes("+");
        const [castronautId, cpassword] = input.includes("+")
            ? input.split("+")
            : [input, null];

        if (isId) {
            if (!cpassword) {
                return NextResponse.json(
                    { success: false, error: "Password required" },
                    { status: 400 }
                );
            }
            const user = await prisma.user.findUnique({
                where: { astronautId: castronautId, password: cpassword },
            });

            if (user) {
                return NextResponse.json({
                    success: true,
                    astronautId: castronautId,
                });
            } else {
                return NextResponse.json(
                    { success: false, error: "Invalid password" },
                    { status: 400 }
                );
            }
        }

        const password = input;
        const passwordRegex = /^[a-zA-Z0-9!$&]+$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Password can only contain a-zA-Z0-9 and ! $ &",
                },
                { status: 400 }
            );
        }
        let astronautId = randomAstronautId();
        let tries = 0;
        while (tries < 10) {
            const existing = await prisma.user.findUnique({
                where: { astronautId },
            });
            if (!existing) break;
            astronautId = randomAstronautId();
            tries++;
        }
        if (tries >= 10) {
            return NextResponse.json(
                { success: false, error: "Could not generate astronaut id" },
                { status: 500 }
            );
        }

        const user = await prisma.user.create({
            data: { astronautId, password: password },
            select: { astronautId: true, createdAt: true },
        });

        return NextResponse.json(
            { success: true, astronautId: user.astronautId },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}
