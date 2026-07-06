import { Space_Grotesk, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import MaintenanceWrapper from "../components/MaintenanceWrapper";
import SplashScreen from "../components/SplashScreen";

const fontDisplay = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontBody = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata = {
  title: "Biddokkes Polda Sulawesi Tengah — Layanan Kesehatan Kepolisian",
  description:
    "Website resmi Biddokkes Polda Sulteng. Layanan MCU, vaksinasi, laboratorium, psikologi, ambulans, medikolegal, dan identifikasi korban bencana — untuk personel Polri, keluarga, dan masyarakat umum di Sulawesi Tengah.",
  keywords: [
    "Biddokkes",
    "Polda Sulawesi Tengah",
    "kesehatan kepolisian",
    "MCU",
    "vaksinasi",
    "laboratorium",
    "medikolegal",
    "DVI",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}>
      <body>
        <ThemeProvider>
          <SplashScreen />
          <MaintenanceWrapper>
            {children}
          </MaintenanceWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
