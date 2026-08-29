import type { Metadata } from "next";
import { Libre_Caslon_Text, Plus_Jakarta_Sans } from "next/font/google";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import "./globals.css";

const libreCaslonText = Libre_Caslon_Text({
  variable: "--font-display",
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

// Fallback al dominio real, no a localhost: metadataBase alimenta el canonical
// y las URLs de Open Graph. Si en producción faltara la env var, un fallback a
// localhost le diría a Google que la página buena vive en localhost.
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://misello.com.mx";
const TITLE = "Invitaciones digitales para boda, XV años y bautizo | Sello";
const DESCRIPTION =
  "Crea tu invitación digital en minutos: contestas unas preguntas y queda lista para compartir por WhatsApp, con confirmación de asistencia (RSVP). Pago único, sin suscripción.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  // `template` deja que cada página ponga solo su nombre y herede la marca.
  title: { default: TITLE, template: "%s | Sello" },
  description: DESCRIPTION,
  // Token de la verificación por meta tag de Google Search Console. Sin la
  // variable, Next simplemente no emite la etiqueta.
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Sello",
    locale: "es_MX",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Sello — invitaciones digitales" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${libreCaslonText.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
