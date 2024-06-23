import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import * as z from "zod";

const SignInSchema = z.object({
  email: z.string().email(),
  name: z.string(),
}) satisfies z.Schema<Omit<User, "id">>;

export const POST = async (request: Request) => {
  const { email, name } = SignInSchema.parse(await request.json());

  const user = await prisma.user.findFirst({ where: { email } });

  if (user) {
    return new Response("User already exists", { status: 400 });
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
    },
  });

  return Response.json({ user: newUser });
};
