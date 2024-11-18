import { z } from "zod";
import { UserGenderEnum } from "./prisma.server";

export const updateUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  thumbnailUrl: z.string().url(),
});

export type UpdateUserInputError = {
  _errors: [];
  firstName: { _errors: string[] };
  lastName: { _errors: string[] };
  thumbnailUrl: { _errors: string[] };
};

export const createUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  thumbnailUrl: z.string().url(),
  gender: z.nativeEnum(UserGenderEnum), // Uses prisma generated type for validation
});

export type CreateUserInputError = {
  _errors: [];
  firstName: { _errors: string[] };
  lastName: { _errors: string[] };
  email: { _errors: string[] };
  thumbnailUrl: { _errors: string[] };
};

export const createGuestBookSchema = z.object({
  comment: z.string().min(3),
});

export type CreateGuestBookInputError = {
  _errors: [];
  comment: { _errors: string[] };
};

export const updateGuestBookSchema = z.object({
  entryId: z.string().uuid(),
  comment: z.string().min(3),
});

export type UpdateGuestBookInputError = {
  _errors: [];
  comment: { _errors: string[] };
  entryId: { _errors: string[] };
};
