import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";

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

const title = "Stop Using The Same Resume | AI Job-Specific Resume Tailor - ResuMate AI";
const description =
  "88% of qualified candidates get rejected using generic resumes. ResuMate AI creates job-specific resumes tailored to each role, beating ATS filters and increasing interview rates by 3x.";

export const metadata: Metadata = {
  metadataBase: new URL("https://useresumate.com"),
  title: {
    default: title,
    template: "%s | ResuMate AI",
  },
  description,
  keywords: [
    "tailor resume for each job",
    "customize resume for different jobs",
    "job specific resume maker",
    "stop using same resume",
    "personalize resume for job application",
    "resume customization for different roles",
    "job-specific resume optimization",
    "ATS resume tailoring",
    "avoid generic resume rejection",
    "AI resume personalization"
  ],
  authors: [{ name: "ResuMate AI" }],
  openGraph: {
    title,
    description,
    url: "https://useresumate.com",
    siteName: "ResuMate AI",
    type: "website",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "ResuMate AI - Stop using the same resume for every job. AI-powered job-specific resume tailoring that beats ATS filters and increases interview rates by 3x.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@resumateai",
    images: ["/images/twitter-image.webp"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ResuMate AI - Job-Specific Resume Tailor",
    "applicationCategory": "BusinessApplication",
    "description": "AI-powered tool that creates job-specific, tailored resumes for each application, eliminating generic resume rejection",
    "operatingSystem": "Web Browser",
    "featureList": [
      "Job-specific resume tailoring",
      "ATS optimization for each role",
      "Resume customization automation",
      "Multiple resume versions",
      "AI-powered keyword optimization",
      "Generic resume transformation"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/PreOrder"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.9,
      "ratingCount": 1247,
      "bestRating": 5
    },
    "creator": {
      "@type": "Organization",
      "name": "ResuMate AI",
      "url": "https://useresumate.com"
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://useresumate.com/",
        "description": "Join waitlist for job-specific resume tailoring"
      },
      "result": {
        "@type": "CreativeWork",
        "name": "Job-specific tailored resume"
      }
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
