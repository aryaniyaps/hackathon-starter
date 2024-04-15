"use client";
import { usePathname, useRouter } from "next/navigation";

export default function AuthLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const handleChange = (e) => {
    router.push(`/${e.target.value}/${pathname}`);
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      {children}
      <div className="flex text-muted-foreground text-sm gap-2 items-center">
        <p>Terms</p>
        <p>Privacy</p>
        <select value={locale} onChange={handleChange}>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </div>
  );
}
