import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import parseLinkHeader from "parse-link-header";
import { DEFAULT_PAGE_SIZE } from "../constants";
import kratos from "../kratos";

export default function useSessions() {
  return useSuspenseInfiniteQuery({
    queryKey: ["sessions"],
    queryFn: async ({ pageParam }) => {
      const { data, headers } = await kratos.listMySessions({
        pageSize: DEFAULT_PAGE_SIZE,
        pageToken: pageParam === "" ? undefined : pageParam,
      });

      const linkHeader = headers.link || "";

      const links = parseLinkHeader(linkHeader);

      return {
        sessions: data,
        pageMeta: {
          next: links?.next?.page_token,
          first: links?.first?.page_token,
        },
      };
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.pageMeta.next ?? null,
  });
}
