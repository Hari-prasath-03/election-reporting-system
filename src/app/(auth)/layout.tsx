import { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "../globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Securely access your account or recover your credentials on the Vote Count Share platform.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} antialiased`}>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-accent/10 p-4">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
