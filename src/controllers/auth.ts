import { Argon2id } from "oslo/password";
import { operations } from "../db/operations";
import type { LoginHandler, RegisterUserHandler } from "./types";
import { lucia } from "../auth/adapter";
import { ApiError } from "../utils/errors";
import type { RequestHandler } from "express";

export const registerUser: RegisterUserHandler = async (req, res, next) => {
  const hashedPassword = await new Argon2id().hash(req.body.password);

  const dbUser = await operations.auth.createUser({
    ...req.body,
    password: hashedPassword,
  });

  if (!dbUser) {
    return next(new ApiError(404, "Cannot create an account right now!"));
  }

  const { id, name, email, isAdmin, isAffiliate } = dbUser;

  const session = await lucia.createSession(id, {
    name,
    email,
    isAdmin,
    isAffiliate,
  });

  const sessionCookie = await lucia.createSessionCookie(session.id);
  res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return res.send("Success");
};

export const login: LoginHandler = async (req, res, next) => {
  const dbUser = await operations.auth.getUser(req.body.email);

  if (!dbUser) {
    return next(new ApiError(404, "invalid credentials"));
  }

  const validPassword = await new Argon2id().verify(
    dbUser.password,
    req.body.password
  );
  if (!validPassword) {
    return next(new ApiError(404, "invalid credentials"));
  }

  const { id, name, email, isAdmin, isAffiliate } = dbUser;
  const session = await lucia.createSession(id, {
    name,
    email,
    isAdmin,
    isAffiliate,
  });

  const sessionCookie = await lucia.createSessionCookie(session.id);
  res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return res.send("Success");
};

export const getMe: RequestHandler = (_req, res) => {
  return res.json({ me: res.locals.user });
};
