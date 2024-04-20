"use client";
import { useQuery } from "@tanstack/react-query";
import kratos from "../kratos";

export default function useCurrentSession() {
  return useQuery({
    queryKey: ["/sessions/@me"],
    queryFn: async () => {
      const { data } = await kratos.toSession({});
      return data;
    },
  });
}
