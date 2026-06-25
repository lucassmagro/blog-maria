import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sanitize-html é CommonJS (Node) e deve ser exigido em runtime, não
  // empacotado no bundle do servidor.
  serverExternalPackages: ["sanitize-html"],
  images: {
    // Supabase Storage will serve cover images from this hostname in Phase 2.
    // Until the project URL is known, only the local /public images are used.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
