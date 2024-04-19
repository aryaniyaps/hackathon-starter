import AccountSettingsScreen from "@/components/settings/account/account-settings-screen";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Account settings | ${APP_NAME}`,
};

export default function AccountSettingsPage() {
  return <AccountSettingsScreen />;
}
