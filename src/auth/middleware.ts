import type { RequestHandler } from "express";
import { lucia } from "./adapter";
import { ApiError } from "../utils/errors";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    return next(new ApiError(401, "not authenticated"));
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
  }

  if (!session) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize()
    );

    return next(new ApiError(401, "not authenticated"));
  }
  res.locals.session = session;
  res.locals.user = user;

  return next();
};
