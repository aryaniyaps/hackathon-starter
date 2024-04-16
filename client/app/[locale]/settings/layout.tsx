import SettingsHeader from "@/components/settings/settings-header";
import SidebarNav from "@/components/settings/sidebar-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import kratos from "@/lib/kratos";
import { headers } from "next/headers";

async function getLogoutFlow() {
  const cookie = headers().get("cookie") || "";

  // revalidate must be duration of session
  return await kratos.createBrowserLogoutFlow(
    { cookie },
    { next: { revalidate: 3600 } }
  );
}

const sidebarNavItems = {
  "user-settings-label": [
    {
      title: "pages.account-settings-label",
      href: "/settings",
    },
  ],
  "security-settings-label": [
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

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logoutFlow = await getLogoutFlow();

  return (
    <main className="flex h-screen w-full max-w-full flex-col">
      <SettingsHeader />
      <div className="mb-8 flex flex-1 h-full overflow-y-auto">
        <div className="mx-auto flex h-full max-w-7xl flex-1 flex-col space-y-8 p-4 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/6 h-full">
            <SidebarNav logoutFlow={logoutFlow} items={sidebarNavItems} />
          </aside>
          <ScrollArea className="h-full flex-1 overflow-y-auto">
            <div className="h-full flex-1 lg:max-w-2xl pl-2">{children}</div>
          </ScrollArea>
        </div>
      </div>
    </main>
  );
}
