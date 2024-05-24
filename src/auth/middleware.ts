import type { RequestHandler } from "express";
import { lucia } from "./adapter";
import { ApiError } from "../utils/errors";
import { verifyRequestOrigin } from "lucia";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  // if (req.method !== "GET") {
  //   const originHeader = req.headers.origin ?? null;
  //   const hostHeader = req.headers.host ?? null;
  //   console.log(originHeader, hostHeader);
  //   if (
  //     !originHeader ||
  //     !hostHeader ||
  //     !verifyRequestOrigin(originHeader, [hostHeader])
  //   ) {
  //     return res.status(403).end();
  //   }
  // }

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

export const assureAdmin: RequestHandler = async (_req, res, next) => {
  if (!res.locals.user?.isAdmin) {
    return next(new ApiError(401, "not authorized"));
  }

  return next();
};
export const assureAffiliate: RequestHandler = async (_req, res, next) => {
  if (!res.locals.user?.isAffiliate && !res.locals.user?.isAdmin) {
    return next(new ApiError(401, "not authorized"));
  }

  return next();
};
