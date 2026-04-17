import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 py-10 px-4 mt-auto" role="contentinfo">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="font-semibold text-violet-800">PrintLog3D</div>
        <div className="flex gap-6">
          <Link href="/library" className="hover:text-gray-900 transition-colors">Library</Link>
          <Link href="/free-download" className="hover:text-gray-900 transition-colors">Free Download</Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
        </div>
        <div>&copy; {new Date().getFullYear()} Anvil Road LLC</div>
      </div>
    </footer>
  );
}
