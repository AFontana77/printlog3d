import Link from 'next/link';
import Image from 'next/image';

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 py-10 px-4 mt-auto" role="contentinfo">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <Image
          src="/brand/emblem.webp"
          alt="PrintLog3D"
          width={36}
          height={36}
          loading="lazy"
          className="h-9 w-9"
        />
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/library" className="hover:text-gray-900 transition-colors">Materials</Link>
          <Link href="/3d-printing-filament-guide" className="hover:text-gray-900 transition-colors">Guides</Link>
          <Link href="/workshop" className="hover:text-gray-900 transition-colors">Workshop</Link>
          <Link href="/get-it-printed" className="hover:text-gray-900 transition-colors">Get It Printed</Link>
          <Link href="/free-download" className="hover:text-gray-900 transition-colors">Free Download</Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
          <Link href="/support" className="hover:text-gray-900 transition-colors">Support</Link>
          <Link href="/editorial-policy" className="hover:text-gray-900 transition-colors">Editorial policy</Link>
          <Link href="/disclosure" className="hover:text-gray-900 transition-colors">Disclosure</Link>
          <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link>
        </div>
        <div>&copy; {new Date().getFullYear()} Anvil Road LLC</div>
      </div>
    </footer>
  );
}
