import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "BezBarier — nawigacja miejska bez przeszkód",
  description:
    "Platforma nawigacji pieszej i audytu barier miejskich. Trasy dopasowane do profilu mobilności oraz głosowe zgłaszanie przeszkód.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={cn("h-full", "antialiased", dmSans.variable, syne.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
