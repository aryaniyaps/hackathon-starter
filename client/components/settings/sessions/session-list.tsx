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
import SessionCard from "./session-card";

export default function SessionList() {
  const [page, setPage] = useState(0);

  const fetchSessions = async (page = 0) =>
    await kratos.listMySessions({ pageSize: 20, page });

  const { isPending, data, isFetching } = useSuspenseQuery({
    queryKey: ["sessions", page],
    queryFn: () => fetchSessions(page),
  });

  return (
    <div className="flex h-full flex-1 flex-col gap-4">
      {data.map((session) => (
        <SessionCard session={session} key={session.id} />
      ))}
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
  );
}
