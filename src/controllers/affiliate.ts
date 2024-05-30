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
  next
) => {
  const link = await operations.affiliate.create(req.body, res.locals.user!.id);
  if (!link) {
    return next(new ApiError(400, "failed to create your affiliate link"));
  }

  return res.json({
    link,
  });
};

export const getMyAffiliateLinks: GetAffilateLinks = async (req, res) => {
  const links = await operations.affiliate.getAllForUser(res.locals.user!.id);

  return res.json({
    links,
  });
};

export const getAffiliateOrders: GetAffiliateOrders = async (req, res) => {
  const orders = await operations.affiliate.getAffiliateOrders(req.params.id);
  return res.json({ orders });
};
