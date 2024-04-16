"use client";
import useCurrentSession from "@/lib/hooks/useCurrentSession";
import SessionCard from "./session-card";

export default function CurrentSessionCard() {
  const { data: session } = useCurrentSession();
  return <SessionCard session={session} isCurrentSession />;
}
