"use client";
import { useTranslations } from "next-intl";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

// TODO: make this a form where the form method will be GET and
// action will be submit. This will automatically redirect to the post logout
// URL, as in other server side flows
// There's also a user-logout-card in @ory/elements you can refer.
export default function LogoutDialog() {
  const t = useTranslations("settings");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex gap-2 w-full justify-start items-center bg-transparent text-left text-foreground hover:text-destructive-foreground"
        >
          <Icons.logOut className="w-4 h-4" />
          <p>{t("logout-dialog-trigger")}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("logout-button")}</DialogTitle>
          <DialogDescription>{t("logout-description")}</DialogDescription>
        </DialogHeader>
        <form action="/logout" method="POST">
          <DialogFooter className="flex w-full items-end gap-4">
            <DialogClose asChild>
              <Button variant="ghost">{t("logout-cancel-button")}</Button>
            </DialogClose>
            <Button variant="destructive" type="submit">
              {t("logout-button")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
