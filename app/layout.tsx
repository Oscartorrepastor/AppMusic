import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "AppMusic",
  description: "Music streaming application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
