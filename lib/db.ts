import {PrismaClient} from '@prisma/client';

declare global {
  // allow global `var` declarations
    const prisma: PrismaClient | undefined;
}
// allow global `let` and `const` declarations

export const db = globalThis.prisma || new PrismaClient();


if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}