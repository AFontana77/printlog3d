import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [
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
