import SidebarNav from "@/components/settings/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";

const sidebarNavItems = {
  "user-settings-label": [
    {
      title: "pages.account-settings-label",
      href: "/settings",
    },
  ],
  "security-settings-label": [
    {
      title: "pages.passkeys-settings-label",
      href: "/settings/passkeys",
    },
    {
      title: "pages.sessions-settings-label",
      href: "/settings/sessions",
    },
  ],
  "app-settings-label": [
    {
      title: "pages.appearance-settings-label",
      href: "/settings/appearance",
    },
    {
      title: "pages.language-settings-label",
      href: "/settings/language",
    },
  ],
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("settings");

  return (
    <main className="flex h-screen w-full max-w-full flex-col">
      <div className="border-b p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="font-semibold">{t("title")}</h1>
          <Link href="/dashboard">
            <Button variant="link" size="sm">
              {t("back-to-dashboard-label")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="mb-8 flex flex-1 h-full overflow-y-auto">
        <div className="mx-auto flex h-full max-w-7xl flex-1 flex-col space-y-8 p-4 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/6 h-full">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="h-full flex-1 overflow-y-auto">
            <div className="h-full flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
