import { auth } from ".";

export async function getServerSession(headers: Headers) {
  if (!headers) return null;
  return auth.api.getSession({
    headers, // you need to pass the headers object.
  });
}
