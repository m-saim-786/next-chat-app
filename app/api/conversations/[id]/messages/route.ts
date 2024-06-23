import { prisma } from "@/lib/prisma";
import { socket } from "@/socket";

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

  const conversation = await prisma.conversation.update({
    where: { id: +id },
    data: {
      messages: {
        create: {
          text: message,
          user_id: userId,
        },
      },
    },
  });

  return Response.json(conversation);
};
