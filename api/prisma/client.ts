import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// (async () => {
//     await prisma.menu.deleteMany()
// })()
export default prisma;
    