import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodLoop — ხელმისაწვდომი საკვები შენს უბანში",
  description:
    "FoodLoop connects neighbors with cafes, bakeries and markets that have affordable surplus meals. Join the waitlist.",
  openGraph: {
    title: "FoodLoop",
    description: "Affordable surplus meals from your neighborhood — making Georgian food sustainable.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body>{children}</body>
    </html>
  );
}
