import prisma from "@/lib/prisma";
import { md5 } from "@/lib/calcs";

export async function verifyToken(token: string): Promise<boolean> {
    try {
        if (!token) return false;
        const users = await prisma.user.findMany();

        for (const user of users) {
            const input = user.astronautId + user.password;
            const expectedToken = md5(input);
            if (expectedToken ===token) {
                return true;
            }
        }

        return false;
    }catch (err) {
        return false;
    }
}
