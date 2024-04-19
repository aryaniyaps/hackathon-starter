import SettingsHeader from "@/components/settings/settings-header";
import SidebarNav from "@/components/settings/sidebar-nav";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      title: "pages.internationalization-settings-label",
      href: "/settings/internationalization",
    },
  ],
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-full max-w-full flex-col">
      <SettingsHeader />
      <div className="mb-8 flex flex-1 h-full overflow-y-auto">
        <div className="mx-auto flex h-full max-w-7xl flex-1 flex-col space-y-8 p-4 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/6 h-full">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <ScrollArea className="h-full flex-1 overflow-y-auto">
            <div className="h-full flex-1 lg:max-w-2xl ml-2 mb-48">
              {children}
            </div>
          </ScrollArea>
        </div>
      </div>
    </main>
  );
}
