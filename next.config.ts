import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', '@supabase/supabase-js', 'bcryptjs', 'jose'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
