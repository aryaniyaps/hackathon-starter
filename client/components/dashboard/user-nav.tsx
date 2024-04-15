"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCurrentSession from "@/lib/hooks/useCurrentSession";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";

export default function UserNav() {
  const { data: user } = useCurrentSession();

  const t = useTranslations("dashboard.user-nav");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={"https://picsum.photos/200"}
            loading="eager"
            alt={"user.email"}
          />
          <AvatarFallback>
            {user.identity?.traits.email.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={15}>
        <DropdownMenuLabel>{user.identity?.traits.email}</DropdownMenuLabel>
        <Link href="/settings">
          <DropdownMenuItem>{t("settings-label")}</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
