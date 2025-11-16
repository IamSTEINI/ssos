import { NextResponse } from "next/server";
import { verifyToken } from "../../authGuard";
import prisma from "@/lib/prisma";
import { getUserByToken } from "../../tools";

export async function POST(req: Request) {
	try {
		const { token, path } = await req.json();

		if (!token) {
			return NextResponse.json(
				{ success: false, error: "No token" },
				{ status: 400 }
			);
		}

		if (!path) {
			return NextResponse.json(
				{ success: false, error: "Path missing" },
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

		const normalized = path.trim();

		const sanitized = normalized
			.toLowerCase()
			.replace(/[^a-z0-9_.\/\-]/g, "");

		const folderName = sanitized;

		if (!sanitized || sanitized !== normalized.toLowerCase()) {
			return NextResponse.json(
				{
					success: false,
					error: "path contains invalid characters or spaces",
				},
				{ status: 400 }
			);
		}

		const astronautId = user.astronautId;

		const target =
			folderName === "/" ? "" : folderName.replace(/^\/+|\/+$/g, "");

		if (target) {
			const exists = await prisma.file.findFirst({
				where: { path: target, astronautId, isFolder: true },
			});
			if (!exists) {
				return NextResponse.json(
					{ success: false, error: "Path does not exist" },
					{ status: 404 }
				);
			}
		}

		const all = await prisma.file.findMany({ where: { astronautId } });
		const items = all.filter((f: { path: string }) => {
			const p = f.path;
			if (!target) return !p.includes("/");
			if (!p.startsWith(target + "/")) return false;
			const rest = p.slice(target.length + 1);
			return rest.length > 0 && !rest.includes("/");
		});

		return NextResponse.json({ success: true, items }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ success: false, error: "Server error" },
			{ status: 500 }
		);
	}
}
