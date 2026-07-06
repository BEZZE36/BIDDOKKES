"use client";
import { motion } from "framer-motion";
import ScrollReveal from "../ScrollReveal";
import { useTheme } from "../ThemeProvider";
import ShinyText from "../animations/ShinyText";

const SECTION_LINKS = [
  { href: "#tentang", label: "Tentang" },
  { href: "#layanan", label: "Layanan" },
  { href: "#prosedur", label: "Prosedur" },
  { href: "#galeri", label: "Galeri" },
  { href: "#berita", label: "Berita" },
  { href: "#faq", label: "FAQ" },
  { href: "#lokasi", label: "Lokasi & Kontak" },
];

const EXTERNAL_LINKS = [
  { href: "https://sulteng.polri.go.id", label: "Polda Sulawesi Tengah" },
  { href: "https://pusdokkes.polri.go.id", label: "Pusdokkes Polri" },
];

export default function Footer() {
  const { dark } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      className="pt-12 pb-6 relative overflow-clip"
      style={{ background: "var(--color-brand-navy)", color: "white" }}
    >
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "var(--color-teal-600)",
          filter: "blur(80px)",
          transform: "translate(30%, -30%)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "var(--color-gold-500)",
          filter: "blur(60px)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          {/* Identity */}
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <motion.img
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                src="https://storage.pusdokkes.polri.go.id/pusdokkes/logo.png"
                alt="Logo Biddokkes"
                className="w-10 h-10 object-contain cursor-default"
              />
              <div>
                {dark ? (
                  <>
                    <motion.div
                      animate={{
                        textShadow: [
                          "0px 0px 5px rgba(217,164,65,0)",
                          "0px 0px 20px rgba(217,164,65,1)",
                          "0px 0px 5px rgba(217,164,65,0)",
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5,
                        ease: "easeInOut",
                      }}
                      className="font-bold text-sm"
                    >
                      BIDDOKKES
                    </motion.div>
                    <motion.div
                      animate={{
                        textShadow: [
                          "0px 0px 5px rgba(14,140,130,0)",
                          "0px 0px 15px rgba(14,140,130,1)",
                          "0px 0px 5px rgba(14,140,130,0)",
                        ],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5,
                        ease: "easeInOut",
                        delay: 1.25,
                      }}
                      className="text-xs opacity-60"
                    >
                      Polda Sulawesi Tengah
                    </motion.div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-sm text-white">
                      <ShinyText text="BIDDOKKES" speed={4} />
                    </div>
                    <div className="text-xs opacity-60 text-white">
                      <ShinyText text="Polda Sulawesi Tengah" speed={5} />
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Bidang Kedokteran dan Kesehatan Polda Sulteng — melayani kesehatan
              kepolisian dan masyarakat.
            </p>
          </ScrollReveal>

          {/* Navigation */}
          <ScrollReveal delay={100}>
            <nav>
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-4"
                style={{ color: "var(--color-gold-500)" }}
              >
                Navigasi
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SECTION_LINKS.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    whileHover={{ x: 4, opacity: 1 }}
                    className="text-sm no-underline"
                    style={{ color: "white", opacity: 0.85 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </nav>
          </ScrollReveal>

          {/* External Links */}
          <ScrollReveal delay={200}>
            <p
              className="text-xs uppercase tracking-wider font-semibold mb-4"
              style={{ color: "var(--color-gold-500)" }}
            >
              Tautan Resmi
            </p>
            {EXTERNAL_LINKS.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4, opacity: 1 }}
                className="block text-sm mb-2 no-underline"
                style={{ color: "white", opacity: 0.85 }}
              >
                ↗ {link.label}
              </motion.a>
            ))}
          </ScrollReveal>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          id="footer-disclaimer"
          className="my-6 rounded-lg p-4 text-sm leading-relaxed"
          style={{
            background: "rgba(217,164,65,0.2)",
            border: "1px solid rgba(217,164,65,0.4)",
            color: "#FFFFFF",
          }}
        >
          ⚠️ <strong style={{ color: "#FDE68A" }}>Waspada penipuan</strong> mengatasnamakan petugas.
          Biddokkes tidak pernah meminta transfer di luar kanal resmi loket.
          Laporkan kejanggalan melalui kontak resmi di halaman ini.
        </motion.div>

        {/* Copyright */}
        <p
          id="footer-copyright"
          className="text-xs text-center opacity-70 pt-2"
        >
          © {year} Biddokkes Polda Sulawesi Tengah. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
