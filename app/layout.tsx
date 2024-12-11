import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { GeistMono } from "geist/font";
import "./globals.css";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Meme Trader Solana",
  description: "A modern web application for practicing and learning meme coin trading on Solana without risking real money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet"/>
      </Head>
      <body className={`${poppins.variable} ${geistMono.variable} lato-regular`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
