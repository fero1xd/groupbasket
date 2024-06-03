import { operations } from "../db/operations";
import { ApiError } from "../utils/errors";
import type {
  CreateAffiliateLink,
  GetAffilateLinks,
  GetAffiliateOrders,
} from "./types";

export const createAffiliateLink: CreateAffiliateLink = async (
  req,
  res,
  next,
) => {
  req.body.expiresAt = new Date(req.body.expiresAt);
  const link = await operations.affiliate.create(req.body, res.locals.user!.id);
  if (!link) {
    return next(new ApiError(400, "failed to create your affiliate link"));
  }

  return res.json({
    link,
  });
};

export const getMyAffiliateLinks: GetAffilateLinks = async (_req, res) => {
  const links = await operations.affiliate.getAllForUser(res.locals.user!.id);

  await Promise.all(
    links.map(async (l) => {
      const res = await operations.affiliate.countAffiliateOrders(l.id);
      // @ts-expect-error
      l.count = res[0]?.count;
    }),
  );

  return res.json({
    links,
  });
};

export const getAffiliateOrders: GetAffiliateOrders = async (req, res) => {
  const orders = await operations.affiliate.getAffiliateOrders(req.params.id);
  return res.json({ orders });
};
