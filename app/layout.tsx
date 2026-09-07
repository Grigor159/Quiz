import type { Metadata } from "next";
import { ChakraUIProvider } from "@/providers/chakraProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Հարցեր...",
  description: "Հետաքրքիր հարցեր",
  openGraph: {
    title: "Հարցեր...",
    description: "Հետաքրքիր հարցեր",
    url: "https://quiz-j4jy.vercel.app/",
    siteName: "Հարցեր",
    images: [
      {
        url: "https://quiz-j4jy.vercel.app/icon.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "hy_AM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hy" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        {/* Favicons */}
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <ChakraUIProvider>{children}</ChakraUIProvider>
      </body>
    </html>
  );
}
