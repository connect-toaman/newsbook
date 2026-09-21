import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Search, UserCircle, Edit, Bookmark } from "lucide-react";
import Header from "@/components/Header";

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

        <footer className="bg-navy text-surface py-12 md:py-16 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
              
              {/* Brand Col */}
              <div className="md:col-span-1">
                <Link href="/" className="font-serif text-xl font-bold tracking-tight mb-4 inline-block">
                  Pradeshik News Bihar
                </Link>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                  Connecting communities with credible local reporting from across Bihar.
                </p>
              </div>

              {/* Links Col 1 */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">News</h4>
                <ul className="space-y-3">
                  <li><Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Latest</Link></li>
                  <li><Link href="/district/bihar" className="text-sm text-slate-400 hover:text-white transition-colors">Bihar</Link></li>
                  <li><Link href="/district/patna" className="text-sm text-slate-400 hover:text-white transition-colors">Districts</Link></li>
                  <li><Link href="/category/politics" className="text-sm text-slate-400 hover:text-white transition-colors">Categories</Link></li>
                </ul>
              </div>

              {/* Links Col 2 */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Contribute</h4>
                <ul className="space-y-3">
                  <li><Link href="/create" className="text-sm text-slate-400 hover:text-white transition-colors">Submit News</Link></li>
                  <li><span className="text-sm text-slate-500">Contributor Access restricted to approved journalists.</span></li>
                </ul>
              </div>

            </div>

            <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} Pradeshik News Bihar. All rights reserved.
              </p>
              <div className="flex gap-4">
                <span className="text-xs font-medium text-slate-400">CEO: Manindra Kumar Singh</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
