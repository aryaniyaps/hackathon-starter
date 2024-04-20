"use client";
import useCurrentSession from "@/lib/hooks/useCurrentSession";
import SessionCard, { SessionCardSkeleton } from "./session-card";

export default function CurrentSessionCard() {
  const { data: session } = useCurrentSession();
  if (!session) {
    return <SessionCardSkeleton />;
  }
  return <SessionCard session={session} isCurrentSession />;
}
