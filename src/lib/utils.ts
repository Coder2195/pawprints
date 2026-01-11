import { QueryClient } from "@tanstack/react-query";

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const queryClient = new QueryClient();
