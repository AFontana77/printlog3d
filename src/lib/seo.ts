import type { Metadata } from 'next';

export const SITE_URL = 'https://www.printlog3d.com';

/**
 * Open Graph block for one route.
 *
 * The root layout used to declare `openGraph.url` and `openGraph.title`, and
 * every page inherited them, so a shared link to any page previewed as the
 * homepage. Each route now passes its own path here.
 *
 * A page-level `openGraph` replaces the root one whole, which is why the shared
 * fields are repeated. Title and description are left out on purpose: Next
 * fills them from the page's own title and description, so the preview cannot
 * drift away from the page.
 *
 * `path` is the canonical path: '' for the homepage, '/about', and so on.
 */
export function ogFor(path: string): NonNullable<Metadata['openGraph']> {
  return {
    type: 'website',
    locale: 'en_US',
    siteName: 'PrintLog3D',
    url: `${SITE_URL}${path}`,
  };
}
