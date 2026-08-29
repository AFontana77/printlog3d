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
