import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interviewly AI",
  description: "Practice smarter. Interview with confidence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
