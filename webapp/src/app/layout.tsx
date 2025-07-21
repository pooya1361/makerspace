import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { ReduxProvider } from "./lib/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Makerspace App",
  description: "A place for creativity",
  icons: "https://www.uppsalamakerspace.se/wp-content/uploads/2024/12/cropped-makerspace-stamp-framed@2x-2-32x32.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <Header />
          <main>
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
