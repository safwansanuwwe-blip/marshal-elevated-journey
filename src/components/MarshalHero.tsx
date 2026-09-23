import { ArrowRight, Menu, Plane, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content";

export default function MarshalHero({ content }: { content: SiteContent }) {
  const NAV_LINKS = content.hero.navLinks;
  const WHATSAPP = content.contact.whatsapp;
  const logoImage = content.media.logo;
  const heroPoster = content.media.heroPoster;
  const { heroVideoDesktop, heroVideoMobile } = content.media;
  const [menuOpen, setMenuOpen] = useState(false);
  // Load only the video that matches the viewport, and only after mount — this
  // avoids downloading BOTH the desktop (~7 MB) and mobile (~7 MB) clips, and
  // defers the video so the poster image can paint first (faster LCP).
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const pick = () => setVideoSrc(mq.matches ? heroVideoMobile : heroVideoDesktop);
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, [heroVideoDesktop, heroVideoMobile]);

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (


    <section
      className="relative w-full overflow-hidden bg-[#010101] text-white"
      style={{ minHeight: "600px", height: "100vh", maxHeight: "965px" }}
    >
      {/* Cinematic background — poster paints instantly, single video loads after mount */}
      <img
        src={heroPoster}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {videoSrc && (
        <video
          key={videoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      )}
      <div className="absolute inset-0 bg-black/30" />


      {/* Decorative MARSHAL typography */}
      <div
        className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 select-none text-center"
        style={{ top: "15%", width: "75%", maxWidth: "1073px" }}
      >
        <h2
          className="leading-none tracking-[0.04em] animate-fade-in"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(40px, 8vw, 140px)",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.83) 0%, rgba(255,255,255,0.12) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "blur(0.4px) drop-shadow(0 8px 40px rgba(255,255,255,0.08))",
          }}
        >
          {content.hero.welcomeHeading}
        </h2>
      </div>

      {/* NAVBAR */}
      <nav
        className="absolute inset-x-0 top-0 z-40 flex items-center justify-between py-6 animate-fade-in"
        style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
      >
        {/* Left - logo */}
        <a href="#" className="flex items-center gap-3 group">
          <img
            src={logoImage}
            alt="Marshal Holidays"
            className="h-9 sm:h-11 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105"
          />
        </a>

        {/* Center - links */}
        <ul className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="relative transition-colors hover:text-white"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#EEEFF2",
                  letterSpacing: "-0.32px",
                }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 hover:w-full" />
              </a>
            </li>
          ))}

        </ul>

        {/* Right - actions */}
        <div className="flex items-center gap-5">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline text-white/90 hover:text-white transition-colors"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 500 }}
          >
            {content.hero.bookNowLabel}
          </a>
          <a
            href="#fleet"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 transition-all hover:shadow-2xl hover:-translate-y-0.5"
            style={{
              height: "48px",
              borderRadius: "8px",
              color: "#272835",
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              boxShadow: "0 10px 30px -10px rgba(0,0,0,0.4)",
            }}
          >
            <Plane className="h-4 w-4" />
            {content.hero.exploreLabel}
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden text-white p-2 -mr-2 relative z-50"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#0a0a0a] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <img src={logoImage} alt="Marshal Holidays" className="h-9 w-auto object-contain" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="text-white p-2 -mr-2"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <ul className="flex flex-col px-6 py-8 gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={handleNavClick}
                  className="block py-3 text-white/90 hover:text-white border-b border-white/5 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 500 }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto px-6 pb-10 flex flex-col gap-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleNavClick}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 h-12 text-[#272835] font-semibold"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Book Now
            </a>
            <a
              href="#fleet"
              onClick={handleNavClick}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 text-white px-5 h-12 font-semibold"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Plane className="h-4 w-4" />
              Explore Fleet
            </a>
          </div>
        </div>
      </div>


      {/* HERO BOTTOM CONTENT */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 pb-10 md:pb-14 animate-fade-in"
        style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          {/* Left - tagline + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 max-w-2xl">
            <div style={{ maxWidth: "414px" }}>
              <p
                className="text-white"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(28px, 3.5vw, 40px)",
                  lineHeight: 1.1,
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                {content.hero.taglineTitle}
              </p>
              <p
                className="mt-3 text-white/80"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  lineHeight: "24px",
                  fontWeight: 400,
                }}
              >
                {content.hero.taglineSubtitle}
              </p>
            </div>
            <a
              href={content.hero.ctaHref}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              style={{
                height: "48px",
                borderRadius: "8px",
                color: "#272835",
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                border: "1px solid #EEEFF2",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.4)",
              }}
            >
              {content.hero.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </a>

          </div>

          {/* Right - tagline */}
          <h1
            className="text-white"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(48px, 6vw, 64px)",
              lineHeight: 1,
              maxWidth: "466px",
              letterSpacing: "0.01em",
            }}
          >
            {content.hero.headline}
          </h1>
        </div>
      </div>
    </section>
  );
}
