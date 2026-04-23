import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://preventli.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Preventli — WorkCover Claims Made Preventable",
    template: "%s | Preventli",
  },
  description:
    "Preventli helps Australian businesses reduce workplace injuries, manage WHS compliance, and cut WorkCover premium costs — proactively. Protect your team, slash your premiums.",
  keywords: [
    "WorkCover",
    "WHS compliance",
    "workplace safety",
    "injury prevention",
    "WorkCover premium reduction",
    "return to work",
    "Australia",
    "compliance management",
  ],
  authors: [{ name: "Preventli" }],
  creator: "Preventli",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "Preventli",
    title: "Preventli — WorkCover Claims Made Preventable",
    description:
      "Preventli helps Australian businesses reduce workplace injuries, manage WHS compliance, and cut WorkCover premium costs — proactively.",
    images: [
      {
        url: "/preventli-logo-wordmark.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Preventli — WorkCover Claims Made Preventable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Preventli — WorkCover Claims Made Preventable",
    description:
      "Reduce workplace injuries, manage compliance, and cut WorkCover premium costs — proactively.",
    images: ["/preventli-logo-wordmark.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Preventli",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "WorkCover compliance and injury prevention SaaS for Australian businesses",
  address: {
    "@type": "PostalAddress",
    addressCountry: "AU",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "lisah@preventli.ai",
  },
  sameAs: ["https://www.linkedin.com/company/preventli"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en-AU" className={inter.variable}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
        </head>
        <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
