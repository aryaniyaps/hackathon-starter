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
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function RevokeOtherSessionsDialog({
  disabled,
}: {
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("settings.sessions");
  const revokeOtherSessions = useRevokeOtherSessions();

  async function handleRevokeOtherSessions() {
    await revokeOtherSessions.mutateAsync();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={disabled}>
          {t("disable-all-sessions-label")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>{t("disable-all-sessions-dialog-title")}</DialogTitle>
          <DialogDescription>
            {t("disable-all-sessions-dialog-description", {
              appName: APP_NAME,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full items-end gap-4">
          <DialogClose asChild>
            <Button variant="ghost">
              {t("disable-all-sessions-dialog-cancel-button")}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            onClick={handleRevokeOtherSessions}
          >
            {t("disable-all-sessions-dialog-confirm-button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
