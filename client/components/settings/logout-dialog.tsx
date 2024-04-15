import useLogout from "@/lib/hooks/useLogout";
import { useRouter } from "@/lib/navigation";
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

export default function LogoutDialog() {
  const logout = useLogout();
  const router = useRouter();
  const t = useTranslations("settings");

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/login");
    router.refresh();
  }

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

        <DialogFooter className="flex w-full items-end gap-4">
          <DialogClose asChild>
            <Button variant="ghost">{t("logout-cancel-button")}</Button>
          </DialogClose>
          <Button variant="destructive" type="submit" onClick={handleLogout}>
            {t("logout-button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
