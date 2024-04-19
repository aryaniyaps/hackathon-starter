import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { APP_NAME } from "@/lib/constants";
import useRevokeSession from "@/lib/hooks/useRevokeSession";
import { useState } from "react";

export default function RevokeSessionDialog({
  sessionId,
}: {
  sessionId: string;
}) {
  const [open, setOpen] = useState(false);
  const revokeSession = useRevokeSession();

  async function handleRevokeSession() {
    await revokeSession.mutateAsync({ sessionId });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive" title="revoke session">
          <Icons.trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Revoke session</DialogTitle>
          <DialogDescription>
            This will remove access to your {APP_NAME} account from the device
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full items-end gap-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            onClick={handleRevokeSession}
          >
            Revoke session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
