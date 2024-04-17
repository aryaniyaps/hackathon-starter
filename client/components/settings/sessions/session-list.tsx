"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import kratos from "@/lib/kratos";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import RevokeOtherSessionsDialog from "./revoke-other-sessions-dialog";
import SessionCard from "./session-card";

// TODO: handle empty state (no other active sessions)
export default function SessionList() {
  const [page, setPage] = useState(0);

  async function fetchSessions(page = 0) {
    const data = await kratos.listMySessions({
      pageSize: 5,
      page,
      pageToken: "",
    });
    // TODO: parse link header here using `parse-link-header`
    // and return an object like this:
    // {
    //   sessions: [...],
    //   pageMeta: {
    //     nextPageToken: "",
    //     prevPageToken: ""
    //   }
    // }
    // hence we can paginate using page tokens
    return data;
  }

  const { isPending, data, isFetching } = useSuspenseQuery({
    queryKey: ["sessions", page],
    queryFn: () => fetchSessions(page),
  });

  return (
    <div className="flex flex-col gap-8 h-full relative">
      <div className="flex justify-between items-center w-full">
        <RevokeOtherSessionsDialog />
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="flex h-full flex-1 flex-col gap-4">
        {data.map((session) => (
          <SessionCard session={session} key={session.id} />
        ))}
      </div>
    </div>
  );
}