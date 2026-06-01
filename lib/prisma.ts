/* eslint-disable no-var */
import { PrismaClient } from "../generated/client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
  prisma = new PrismaClient({ adapter });
} else {
  // Prevent multiple instantiations of Prisma Client in development hot reloading
  if (!globalThis.prisma) {
    const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
    globalThis.prisma = new PrismaClient({ adapter });
  }
  prisma = globalThis.prisma;
}

export default prisma;
