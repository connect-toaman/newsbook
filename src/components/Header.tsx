"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, UserCircle, Edit, Bookmark, ChevronDown, Menu, X } from "lucide-react";

import { CATEGORIES, BIHAR_DISTRICTS } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isDistrictsOpen, setIsDistrictsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const categoryRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setIsDistrictsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoriesOpen(false);
    setIsDistrictsOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border-subtle shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-navy hover:text-brand-red transition-colors duration-200">
              Pradeshik News Bihar
            </Link>
          </div>
          
          {/* Center: Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-brand-red border-b-2 border-brand-red pb-5 mt-5" : "text-text-secondary hover:text-navy"}`}
            >
              Latest
            </Link>
            
            <Link 
              href="/district/bihar" 
              className={`text-sm font-medium transition-colors ${isActive("/district/bihar") ? "text-brand-red border-b-2 border-brand-red pb-5 mt-5" : "text-text-secondary hover:text-navy"}`}
            >
              Bihar
            </Link>
            
            {/* Districts Dropdown */}
            <div className="relative" ref={districtRef}>
              <button 
                onClick={() => {
                  setIsDistrictsOpen(!isDistrictsOpen);
                  setIsCategoriesOpen(false);
                }}
                className={`flex items-center gap-1 text-sm font-medium transition-colors h-16 ${isActive("/district") && pathname !== "/district/bihar" ? "text-brand-red border-b-2 border-brand-red" : "text-text-secondary hover:text-navy"}`}
              >
                Districts <ChevronDown className="w-4 h-4" />
              </button>
              
              {isDistrictsOpen && (
                <div className="absolute top-14 left-0 w-48 max-h-96 overflow-y-auto bg-white border border-border-subtle rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {BIHAR_DISTRICTS.map((district) => (
                    <Link 
                      key={district}
                      href={`/district/${district.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-slate-50 hover:text-brand-red transition-colors"
                    >
                      {district}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryRef}>
              <button 
                onClick={() => {
                  setIsCategoriesOpen(!isCategoriesOpen);
                  setIsDistrictsOpen(false);
                }}
                className={`flex items-center gap-1 text-sm font-medium transition-colors h-16 ${isActive("/category") ? "text-brand-red border-b-2 border-brand-red" : "text-text-secondary hover:text-navy"}`}
              >
                Categories <ChevronDown className="w-4 h-4" />
              </button>
              
              {isCategoriesOpen && (
                <div className="absolute top-14 left-0 w-48 bg-white border border-border-subtle rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {CATEGORIES.map((cat) => (
                    <Link 
                      key={cat}
                      href={`/category/${cat.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-text-primary hover:bg-slate-50 hover:text-brand-red transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
          
          {/* Right: Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <Link href="/search" className={`text-text-secondary hover:text-navy transition-colors ${isActive("/search") ? "text-navy" : ""}`}>
              <Search className="w-5 h-5" />
              <span className="sr-only">Search</span>
            </Link>
            
            <Link href="/create" className={`flex items-center gap-1.5 transition-colors ${isActive("/create") ? "text-brand-red" : "text-text-secondary hover:text-navy"}`} title="Create News">
              <Edit className="w-5 h-5" />
              <span className="text-sm font-medium">Create</span>
            </Link>
            
            <Link href="/saved" className={`flex items-center gap-1.5 transition-colors ${isActive("/saved") ? "text-brand-red" : "text-text-secondary hover:text-navy"}`} title="Saved News">
              <Bookmark className="w-5 h-5" />
              <span className="text-sm font-medium">Saved</span>
            </Link>
            
            <Link href="/login" className={`transition-colors ${isActive("/login") || isActive("/profile") ? "text-navy" : "text-text-secondary hover:text-navy"}`}>
              <UserCircle className="w-6 h-6" />
              <span className="sr-only">Profile/Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
             <Link href="/search" className="text-text-secondary">
                <Search className="w-5 h-5" />
             </Link>
             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="text-navy p-1"
             >
               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border-subtle pb-4 animate-in fade-in slide-in-from-top-2">
           <div className="px-4 py-2 space-y-1">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-navy hover:bg-slate-50">Latest News</Link>
              <Link href="/district/bihar" className="block px-3 py-2 rounded-md text-base font-medium text-navy hover:bg-slate-50">Bihar</Link>
              
              <div className="px-3 py-2">
                 <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Districts</div>
                 <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                    {BIHAR_DISTRICTS.map((d) => (
                       <Link key={d} href={`/district/${d.toLowerCase()}`} className="text-sm text-text-secondary hover:text-brand-red">{d}</Link>
                    ))}
                 </div>
              </div>

              <div className="px-3 py-2">
                 <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</div>
                 <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((c) => (
                       <Link key={c} href={`/category/${c.toLowerCase()}`} className="text-sm text-text-secondary hover:text-brand-red">{c}</Link>
                    ))}
                 </div>
              </div>
           </div>
           
           <div className="px-4 pt-4 pb-2 border-t border-border-subtle flex justify-around">
              <Link href="/create" className="flex flex-col items-center gap-1 text-text-secondary hover:text-navy">
                 <Edit className="w-5 h-5" />
                 <span className="text-xs font-medium">Create</span>
              </Link>
              <Link href="/saved" className="flex flex-col items-center gap-1 text-text-secondary hover:text-navy">
                 <Bookmark className="w-5 h-5" />
                 <span className="text-xs font-medium">Saved</span>
              </Link>
              <Link href="/login" className="flex flex-col items-center gap-1 text-text-secondary hover:text-navy">
                 <UserCircle className="w-5 h-5" />
                 <span className="text-xs font-medium">Profile</span>
              </Link>
           </div>
        </div>
      )}
    </header>
  );
}
