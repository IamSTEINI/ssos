import { NextResponse } from "next/server";
import { verifyToken } from "../../authGuard";
import prisma from "@/lib/prisma";
import { getUserByToken } from "../../tools";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
	try {
		const { token, path: filePath } = await req.json();

		if (!token)
			return NextResponse.json(
				{ success: false, error: "No token" },
				{ status: 400 }
			);
		if (!filePath)
			return NextResponse.json(
				{ success: false, error: "path missing" },
				{ status: 400 }
			);

		const valid = await verifyToken(token);
		if (!valid)
			return NextResponse.json(
				{ success: false, error: "Invalid token" },
				{ status: 401 }
			);

		const user = await getUserByToken(token);
		if (!user)
			return NextResponse.json(
				{ success: false, error: "Invalid token" },
				{ status: 401 }
			);

		const normalized = filePath.trim();
		const sanitized = normalized
			.toLowerCase()
			.replace(/[^a-z0-9_.\/\-]/g, "");
		if (!sanitized || sanitized !== normalized.toLowerCase()) {
			return NextResponse.json(
				{
					success: false,
					error: "path contains invalid characters or spaces",
				},
				{ status: 400 }
			);
		}

		const requestedParts = sanitized.split("/").filter(Boolean);
		if (requestedParts.length === 0)
			return NextResponse.json(
				{ success: false, error: "Invalid file path" },
				{ status: 400 }
			);

		const astronautId = user.astronautId;
		const finalParts =
			requestedParts.length === 1
				? ["home", astronautId, ...requestedParts]
				: requestedParts;
		const finalPath = finalParts.join("/");

		const file = await prisma.file.findFirst({
			where: { path: finalPath, astronautId, isFolder: false },
		});
		if (!file)
			return NextResponse.json(
				{ success: false, error: "File not found" },
				{ status: 404 }
			);

		try {
			const storePath = path.join(
				process.cwd(),
				"data",
				"file_cons.json"
			);
			const txt = await fs.readFile(storePath, "utf-8");
			const store = JSON.parse(txt || "{}");
			const content = store[finalPath] || "";
			return NextResponse.json(
				{ success: true, content },
				{ status: 200 }
			);
		} catch (err) {
			console.error(err);
			return NextResponse.json(
				{ success: true, content: "" },
				{ status: 200 }
			);
		}
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ success: false, error: "Server error" },
			{ status: 500 }
		);
	}
}
