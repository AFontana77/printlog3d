import type { NextConfig } from "next";
// Serving the same pages on both apex and www spends crawl budget twice and can
// leave Google indexing neither host. This property declares www as its
// canonical host, so the other one redirects here permanently.
const HOST_REDIRECT = {
  source: "/:path*",
  has: [{ type: "host" as const, value: "printlog3d.com" }],
  destination: "https://www.printlog3d.com/:path*",
  permanent: true,
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      HOST_REDIRECT,
      {
        // The 1,000 generated catalogue entries. They were a cartesian product
        // of brands against materials and asserted products that do not exist,
        // each with its own specification table. Noindex was not a sufficient
        // remedy: the page still served the claim to anyone who requested the
        // URL, and a disclaimer about the photograph does not retract the specs
        // above it. Removed in favour of the real material profile, which is
        // what every one of them was a degraded copy of.
        source: '/library/:category/:slug',
        destination: '/library/:category',
        permanent: true,
      },
      {
        // The generated cheat sheet was live and linked before the owner
        // supplied the designed Field Guide. Permanent redirect rather than a
        // 404, so any existing link or bookmark still lands on a real file.
        source: '/printlog3d-filament-settings-cheat-sheet.pdf',
        destination: '/PrintLog3D-Filament-Settings-Field-Guide.pdf',
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
