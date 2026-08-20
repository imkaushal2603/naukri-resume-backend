import { Cashfree, CFEnvironment } from "cashfree-pg";

const environment =
  process.env.CASHFREE_ENV == "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

export const cashfree = new Cashfree(
  environment,
  process.env.CASHFREE_APP_ID!,
  process.env.CASHFREE_SECRET_KEY!
);