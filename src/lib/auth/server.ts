import { auth } from "./"; // path to your Better Auth server instance
import { headers } from "next/headers";

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
}
