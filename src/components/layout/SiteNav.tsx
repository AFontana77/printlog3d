'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/library', label: 'Library' },
  { href: '/free-download', label: 'Free Download' },
  { href: '/about', label: 'About' },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-violet-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-violet-100" role="navigation" aria-label="Main navigation">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-violet-800 tracking-tight" aria-label="PrintLog3D home">
            PrintLog3D
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-violet-800 transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/free-download" className="text-sm font-semibold bg-violet-700 text-white px-4 py-2 rounded-lg hover:bg-violet-800 transition-colors min-h-[44px] flex items-center press-feedback">
              Free Download
            </Link>
          </div>
          <button
            className="sm:hidden p-2 rounded-lg text-gray-600 hover:text-violet-800 hover:bg-violet-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <div className="sm:hidden border-t border-violet-100 bg-white px-4 py-4 flex flex-col gap-3">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-base text-gray-700 hover:text-violet-800 py-2" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/free-download" className="mt-2 text-sm font-semibold bg-violet-700 text-white px-4 py-3 rounded-lg text-center hover:bg-violet-800 transition-colors" onClick={() => setOpen(false)}>
              Free Download
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
