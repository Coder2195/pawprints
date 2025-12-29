import { os } from "@orpc/server";
import { db } from "../db";

const ping = os.handler(async () => "ping").callable();
const pong = os.handler(async () => "pong").callable();
export const getPawprints = os
  .handler(async () => {
    return await db.query.pawprints.findMany({
      with: {
        author: {
          columns: {
            name: true,
          },
        },
      },
    });
  })
  .callable();

export const router = {
  ping,
  pong,
  getPawprints,
  nested: { ping, pong },
};
