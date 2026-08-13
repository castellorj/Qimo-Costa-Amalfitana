/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // SEM `output: "export"`: com export estático o conteúdo do banco é congelado
  // no build, e salvar no /admin não mudava nada no ar. Runtime Next da Netlify
  // (SSR/ISR) faz a página revalidar sozinha a cada ~60s.
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      // Fotos enviadas pelo /admin (Supabase Storage) + thumbnails de vídeo
      { protocol: "https", hostname: "vvvzitszfcajfrvzpace.supabase.co" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
