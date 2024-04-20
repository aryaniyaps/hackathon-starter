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
import { Skeleton } from "../ui/skeleton";

export default function UserNav() {
  // this hook is somehow being executed on the server which raises
  // errors. is this because its a suspense query?
  // the error goes away when its a normal query
  const { data: session } = useCurrentSession();

  const t = useTranslations("dashboard.user-nav");

  if (!session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Skeleton className="h-8 w-8 rounded-full" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={15}>
          <DropdownMenuLabel className="flex flex-col gap-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
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
