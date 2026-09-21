import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Search, UserCircle, Edit, Bookmark } from "lucide-react";

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
        {/* Desktop Header */}
        <header className="sticky top-0 z-50 bg-surface border-b border-border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* Left: Brand */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-navy hover:text-brand-red transition-colors duration-200">
                  Pradeshik News Bihar
                </Link>
              </div>
              
              {/* Center: Navigation (Desktop) */}
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-sm font-medium text-text-primary hover:text-brand-red transition-colors">Latest</Link>
                <span className="text-sm font-medium text-text-secondary cursor-not-allowed">Bihar</span>
                <span className="text-sm font-medium text-text-secondary cursor-not-allowed">Districts ▾</span>
                <span className="text-sm font-medium text-text-secondary cursor-not-allowed">Categories ▾</span>
              </nav>
              
              {/* Right: Actions */}
              <div className="flex items-center space-x-6">
                <button className="text-text-secondary hover:text-navy transition-colors hidden sm:block">
                  <Search className="w-5 h-5" />
                  <span className="sr-only">Search</span>
                </button>
                <Link href="/create" className="text-text-secondary hover:text-navy transition-colors flex items-center gap-1.5" title="Create News">
                  <Edit className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm font-medium">Create</span>
                </Link>
                <Link href="/saved" className="text-text-secondary hover:text-navy transition-colors flex items-center gap-1.5" title="Saved News">
                  <Bookmark className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm font-medium">Saved</span>
                </Link>
                <button className="text-text-secondary hover:text-navy transition-colors">
                  <UserCircle className="w-6 h-6" />
                  <span className="sr-only">Profile</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation Bar */}
          <div className="md:hidden border-t border-border-subtle bg-surface/95 backdrop-blur-sm overflow-x-auto py-2">
             <div className="px-4 flex space-x-6 whitespace-nowrap">
                <Link href="/" className="text-sm font-medium text-brand-red">Latest</Link>
                <span className="text-sm font-medium text-text-secondary">Bihar</span>
                <span className="text-sm font-medium text-text-secondary">Districts</span>
                <span className="text-sm font-medium text-text-secondary">Categories</span>
             </div>
          </div>
        </header>

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
                  <li><span className="text-sm text-slate-500">Bihar</span></li>
                  <li><span className="text-sm text-slate-500">Districts</span></li>
                  <li><span className="text-sm text-slate-500">Categories</span></li>
                </ul>
              </div>

              {/* Links Col 2 */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><span className="text-sm text-slate-500">About</span></li>
                  <li><span className="text-sm text-slate-500">Contact</span></li>
                  <li><span className="text-sm text-slate-500">Editorial Policy</span></li>
                  <li><span className="text-sm text-slate-500">Corrections</span></li>
                </ul>
              </div>

              {/* Links Col 3 */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Contribute</h4>
                <ul className="space-y-3">
                  <li><Link href="/create" className="text-sm text-slate-400 hover:text-white transition-colors">Submit News</Link></li>
                  <li><span className="text-sm text-slate-500">Become a Contributor</span></li>
                  <li><span className="text-sm text-slate-500">Verification</span></li>
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
