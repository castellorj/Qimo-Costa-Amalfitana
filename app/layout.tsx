import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { getEditableContent } from "@/lib/content-remote";
import { formatRange } from "@/lib/date";
import "./globals.css";

/** Descrição da prévia quando `shareDescription` está vazio no /admin. */
const DESC =
  "La Dolce Vita sul Mare — de Malta à Costa Amalfitana a bordo de um navio boutique. 10 paradas, roteiro personalizável.";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getEditableContent();
  const autoTitle = [c.groupName, formatRange(c.startDate, c.endDate)]
    .filter((s) => s && s.trim())
    .join(" · ");
  // Título/descrição da prévia do link são editáveis no /admin; vazio = automático.
  const title = c.shareTitle?.trim() || autoTitle;
  const description = c.shareDescription?.trim() || DESC;
  // Imagem da prévia: se o admin enviou uma imagem, usa ELA direto (reflete na
  // hora, sem cache imutável). Vazio = o design gerado em /api/og.
  const ogImage = c.shareImage?.trim() || "https://ladolcevita.qimobr.com/api/og";
  const images = [{ url: ogImage, width: 1200, height: 630 }];
  return {
    metadataBase: new URL("https://ladolcevita.qimobr.com"),
    title,
    description,
    applicationName: autoTitle || title,
    // Link privado para um grupo de conhecidos — fora dos buscadores; o robô do
    // WhatsApp ainda lê o og.
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export const viewport: Viewport = {
  themeColor: "#04203C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fontVariables} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-dvh bg-offwhite text-deep antialiased">{children}</body>
    </html>
  );
}
