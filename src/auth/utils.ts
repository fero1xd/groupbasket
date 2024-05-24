import type { User } from "lucia";
import type { Response } from "express";
import { lucia } from "./adapter";
import type { RawUser } from "../db/zod";

export const setSessionCookie = async (user: RawUser, res: Response) => {
  const { id, name, email, isAdmin, isAffiliate } = user;
  const session = await lucia.createSession(id, {
    name,
    email,
    isAdmin,
    isAffiliate,
  });

  const cookie = lucia.createSessionCookie(session.id);

  res.cookie(cookie.name, cookie.value, cookie.attributes);
};
