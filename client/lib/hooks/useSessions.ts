import { useInfiniteQuery } from "@tanstack/react-query";
import parseLinkHeader from "parse-link-header";
import { DEFAULT_PAGE_SIZE } from "../constants";
import kratos from "../kratos";

export default function useSessions() {
  return useInfiniteQuery({
    queryKey: ["/sessions"],
    queryFn: async ({ pageParam }) => {
      const { data, headers } = await kratos.listMySessions({
        pageSize: DEFAULT_PAGE_SIZE,
        pageToken: pageParam,
      });

      const linkHeader = headers.link;

      const links = parseLinkHeader(linkHeader);

      return {
        sessions: data,
        nextPageToken: links?.next?.page_token,
      };
    },
    initialPageParam: "1",
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
  });
}
