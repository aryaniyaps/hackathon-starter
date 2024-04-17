"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useCurrentSession() {
  return useSuspenseQuery({
    queryKey: ["/sessions/@me"],
    queryFn: async () => {
      try {
        console.log("EXECUTING THIS ON SERVER? ");
        const { data } = await kratos.toSession();
        return data;
      } catch (err) {
        console.log("ERRORRRRRRRR");
        console.error(err);
        throw err;
      }
    },
  });
}
