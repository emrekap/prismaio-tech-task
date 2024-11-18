import { prisma } from "./prisma.server";
import { v4 as uuidv4 } from "uuid";

export type Entry = {
  id: string;
  content: string;
  createdAt: Date;
};

export const createGuestbookEntry = async (content: string, userId: string) => {
  // Generate uuid server side in order to reduce database load
  const id = uuidv4();
  return prisma.guestBookEntry.create({
    data: {
      id,
      content,
      userId,
    },
  });
};

export const deleteEntry = async (id: string) => {
  // Generate uuid server side in order to reduce database load
  return prisma.guestBookEntry.delete({
    where: { id },
  });
};
