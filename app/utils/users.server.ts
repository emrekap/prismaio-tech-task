import { prisma } from "./prisma.server";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { Entry } from "./guestbook-entry.server";

export type User = Prisma.$UserPayload["scalars"] & {
  entryCount: number;
};

export type UserWithEntries = User & {
  entries: Entry[];
};

export const createUser = async (data: Omit<Prisma.UserCreateInput, "id">) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  // Generate uuid server side in order to reduce database load
  const id = uuidv4();
  return prisma.user.create({
    data: {
      id,
      ...data,
    },
  });
};

export const getUserById = async (userId: string) => {
  return prisma.user.findFirst({
    include: {
      _count: true,
      entries: true,
    },
    where: {
      id: userId,
    },
  });
};

export const getUsers = async ({
  sortFilter,
  whereFilter,
}: {
  sortFilter?: Prisma.UserOrderByWithRelationInput;
  whereFilter?: Prisma.UserWhereInput;
}): Promise<User[]> => {
  const users = await prisma.user.findMany({
    include: {
      _count: true,
    },
    orderBy: sortFilter,
    where: whereFilter,
  });

  return users.map((user) => ({
    ...user,
    entryCount: user._count.entries,
  }));
};

export const updateUser = async (
  id: string,
  data: { firstName: string; lastName: string; thumbnailUrl: string }
) => {
  return prisma.user.update({
    data,
    where: { id },
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};
