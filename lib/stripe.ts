import "server-only";
import Stripe from "stripe";
import { stripeSecretKey } from "@/lib/env";

let client: Stripe | undefined;

export function stripe() {
  client ??= new Stripe(stripeSecretKey(), { appInfo: { name: "SquidOps" } });
  return client;
}
