import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACE — Chief of Staff",
  description: "Marcus Hendricks's private executive operating system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
