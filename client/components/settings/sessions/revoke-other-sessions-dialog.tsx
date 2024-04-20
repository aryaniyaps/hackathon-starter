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
import { APP_NAME } from "@/lib/constants";
import useRevokeOtherSessions from "@/lib/hooks/useRevokeOtherSessions";
import { useState } from "react";

export default function RevokeOtherSessionsDialog({
  disabled,
}: {
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const revokeOtherSessions = useRevokeOtherSessions();

  async function handleRevokeOtherSessions() {
    await revokeOtherSessions.mutateAsync();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={disabled}>
          Logout from all other devices
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Logout from all other devices</DialogTitle>
          <DialogDescription>
            This will remove access to your {APP_NAME} account from all other
            devices
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full items-end gap-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            onClick={handleRevokeOtherSessions}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
