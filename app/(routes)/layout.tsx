// RootLayout.js
import { Header, Footer, Analytics, Toast } from "@/_components";
import React, {Suspense} from "react";
import "./globals.scss";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ReduxProvider from "@/_provider/redux-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RaimaxBet | Online betting| Sport betting",
  description: "Sports Betting, Bonus Wins",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Analytics />
        <ReduxProvider>
          <Header />
          <Suspense>
            {children}
          </Suspense>
          <Footer />
          <Toast />
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}
