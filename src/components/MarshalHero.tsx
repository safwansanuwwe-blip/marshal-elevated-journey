import { ArrowRight, Menu, Plane, X } from "lucide-react";
import { useEffect, useState } from "react";
import busImage from "@/assets/marshal-bus.png";
import logoImage from "@/assets/marshal-logo.png";
import bgImage from "@/assets/marshal-bg.jpg";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "#" },
  { label: "Fleet", href: "#fleet" },
  { label: "Packages", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];
const WHATSAPP = "https://wa.me/919188700777";


export default function MarshalHero() {
  const [menuOpen, setMenuOpen] = useState(false);

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
      {/* Cinematic background */}
      <video
        className="absolute inset-0 h-full w-full object-cover hidden md:block"
        src="/marshal-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster={bgImage}
      />
      <video
        className="absolute inset-0 h-full w-full object-cover md:hidden"
        src="/marshal-bg-mobile.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster={bgImage}
      />
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
            fontSize: "clamp(72px, 16vw, 260px)",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.83) 0%, rgba(255,255,255,0.12) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "blur(0.4px) drop-shadow(0 8px 40px rgba(255,255,255,0.08))",
          }}
        >
          M&nbsp;A&nbsp;R&nbsp;S&nbsp;H&nbsp;A&nbsp;L
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
            Book Now
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
            Explore
          </a>

          <button className="lg:hidden text-white" aria-label="Menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Featured bus image */}
      <div
        className="absolute left-1/2 z-20 -translate-x-1/2 w-full px-4 sm:px-6 bottom-[42%] sm:bottom-[32%] md:bottom-[26%]"
        style={{ maxWidth: "1200px" }}
      >
        <div className="animate-[float_6s_ease-in-out_infinite]">
          <div className="relative">
            <img
              src={busImage}
              alt="Marshal Holidays luxury tourist bus"
              className="relative z-10 mx-auto w-full max-w-[95vw] sm:max-w-[800px] md:max-w-[900px] drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
            />
            {/* Soft ground shadow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-2"
              style={{
                bottom: "-10px",
                width: "70%",
                height: "40px",
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(8px)",
              }}
            />
          </div>
        </div>

      </div>

      {/* HERO BOTTOM CONTENT */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 pb-10 md:pb-14 animate-fade-in"
        style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          {/* Left - paragraph + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 max-w-2xl">
            <p
              className="text-white"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                lineHeight: "30px",
                fontWeight: 400,
                maxWidth: "414px",
              }}
            >
              Travel across Kerala with comfort, luxury, and unforgettable
              experiences. Premium tourist buses for family trips, group tours,
              and corporate journeys.
            </p>
            <a
              href="#fleet"
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
              View Fleet
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
            Luxury journeys begin with Marshal
          </h1>
        </div>
      </div>
    </section>
  );
}
