import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Search, UserCircle, Edit, Bookmark } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const sourceSerif = Source_Serif_4({ 
  subsets: ["latin"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  title: "Pradeshik News Bihar | Authentic Local News",
  description: "Pradeshik News Bihar is your trusted source for the latest news, breaking stories, and in-depth updates from Bihar. CEO: Manindra Kumar Singh.",
  openGraph: {
    title: "Pradeshik News Bihar",
    description: "Your trusted source for the latest news and breaking stories from Bihar. CEO: Manindra Kumar Singh.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceSerif.variable} font-sans bg-background text-text-primary flex flex-col min-h-screen antialiased selection:bg-brand-red selection:text-white`}>
        <Header />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
