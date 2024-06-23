import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient;
export function getClient(): PrismaClient {

  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }

  return prismaInstance;
}

export const prisma = getClient();
