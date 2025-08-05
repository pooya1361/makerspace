import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import AuthStatusWatcher from "./components/AuthStatusWatcher";
import Header from "./components/Header";
import { SimpleAuthChecker } from "./components/SimpleAuthChecker";
import WelcomeRibbon from "./components/WelcomeRibbon";
import "./globals.css";
import { ReduxProvider } from "./lib/provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
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
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <ReduxProvider>
          <Header />
          <WelcomeRibbon />
          <AuthStatusWatcher />
          <SimpleAuthChecker>
            {children}
          </SimpleAuthChecker>
        </ReduxProvider>
      </body>
    </html>
  );
}
