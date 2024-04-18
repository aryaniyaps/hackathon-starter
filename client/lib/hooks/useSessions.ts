import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import parseLinkHeader from "parse-link-header";
import { DEFAULT_PAGE_SIZE } from "../constants";
import kratos from "../kratos";

export default function useSessions() {
  return useSuspenseInfiniteQuery({
    queryKey: ["/sessions"],
    queryFn: async ({ pageParam }) => {
      console.log("FETCHING DATA...", pageParam);
      const { data, headers } = await kratos.listMySessions({
        pageSize: DEFAULT_PAGE_SIZE,
        pageToken: pageParam,
      });

      console.log("LENGTH OF FETCHED DATA: ", data.length);

      const linkHeader = headers.link;

      const links = parseLinkHeader(linkHeader);

      return {
        sessions: data,
        pageMeta: {
          nextPageToken: links?.next?.page_token,
          nextPage: links?.next?.page,
        },
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pageMeta.nextPageToken,
  });
}
