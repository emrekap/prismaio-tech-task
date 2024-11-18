import { Prisma, prisma } from "./prisma.server";
import { v4 as uuidv4 } from "uuid";

export type Entry = Prisma.$GuestBookEntryPayload["scalars"];

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

export const updateGuestbookEntry = async (
  content: string,
  entryId: string
) => {
  return prisma.guestBookEntry.update({
    data: {
      content,
    },
    where: { id: entryId },
  });
};

export const deleteGuestbookEntry = async (id: string) => {
  // Generate uuid server side in order to reduce database load
  return prisma.guestBookEntry.delete({
    where: { id },
  });
};
