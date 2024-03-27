"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 max-w-md mx-auto">
      <h2>Welcome, {session?.user.name}</h2>
      <pre className="text-pretty text-center">
        {JSON.stringify(session?.user)}
      </pre>
      <Button
        variant="destructive"
        onClick={async () => {
          await signOut();
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}
