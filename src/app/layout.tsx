import type { Metadata } from "next";
import { Playfair_Display, Roboto, Source_Serif_4 } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

// Serifa de texto (corpo) para a experiência de leitura estilo Medium.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

// Favicon: a cadeira (🪑) — o trocadilho da marca ("cátedra" = cadeira).
const chairFavicon =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪑</text></svg>";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: chairFavicon,
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${roboto.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Define o tema antes da pintura para evitar flash (FOUC). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tema');var d=t?t==='escuro':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
