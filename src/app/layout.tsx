import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const title = "ResuMate AI — Tailor-fit your resume for any job";
const description =
  "Join the ResuMate AI waitlist and be first to access AI-crafted, job-specific resumes, optimized for ATS and recruiter impact.";

export const metadata: Metadata = {
  metadataBase: new URL("https://resumate.ai"),
  title: {
    default: title,
    template: "%s | ResuMate AI",
  },
  description,
  keywords: [
    "AI resume builder",
    "resume personalization",
    "job search tools",
    "ATS optimization",
    "cover letter generator",
  ],
  authors: [{ name: "ResuMate AI" }],
  openGraph: {
    title,
    description,
    url: "https://resumate.ai",
    siteName: "ResuMate AI",
    type: "website",
    images: [
      {
        url: "/images/features/hero-ui.jpg",
        width: 1080,
        height: 810,
        alt: "Preview of the ResuMate AI resume tailoring interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@resumateai",
    images: ["/images/features/hero-ui.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
