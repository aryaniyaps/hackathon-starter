import { LogoutLink } from "@/components/auth/logout-link";
import { useEffect } from "react";

export default function LogoutPage() {
  const onLogout = LogoutLink();

  useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <div>Loading</div>;
}
