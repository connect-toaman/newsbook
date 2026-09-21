"use client";

import Link from "next/link";
import { useState } from "react";
import { BIHAR_DISTRICTS, CATEGORIES } from "@/lib/constants";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Footer() {
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const displayedDistricts = showAllDistricts ? BIHAR_DISTRICTS : BIHAR_DISTRICTS.slice(0, 9);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const displayedCategories = showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 8);

  return (
    <footer className="bg-navy text-surface py-12 md:py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-xl font-bold tracking-tight mb-4 inline-block">
              Pradeshik News Bihar
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
              Connecting communities with credible local reporting from across Bihar.
            </p>
            <div className="space-y-2">
              <Link href="/create" className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded transition-colors">
                Submit News
              </Link>
              <p className="text-xs text-slate-500">Contributor Access restricted to approved journalists.</p>
            </div>
          </div>

          {/* Links Col 1 - Categories */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Categories</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Latest News</Link></li>
              {displayedCategories.map(cat => (
                <li key={cat}>
                  <Link href={`/category/${cat.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
            {CATEGORIES.length > 8 && (
              <button 
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="mt-4 flex items-center text-sm font-medium text-brand-red hover:text-white transition-colors"
              >
                {showAllCategories ? (
                  <>View Less <ChevronUp className="w-4 h-4 ml-1" /></>
                ) : (
                  <>View All Categories <ChevronDown className="w-4 h-4 ml-1" /></>
                )}
              </button>
            )}
          </div>

          {/* Links Col 2 - Districts */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Bihar Districts</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {displayedDistricts.map(dist => (
                <Link 
                  key={dist} 
                  href={`/district/${dist.toLowerCase()}`} 
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {dist}
                </Link>
              ))}
            </div>
            {BIHAR_DISTRICTS.length > 9 && (
              <button 
                onClick={() => setShowAllDistricts(!showAllDistricts)}
                className="mt-4 flex items-center text-sm font-medium text-brand-red hover:text-white transition-colors"
              >
                {showAllDistricts ? (
                  <>View Less <ChevronUp className="w-4 h-4 ml-1" /></>
                ) : (
                  <>View All {BIHAR_DISTRICTS.length} Districts <ChevronDown className="w-4 h-4 ml-1" /></>
                )}
              </button>
            )}
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
  );
}
