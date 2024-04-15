import LocaleSwitcher from "@/components/locale-switcher";

export default function AuthLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      {children}
      <div className="flex text-muted-foreground text-sm gap-4 items-center">
        <p>Terms</p>
        <p>Privacy</p>
        <LocaleSwitcher locale={locale} />
      </div>
    </div>
  );
}
