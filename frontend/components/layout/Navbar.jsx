/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useTheme } from "../ThemeProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ShinyText from "../animations/ShinyText";

const NAV_SECTIONS = [
  { id: "nav-tentang",  anchor: "tentang",  label: "Tentang" },
  { id: "nav-layanan",  anchor: "layanan",  label: "Layanan" },
  { id: "nav-prosedur", anchor: "prosedur", label: "Prosedur" },
  { id: "nav-galeri",   anchor: "galeri",   label: "Galeri" },
  { id: "nav-berita",   anchor: "berita",   label: "Berita" },
  { id: "nav-faq",      anchor: "faq",      label: "FAQ" },
  { id: "nav-lokasi",   anchor: "lokasi",   label: "Lokasi" },
];

function DarkToggle() {
  const { dark, toggle } = useTheme();

  return (
    <motion.button
      onClick={toggle}
      aria-label={dark ? "Aktifkan mode terang" : "Aktifkan mode malam"}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      style={{
        width: "2.5rem",
        height: "1.4rem",
        borderRadius: "9999px",
        position: "relative",
        border: "none",
        cursor: "pointer",
        background: dark ? "var(--color-teal-600)" : "var(--color-line)",
        transition: "background 0.35s ease",
        flexShrink: 0,
      }}
    >
      <motion.span
        animate={{ x: dark ? "1.15rem" : "0.1rem" }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        style={{
          position: "absolute",
          top: "0.15rem",
          left: 0,
          width: "1.1rem",
          height: "1.1rem",
          borderRadius: "50%",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.6rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }}
      >
        {dark ? "🌙" : "☀️"}
      </motion.span>
    </motion.button>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { dark } = useTheme();
  const pathname = usePathname();

  // On sub-pages (/galeri, /berita, /kontak), nav links go to /#section
  const isHomePage = pathname === "/";
  const makeHref = (anchor) => isHomePage ? `#${anchor}` : `/#${anchor}`;
  const logoHref = isHomePage ? "#" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (pathname === "/galeri") {
      // eslint-disable-next-line
      setActiveSection("galeri");
    } else if (pathname === "/berita") {
      setActiveSection("berita");
    } else if (pathname === "/kontak") {
      setActiveSection("kontak");
    } else if (pathname === "/") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );

      NAV_SECTIONS.forEach((section) => {
        const el = document.getElementById(section.anchor);
        if (el) observer.observe(el);
      });

      return () => {
        window.removeEventListener("scroll", onScroll);
        observer.disconnect();
      };
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const headerBg = dark
    ? scrolled ? "rgba(17,24,39,0.92)" : "#111827"
    : scrolled ? "rgba(255,255,255,0.92)" : "#FFFFFF";

  return (
    <header
      id="site-header"
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: headerBg,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 16px rgba(0,0,0,0.12)" : "none",
        borderBottom: "2px solid var(--color-gold-500)",
        transition: "background 0.35s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={logoHref} className="flex items-center gap-3 no-underline">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="Logo Biddokkes"
              fill
              sizes="40px"
              priority={true}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col ml-1">
            <span className="block text-sm font-bold" style={{ color: dark ? "#FFFFFF" : "var(--color-navy-900)" }}>
              <ShinyText text="BIDDOKKES" speed={4} />
            </span>
            <span className="hidden sm:block text-xs" style={{ color: dark ? "#E5E7EB" : "var(--color-ink-500)" }}>
              <ShinyText text="Polda Sulawesi Tengah" speed={5} />
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_SECTIONS.map((link) => {
            const isActive = activeSection === link.anchor;
            return (
              <Link
                key={link.id}
                id={link.id}
                href={makeHref(link.anchor)}
                className="px-3 py-2 text-sm font-medium rounded-md no-underline transition-colors relative"
                style={{ color: isActive ? "var(--color-teal-600)" : "var(--color-ink-900)" }}
                onMouseEnter={(e) => { if(!isActive) e.target.style.color = "var(--color-teal-600)" }}
                onMouseLeave={(e) => { if(!isActive) e.target.style.color = "var(--color-ink-900)" }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "var(--color-teal-600)" }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/kontak"
            className="px-3 py-2 text-sm font-medium rounded-md no-underline transition-colors relative"
            style={{ color: activeSection === "kontak" ? "var(--color-teal-600)" : "var(--color-ink-900)" }}
            onMouseEnter={(e) => { if(activeSection !== "kontak") e.target.style.color = "var(--color-teal-600)" }}
            onMouseLeave={(e) => { if(activeSection !== "kontak") e.target.style.color = "var(--color-ink-900)" }}
          >
            Kontak
            {activeSection === "kontak" && (
              <motion.div
                layoutId="activeNav"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "var(--color-teal-600)" }}
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
          <div className="ml-2">
            <DarkToggle />
          </div>
        </nav>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-3">
          <DarkToggle />
          <button
            className="p-2 rounded-md"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ color: "var(--color-navy-900)" }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t px-4 pb-4 overflow-hidden"
            style={{
              background: dark ? "#111827" : "white",
              borderColor: "var(--color-line)",
            }}
          >
            {NAV_SECTIONS.map((link) => {
              const isActive = activeSection === link.anchor;
              return (
                <Link
                  key={link.id}
                  id={`${link.id}-mobile`}
                  href={makeHref(link.anchor)}
                  className="block py-3 text-sm font-medium no-underline"
                  style={{ 
                    color: isActive ? "var(--color-teal-600)" : "var(--color-ink-900)", 
                    borderBottom: "1px solid var(--color-line)" 
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/kontak"
              className="block py-3 text-sm font-medium no-underline"
              style={{ color: activeSection === "kontak" ? "var(--color-teal-600)" : "var(--color-ink-900)" }}
              onClick={() => setMobileOpen(false)}
            >
              Kontak
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
