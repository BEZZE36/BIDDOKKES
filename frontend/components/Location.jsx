"use client";
import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

export default function Location() {
  return (
    <section id="lokasi" className="py-16 sm:py-24 relative overflow-hidden" style={{ background: "var(--color-white)" }}>
      {/* Decorative blob */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-0 top-0 w-72 h-72 rounded-full pointer-events-none opacity-5"
        style={{ background: "var(--color-teal-600)", filter: "blur(60px)", transform: "translate(30%, -20%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal>
          <p className="text-xs tracking-[0.15em] uppercase font-semibold mb-3" style={{ color: "var(--color-teal-600)", fontFamily: "var(--font-mono)" }}>Hubungi Kami</p>
          <h2 className="mb-4" style={{ color: "var(--color-navy-900)" }}>Lokasi &amp; Kontak</h2>
          <p className="mb-8 max-w-2xl" style={{ color: "var(--color-ink-500)" }}>
            Tim kami siap membantu Anda dengan layanan kesehatan terbaik. Hubungi kami sekarang!
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <ScrollReveal>
            <motion.div
              whileHover={{ scale: 1.01, boxShadow: "0 16px 48px rgba(14,140,130,0.15)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-xl overflow-hidden shadow-sm"
              style={{ border: "1px solid var(--color-line)" }}
            >
              <iframe
                src="https://maps.google.com/maps?q=Biddokkes%20Polda%20Sulteng&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Biddokkes Polda Sulteng"
              />
            </motion.div>
          </ScrollReveal>

          {/* Contact Info */}
          <ScrollReveal delay={150}>
            <div className="space-y-4">
              {[
                {
                  icon: "📍",
                  title: "Alamat",
                  content: (
                    <>
                      <p className="text-sm" style={{ color: "var(--color-ink-500)" }}>
                        Jl. Sam Ratulangi No. 05, Besusu Barat, Kec. Palu Timur, Kota Palu, Sulawesi Tengah 94118
                      </p>
                      <p className="text-xs mt-2 italic" style={{ color: "var(--color-ink-500)" }}>
                        * Alamat di atas bersifat contoh — akan dikonfirmasi ke instansi.
                      </p>
                    </>
                  )
                },
                {
                  icon: "🕐",
                  title: "Jam Layanan",
                  content: (
                    <div className="space-y-2 text-sm" style={{ color: "var(--color-ink-500)" }}>
                      <div className="flex justify-between">
                        <span>Senin – Jumat</span>
                        <span className="font-semibold" style={{ color: "var(--color-teal-600)" }}>08.00 – 15.00 WITA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gawat Darurat &amp; Ambulans</span>
                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="font-semibold"
                          style={{ color: "var(--color-gold-500)" }}
                        >Siaga 24 Jam</motion.span>
                      </div>
                    </div>
                  )
                },
                {
                  icon: "📞",
                  title: "Kontak",
                  content: (
                    <div className="space-y-2 text-sm" style={{ color: "var(--color-ink-500)" }}>
                      <p>Telepon: <span className="font-semibold">(0451) XXX-XXXX</span></p>
                      <p>WhatsApp: <span className="font-semibold">0812-XXXX-XXXX</span></p>
                      <p>Email: <span className="font-semibold">biddokkes@sulteng.polri.go.id</span></p>
                      <p className="text-xs italic">* Kontak placeholder — isi dengan data resmi.</p>
                    </div>
                  )
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ x: 4 }}
                  className="rounded-xl p-5"
                  style={{ background: "var(--color-mist)" }}
                >
                  <h3 className="font-bold text-sm mb-3" style={{ color: "var(--color-navy-900)" }}>{card.icon} {card.title}</h3>
                  {card.content}
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
