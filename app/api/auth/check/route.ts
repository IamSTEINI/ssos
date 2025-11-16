import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { md5 } from "@/lib/calcs";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { success: false, error: "No token" },
                { status: 400 }
            );
        }

        const users = await prisma.user.findMany();

        for (const user of users) {
            const input = user.astronautId + user.password;
            const expectedToken = md5(input);
            if (expectedToken == token) {
                return NextResponse.json(
                    { success: true, astronautId: user.astronautId },
                    { status: 200 }
                );
            }
        }

        return NextResponse.json(
            { success: false, error: "Invalid token" },
            { status: 401 }
        );
    } catch (err) {
        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}
