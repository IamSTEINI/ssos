import prisma from "@/lib/prisma";
import { md5 } from "@/lib/calcs";

export async function getUserByToken(token: string) {
	if (!token) return null;
	const users = await prisma.user.findMany();

	for (const user of users) {
		const expected = md5(user.astronautId + user.password);
		if (expected === token) return user;
	}

	return null;
}
