-- CreateEnum
CREATE TYPE "ConversationUserRole" AS ENUM ('member', 'admin');

-- AlterTable
ALTER TABLE "ConversationUser" ADD COLUMN     "user_role" "ConversationUserRole" NOT NULL DEFAULT 'member';
