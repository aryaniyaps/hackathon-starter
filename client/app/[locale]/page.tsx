"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 max-w-md mx-auto">
      <h2>Welcome, USERNAME</h2>
      <Button variant="destructive">Sign Out</Button>
    </div>
  );
}
