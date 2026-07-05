import { Share_Tech_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import MaintenanceWrapper from "../components/MaintenanceWrapper";
import SplashScreen from "../components/SplashScreen";

const cyberFont = Share_Tech_Mono({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const cyberBody = Share_Tech_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
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
    <html lang="id" className={`${cyberFont.variable} ${cyberBody.variable} ${plexMono.variable}`}>
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
