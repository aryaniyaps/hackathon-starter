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
import { getAvatarURL } from "@/utils/avatar";
import { useTranslations } from "next-intl";

export default function UserNav() {
  const { data: session } = useCurrentSession();

  const t = useTranslations("dashboard.user-nav");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={getAvatarURL(session.identity?.traits.email)}
            loading="eager"
            alt={session.identity?.traits.email}
          />
          <AvatarFallback>
            {session.identity?.traits.email.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={15}>
        <DropdownMenuLabel>{session.identity?.traits.email}</DropdownMenuLabel>
        <Link href="/settings">
          <DropdownMenuItem>{t("settings-label")}</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
