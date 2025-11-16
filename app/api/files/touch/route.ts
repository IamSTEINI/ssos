import { NextResponse } from "next/server";
import { verifyToken } from "../../authGuard";
import prisma from "@/lib/prisma";
import { getUserByToken } from "../../tools";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
	try {
		const { token, filePath, content } = await req.json();
		if (!token) {
			return NextResponse.json(
				{ success: false, error: "No token" },
				{ status: 400 }
			);
		}

		if (!filePath) {
			return NextResponse.json(
				{ success: false, error: "No file path given" },
				{ status: 400 }
			);
		}
		const valid = await verifyToken(token);
		if (!valid) {
			return NextResponse.json(
				{ success: false, error: "Invalid token" },
				{ status: 401 }
			);
		}

		const user = await getUserByToken(token);
		if (!user) {
			return NextResponse.json(
				{ success: false, error: "Invalid token" },
				{ status: 401 }
			);
		}

		const normalized = filePath.trim();
		const sanitized = normalized
			.toLowerCase()
			.replace(/[^a-z0-9_.\/\-]/g, "");

		if (!sanitized || sanitized !== normalized.toLowerCase()) {
			return NextResponse.json(
				{
					success: false,
					error: "File path contains invalid character or spaces",
				},
				{ status: 400 }
			);
		}

		const requestedParts = sanitized.split("/").filter(Boolean);
		if (requestedParts.length === 0) {
			return NextResponse.json(
				{ success: false, error: "Invalid file name" },
				{ status: 400 }
			);
		}

		const astronautId = user.astronautId;

		const finalParts =
			requestedParts.length === 1
				? ["home", astronautId, ...requestedParts]
				: requestedParts;

		if (new Set(finalParts).size !== finalParts.length) {
			return NextResponse.json(
				{
					success: false,
					error: "File path contains duplicate segment",
				},
				{ status: 400 }
			);
		}

		if (finalParts.length > 1) {
			for (let i = 0; i < finalParts.length - 1; i++) {
				const prefix = finalParts.slice(0, i + 1).join("/");
				const existing = await prisma.file.findFirst({
					where: { path: prefix, isFolder: true },
				});
				if (!existing) {
					return NextResponse.json(
						{
							success: false,
							error: `Parent folder "${prefix}" does not exist`,
						},
						{ status: 400 }
					);
				}
			}
		}

		const finalPath = finalParts.join("/");

		const existingTarget = await prisma.file.findFirst({
			where: { path: finalPath },
		});
		if (existingTarget) {
			return NextResponse.json(
				{ success: false, error: "Path already exists" },
				{ status: 409 }
			);
		}

		const file = await prisma.file.create({
			data: {
				path: finalPath,
				isFolder: false,
				astronautId,
			},
			select: {
				id: true,
				path: true,
				isFolder: true,
				astronautId: true,
				createdAt: true,
			},
		});

		if (!file) {
			return NextResponse.json(
				{ success: false, error: "Failed to create file" },
				{ status: 500 }
			);
		}

		try {
			const dataDir = path.join(process.cwd(), "data");
			await fs.mkdir(dataDir, { recursive: true });
			const storePath = path.join(dataDir, "file_cons.json");
			let store: Record<string, string> = {};
			try {
				const txt = await fs.readFile(storePath, "utf-8");
				store = JSON.parse(txt || "{}");
			} catch (e) {
				store = {};
			}
			store[finalPath] =
				typeof content === "string" ? content : String(content || "");
			await fs.writeFile(
				storePath,
				JSON.stringify(store, null, 2),
				"utf-8"
			);
		} catch (err) {
			console.error("failed to write content store", err);
		}

		return NextResponse.json({ success: true, file }, { status: 201 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ success: false, error: "Server error" },
			{ status: 500 }
		);
	}
}
