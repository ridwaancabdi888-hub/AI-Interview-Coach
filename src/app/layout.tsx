import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "https://ai-interview-coach-sigma-bay.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Interviewly AI | AI Mock Interview Practice",
    template: "%s | Interviewly AI",
  },
  description:
    "Practice technical, behavioral, and general job interviews with AI-generated questions, written or voice answers, and actionable feedback.",
  applicationName: "Interviewly AI",
  creator: "Interviewly AI",
  publisher: "Interviewly AI",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
