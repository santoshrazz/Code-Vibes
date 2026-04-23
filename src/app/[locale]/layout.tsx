export const dynamic = "force-static";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import { notFound } from "next/navigation";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import PlausibleProvider from "next-plausible";
import { ToastContainer } from "react-toastify";
import type { Organization, WithContext } from "schema-dts";
import ConsoleGhost from "@/src/components/ConsoleGhost";
import { routing } from "@/src/i18n/routing";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

const jsonLd: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CodeVibes",
  logo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Ghostbyte_Logo.png",
  url: "https://CodeVibes.in",
  description: "CodeVibes is a software development company specializing in web and mobile applications.",
  email: "hey@CodeVibes.in",
  sameAs: [
    "https://github.com/CodeVibes",
    "https://www.instagram.com/CodeVibes.in",
    "https://www.linkedin.com/company/CodeVibes",
  ],
  founder: [
    {
      "@type": "Person",
      name: "Santosh Kumar",
    },
    {
      "@type": "Person",
      name: "Subham Kumar",
    },
  ],
  employee: [
    {
      "@type": "Person",
      name: "Manav Kumar",
    },
    {
      "@type": "Person",
      name: "Shalini Priya",
    },
  ],
  location: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressCountry: "Patna, Bihar, India",
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ namespace: "Meta", locale: locale });

  return {
    title: t("title"),
    description: t("description"),
    icons: [
      { rel: "icon", url: "/favicon.ico" },
      { rel: "icon", type: "image/svg+xml", url: "/favicon.svg" },
    ],
    alternates: {
      canonical: `https://codevibes.in${locale === "de" ? "/de" : ""}`,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html
      className="scroll-smooth selection:bg-neutral-800 selection:text-light"
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <Script
          strategy="afterInteractive"
          data-domain="CodeVibes.in"
          src="/js/script.hash.outbound-links.js"
        />
      </head>

      <body className={inter.className}>
        <ConsoleGhost />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <>
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {<Navbar />}
          {children}

          <Footer lang={locale} />
          <ToastContainer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
