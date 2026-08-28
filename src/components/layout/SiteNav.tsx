'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/library', label: 'Materials' },
  { href: '/3d-printing-filament-guide', label: 'Guides' },
  { href: '/free-download', label: 'Free Download' },
  { href: '/about', label: 'About' },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-brand-soft" role="navigation" aria-label="Main navigation">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="PrintLog3D home">
            <Image
              src="/brand/logo-primary.webp"
              alt="PrintLog3D"
              width={152}
              height={50}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-brand-dark transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/free-download" className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors min-h-[44px] flex items-center press-feedback">
              Free Download
            </Link>
          </div>
          <button
            className="sm:hidden p-2 rounded-lg text-gray-600 hover:text-brand-dark hover:bg-brand-tint min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <div className="sm:hidden border-t border-brand-soft bg-white px-4 py-4 flex flex-col gap-3">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-base text-gray-700 hover:text-brand-dark py-2" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/free-download" className="mt-2 text-sm font-semibold bg-brand text-white px-4 py-3 rounded-lg text-center hover:bg-brand-dark transition-colors" onClick={() => setOpen(false)}>
              Free Download
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
