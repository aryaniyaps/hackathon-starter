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
import { Icons } from "../icons";
import { Separator } from "../ui/separator";

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
        <DropdownMenuLabel className="flex flex-col gap-2">
          <p>{session.identity?.traits.name}</p>
          <p className="text-muted-foreground text-sm">
            {session.identity?.traits.email}
          </p>
        </DropdownMenuLabel>
        <Separator className="my-2" />
        <Link href="/settings">
          <DropdownMenuItem className="flex gap-2 items-center">
            <Icons.settings className="h-4 w-4" />
            {t("settings-label")}
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
