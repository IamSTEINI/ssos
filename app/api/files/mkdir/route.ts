import { NextResponse } from "next/server";
import { verifyToken } from "../../authGuard";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { token, folderName } = await req.json();

        if (!token) {
            return NextResponse.json(
                { success: false, error: "No token" },
                { status: 400 }
            );
        }

        if (!folderName) {
            return NextResponse.json(
                { success: false, error: "No folder name given" },
                { status: 400 }
            );
        }

        var valid = await verifyToken(token);
        if (!valid) {
            return NextResponse.json(
                { success: false, error: "Invalid token" },
                { status: 401 }
            );
        }

        const sanitizedName = folderName
            .toLowerCase()
            .replace(/[^a-z0-9_.-]/g, "");

        if (!sanitizedName || sanitizedName !== folderName) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Folder name contains invalid characters or spaces",
                },
                { status: 400 }
            );
        }

        // const newFolder = await prisma.file.create({
        //     data: {},
        //     select: {},
        // });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 }
        );
    }
}
