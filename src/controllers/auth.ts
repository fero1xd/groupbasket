import { Argon2id } from "oslo/password";
import { operations } from "../db/operations";
import type { LoginHandler, RegisterUserHandler } from "./types";
import { ApiError } from "../utils/errors";
import type { RequestHandler } from "express";
import { setSessionCookie } from "../auth/utils";

export const registerUser: RegisterUserHandler = async (req, res, next) => {
  const hashedPassword = await new Argon2id().hash(req.body.password);

  const { name, email, isAffiliate } = req.body;

  const dbUser = await operations.auth.createUser({
    name,
    email,
    password: hashedPassword,
    isAffiliate: typeof isAffiliate === "boolean" ? isAffiliate : false,
  });

  if (!dbUser) {
    return next(new ApiError(404, "Cannot create an account right now!"));
  }

  await setSessionCookie(dbUser, res);
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

  await setSessionCookie(dbUser, res);
  return res.send("Success");
};

export const createAffiliate = async () => {};

export const getMe: RequestHandler = (_req, res) => {
  return res.json({ me: res.locals.user });
};
