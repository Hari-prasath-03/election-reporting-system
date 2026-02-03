import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import "../globals.css";

import { redirect } from "next/navigation";
import { getUser } from "@/services/self-user-service";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Election reporting system | Management Dashboard",
  description:
    "Real-time Election Management System for counting centers and round-wise vote tallying.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <html lang="en">
      <body className={`${figtree.variable} antialiased`}>
        <Navbar user={user} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
