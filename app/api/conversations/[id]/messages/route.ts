import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const MAX_MESSAGE_LIMIT = 100;

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const body = await request.json();

  if (!id) {
    return new Response("Invalid request", { status: 400 });
  }

  const { message, userId } = body;

  if (!message || !userId) {
    return new Response("Invalid request", { status: 400 });
  }

  const newMessage = await prisma.message.create({
    data: {
      text: message,
      user_id: userId,
      conversation_id: +id,
    },
  });

  return Response.json(newMessage);
};

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const page = +(request.nextUrl.searchParams.get("page") || 1);
  const messages = await prisma.message.findMany({
    where: {
      conversation_id: +id,
    },
    orderBy: { id: "desc" },
    take: MAX_MESSAGE_LIMIT,
    skip: page * MAX_MESSAGE_LIMIT,
  });

  return Response.json(messages);
};
