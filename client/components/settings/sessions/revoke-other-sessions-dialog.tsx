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

export default function RevokeOtherSessionsDialog() {
  const revokeOtherSessions = useRevokeOtherSessions();

  async function handleRevokeOtherSessions() {
    await revokeOtherSessions.mutateAsync();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Logout from all other devices</Button>
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
