import { ArrowRight, Compass, Menu, Plane } from "lucide-react";
import busImage from "@/assets/marshal-bus.png";
import posterImage from "@/assets/kerala-road-poster.jpg";
import keralaVideo from "../../public/videos/kerala-hero.mp4.asset.json";

const NAV_LINKS = ["Home", "Fleet", "Packages", "About Us", "Contact"];

export default function MarshalHero() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#010101] text-white"
      style={{ minHeight: "600px", height: "100vh", maxHeight: "965px" }}
    >
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={posterImage}
      >
        <source src={keralaVideo.url} type="video/mp4" />
      </video>


      {/* Gradient overlays */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{
          height: "260px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: "260px",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))",
        }}
      />
      {/* Extra dim to keep contrast cinematic */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/30" />

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
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 transition-all group-hover:bg-white/20">
            <Compass className="h-5 w-5 text-white" />
          </span>
          <span
            className="hidden sm:inline text-white"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "24px", fontWeight: 600 }}
          >
            Marshal Holidays
          </span>
        </a>

        {/* Center - links */}
        <ul className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="relative transition-colors hover:text-white"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#EEEFF2",
                  letterSpacing: "-0.32px",
                }}
              >
                {link}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right - actions */}
        <div className="flex items-center gap-5">
          <a
            href="#"
            className="hidden md:inline text-white/90 hover:text-white transition-colors"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 500 }}
          >
            Book Now
          </a>
          <button
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
          </button>
          <button className="lg:hidden text-white" aria-label="Menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Featured bus image */}
      <div
        className="absolute left-1/2 z-20 -translate-x-1/2 w-full px-4 sm:px-6 bottom-[30%] sm:bottom-[28%] md:bottom-[26%]"
        style={{ maxWidth: "1200px" }}
      >
        <div className="relative animate-[float_6s_ease-in-out_infinite]">
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
            <button
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
            </button>
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
