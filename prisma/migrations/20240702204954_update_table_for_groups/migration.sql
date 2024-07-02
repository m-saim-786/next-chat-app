-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'image');

-- CreateEnum
CREATE TYPE "MessageActorType" AS ENUM ('user', 'system', 'bot');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "message_actor_type" "MessageActorType" NOT NULL DEFAULT 'user',
ADD COLUMN     "message_type" "MessageType" NOT NULL DEFAULT 'text';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT;
