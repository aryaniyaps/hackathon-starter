export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      {children}
      <p className="text-muted-foreground text-sm">
        Terms | Privacy | Language
      </p>
    </div>
  );
}
