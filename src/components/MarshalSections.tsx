import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";
import {
  ArrowRight,
  ArrowUpRight,
  Users,
  Heart,
  UsersRound,
  Church,
  GraduationCap,
  Plane,
  Sparkles,
  MapPin,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Facebook,
  Instagram,
  Youtube,
  X,
  Mail,
  ShieldCheck,
  Clock,
  Award,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SectionProps = { content: SiteContent };

// Icons stay in code (paired to services by order); text/desc come from the CMS.
const SERVICE_ICONS: LucideIcon[] = [
  Users, Heart, UsersRound, Church, GraduationCap, Plane, Sparkles, MapPin,
];
const ABOUT_FEATURE_ICONS: LucideIcon[] = [ShieldCheck, Clock, Award];
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  Facebook, Instagram, X, YouTube: Youtube, Youtube,
};

const HEADING_FONT = "'Bebas Neue', sans-serif";
const BODY_FONT = "Inter, sans-serif";

/* Premium luxury palette */
const WHITE = "#FFFFFF";
const SOFT = "#F7F7F5";
const LIGHT = "#ECECEC";
const INK = "#111111";
const INK_SOFT = "#666666";
const INK_MUTE = "#9A9A9A";
const GOLD = "#C6A969";
const HAIR = "rgba(17,17,17,0.08)";
const HAIR_STRONG = "rgba(17,17,17,0.14)";

const RADIUS = 30;
const SHADOW_SOFT = "0 30px 80px -40px rgba(17,17,17,0.18)";
const SHADOW_CARD = "0 20px 60px -30px rgba(17,17,17,0.15)";
const SHADOW_LIFT = "0 40px 90px -35px rgba(17,17,17,0.25)";

/* ---------------- Reveal on scroll ---------------- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- Section primitives ---------------- */
const container: React.CSSProperties = {
  maxWidth: 1360,
  paddingLeft: "clamp(20px, 6vw, 80px)",
  paddingRight: "clamp(20px, 6vw, 80px)",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2"
      style={{
        fontFamily: BODY_FONT,
        fontSize: 11,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: INK_SOFT,
        fontWeight: 500,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 28,
          height: 1,
          background: GOLD,
        }}
      />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-6 md:whitespace-nowrap"
        style={{
          fontFamily: HEADING_FONT,
          fontSize: "clamp(40px, 5.5vw, 76px)",
          lineHeight: 0.98,
          letterSpacing: "0.005em",
          color: INK,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={center ? "mt-6 mx-auto max-w-2xl" : "mt-6 max-w-2xl"}
          style={{
            fontFamily: BODY_FONT,
            fontSize: 17,
            lineHeight: "32px",
            color: INK_SOFT,
            fontWeight: 400,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   ABOUT — editorial split, floating glass stat cards
============================================================ */
function About({ content }: SectionProps) {
  const a = content.about;
  const WHATSAPP = content.contact.whatsapp;
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden"
      style={{ background: WHITE, color: INK, paddingTop: 160, paddingBottom: 180 }}
    >
      <div
        className="relative mx-auto grid grid-cols-1 gap-20 lg:grid-cols-12 lg:items-center"
        style={container}
      >
        {/* Image collage */}
        <Reveal className="lg:col-span-7">
          <div className="relative h-[560px] sm:h-[640px]">
            <div
              className="absolute left-0 top-0 h-[80%] w-[70%] overflow-hidden"
              style={{ borderRadius: RADIUS, boxShadow: SHADOW_LIFT }}
            >
              <video
                src={content.media.aboutVideo1}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-0 right-0 h-[58%] w-[56%] overflow-hidden"
              style={{ borderRadius: RADIUS, boxShadow: SHADOW_LIFT }}
            >
              <video
                src={content.media.aboutVideo2}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>

            {/* floating glass stat cards */}
            <div
              className="absolute -left-3 sm:-left-6 top-6 px-6 py-5 animate-[float_7s_ease-in-out_infinite]"
              style={{
                borderRadius: 22,
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: `1px solid rgba(255,255,255,0.6)`,
                boxShadow: "0 30px 60px -20px rgba(17,17,17,0.18)",
              }}
            >
              <div style={{ fontFamily: HEADING_FONT, fontSize: 28, lineHeight: 1.1, color: INK }}>
                {a.stat1Top}
              </div>
              <div
                className="mt-2"
                style={{
                  fontFamily: BODY_FONT,
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: INK_SOFT,
                  fontWeight: 500,
                }}
              >
                {a.stat1Bottom}
              </div>
            </div>
            <div
              className="absolute -right-3 sm:-right-6 bottom-[44%] px-6 py-5 animate-[float_9s_ease-in-out_infinite]"
              style={{
                borderRadius: 22,
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: `1px solid rgba(255,255,255,0.6)`,
                boxShadow: "0 30px 60px -20px rgba(17,17,17,0.18)",
              }}
            >
              <div style={{ fontFamily: HEADING_FONT, fontSize: 44, lineHeight: 1, color: INK }}>
                {a.stat2Top}
              </div>
              <div
                className="mt-2"
                style={{
                  fontFamily: BODY_FONT,
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: INK_SOFT,
                  fontWeight: 500,
                }}
              >
                {a.stat2Bottom}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal delay={150} className="lg:col-span-5">
          <div>
            <SectionHeading
              eyebrow={a.eyebrow}
              title={a.title}
              subtitle={a.subtitle}
            />

            <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
              {a.features.map((label, fi) => {
                const Icon = ABOUT_FEATURE_ICONS[fi % ABOUT_FEATURE_ICONS.length];
                return (
                <div
                  key={label}
                  className="transition-all duration-500 hover:-translate-y-1"
                  style={{
                    borderRadius: 22,
                    background: SOFT,
                    border: `1px solid ${HAIR}`,
                    padding: "22px 18px",
                  }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.4} style={{ color: INK }} />
                  <div
                    className="mt-4"
                    style={{
                      fontFamily: BODY_FONT,
                      fontSize: 13,
                      fontWeight: 500,
                      color: INK,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {label}
                  </div>
                </div>
                );
              })}
            </div>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="mt-12 inline-flex items-center gap-3 transition-all hover:gap-5"
              style={{
                height: 56,
                padding: "0 28px",
                borderRadius: 999,
                background: INK,
                color: WHITE,
                fontFamily: BODY_FONT,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              {a.ctaLabel}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SERVICES — minimal large cards
============================================================ */
function Services({ content }: SectionProps) {
  const s = content.services;
  const WHATSAPP = content.contact.whatsapp;
  return (
    <section
      id="services"
      className="relative w-full overflow-hidden"
      style={{ background: SOFT, color: INK, paddingTop: 160, paddingBottom: 180 }}
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full opacity-50"
        style={{
          background: `radial-gradient(circle, ${GOLD}22 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full opacity-40"
        style={{
          background: `radial-gradient(circle, ${INK}15 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />
      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${INK} 1px, transparent 1px), linear-gradient(90deg, ${INK} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto" style={container}>
        <Reveal>
          <SectionHeading
            eyebrow={s.eyebrow}
            title={s.title}
            subtitle={s.subtitle}
            center
          />
        </Reveal>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {s.items.map(({ title, desc }, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
            <Reveal key={title} delay={i * 60}>
              <a
                href={`${WHATSAPP}?text=${encodeURIComponent(`Hi Marshal Holidays, I'd like to enquire about ${title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Enquire about ${title} on WhatsApp`}
                className="group relative block h-full overflow-hidden transition-all duration-700 hover:-translate-y-2 cursor-pointer"
                style={{
                  borderRadius: RADIUS,
                  background: WHITE,
                  border: `1px solid ${HAIR}`,
                  padding: 32,
                  boxShadow: SHADOW_CARD,
                  minHeight: 300,
                }}
              >
                {/* Hover gradient wash */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at top right, ${GOLD}1f 0%, transparent 60%)`,
                  }}
                />
                {/* Gold corner accent */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-px -right-px h-16 w-16 origin-top-right scale-0 transition-transform duration-500 group-hover:scale-100"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${GOLD} 50%)`,
                    borderTopRightRadius: RADIUS,
                  }}
                />
                {/* Bottom gold bar reveal */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-700 group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }}
                />

                {/* Number watermark */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-6 bottom-2 select-none transition-all duration-700 group-hover:translate-y-[-4px] group-hover:opacity-20"
                  style={{
                    fontFamily: HEADING_FONT,
                    fontSize: 110,
                    lineHeight: 1,
                    color: INK,
                    opacity: 0.05,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-start justify-between">
                  <div
                    className="relative flex h-14 w-14 items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      borderRadius: 16,
                      background: SOFT,
                      border: `1px solid ${HAIR}`,
                    }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD}88)`,
                      }}
                    />
                    <Icon
                      className="relative h-6 w-6 transition-colors duration-500 group-hover:text-white"
                      strokeWidth={1.4}
                      style={{ color: INK }}
                    />
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 opacity-30 transition-all duration-500 group-hover:opacity-100 group-hover:rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: GOLD }}
                    strokeWidth={1.4}
                  />
                </div>
                <h3
                  className="relative mt-10 transition-colors duration-500"
                  style={{
                    fontFamily: HEADING_FONT,
                    fontSize: 30,
                    letterSpacing: "0.01em",
                    color: INK,
                    lineHeight: 1.05,
                  }}
                >
                  {title}
                </h3>
                <p
                  className="relative mt-3"
                  style={{
                    fontFamily: BODY_FONT,
                    fontSize: 14,
                    lineHeight: "24px",
                    color: INK_SOFT,
                  }}
                >
                  {desc}
                </p>
              </a>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ============================================================
   DESTINATIONS — cinematic slider
============================================================ */
function Destinations({ content }: SectionProps) {
  const DESTINATIONS = content.destinations.items;
  const WHATSAPP = content.contact.whatsapp;
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) setPerView(1);
      else if (w < 1024) setPerView(2);
      else setPerView(3);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const max = DESTINATIONS.length - perView;
  const go = (d: number) => setIndex((i) => Math.max(0, Math.min(max, i + d)));

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i >= max ? 0 : i + 1)), 4500);
    return () => clearInterval(t);
  }, [max]);

  return (
    <section
      id="destinations"
      className="relative w-full overflow-hidden"
      style={{ background: WHITE, color: INK, paddingTop: 160, paddingBottom: 180 }}
    >
      <div className="mx-auto" style={container}>
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <SectionHeading
              eyebrow={content.destinations.eyebrow}
              title={content.destinations.title}
              subtitle={content.destinations.subtitle}
            />
            <div className="flex gap-3">
              <button
                onClick={() => go(-1)}
                className="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-500 hover:-translate-y-0.5"
                style={{
                  background: WHITE,
                  border: `1px solid ${HAIR_STRONG}`,
                  color: INK,
                }}
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
              </button>
              <button
                onClick={() => go(1)}
                className="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-500 hover:-translate-y-0.5"
                style={{ background: INK, color: WHITE }}
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-20 overflow-hidden">
          <div
            className="flex"
            style={{
              transform: `translateX(-${(index * 100) / perView}%)`,
              transition: "transform 1.1s cubic-bezier(0.7,0,0.3,1)",
            }}
          >
            {DESTINATIONS.map((d) => (
              <div
                key={d.name}
                className="shrink-0 px-3"
                style={{ width: `${100 / perView}%` }}
              >
                <div
                  className="group relative h-[520px] overflow-hidden"
                  style={{ borderRadius: RADIUS, boxShadow: SHADOW_SOFT }}
                >
                  <img
                    src={d.img}
                    alt={d.name}
                    className="h-full w-full object-cover transition-transform duration-[1800ms] group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                    <div
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 11,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.75)",
                        fontWeight: 500,
                      }}
                    >
                      {d.region}
                    </div>
                    <h3
                      className="mt-3 flex items-end justify-between gap-4"
                      style={{
                        fontFamily: HEADING_FONT,
                        fontSize: 52,
                        lineHeight: 0.95,
                        letterSpacing: "0.01em",
                      }}
                    >
                      <span>{d.name}</span>
                      <a
                        href={WHATSAPP}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-45"
                        style={{
                          background: "rgba(255,255,255,0.14)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255,255,255,0.25)",
                        }}
                        aria-label={`Explore ${d.name}`}
                      >
                        <ArrowUpRight className="h-5 w-5" strokeWidth={1.4} />
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   AIRPORT TRANSFERS — glass premium cards
============================================================ */
function Airports({ content }: SectionProps) {
  const AIRPORTS = content.airports.items;
  const COVERAGE = content.airports.coverage;
  const WHATSAPP = content.contact.whatsapp;
  return (
    <section
      id="airports"
      className="relative w-full overflow-hidden"
      style={{ background: SOFT, color: INK, paddingTop: 160, paddingBottom: 180 }}
    >
      <div className="mx-auto" style={container}>
        <Reveal>
          <SectionHeading
            eyebrow={content.airports.eyebrow}
            title={content.airports.title}
            subtitle={content.airports.subtitle}
            center
          />
        </Reveal>
        <Reveal>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.media.airportPhotos.map((photo) => (
              <div
                key={photo.alt}
                className="w-full overflow-hidden"
                style={{ borderRadius: RADIUS, boxShadow: SHADOW_CARD, aspectRatio: "4 / 3" }}
              >
                <img
                  src={photo.img}
                  alt={photo.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {AIRPORTS.map((a, i) => (
            <Reveal key={a.code} delay={i * 70}>
              <div
                className="group relative h-full transition-all duration-700 hover:-translate-y-2"
                style={{
                  borderRadius: RADIUS,
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid rgba(255,255,255,0.7)`,
                  boxShadow: SHADOW_CARD,
                  padding: 32,
                  minHeight: 280,
                }}
              >
                <div className="flex items-start justify-between">
                  <Plane className="h-6 w-6" strokeWidth={1.3} style={{ color: INK }} />
                  <span
                    style={{
                      fontFamily: HEADING_FONT,
                      fontSize: 22,
                      letterSpacing: "0.08em",
                      color: GOLD,
                    }}
                  >
                    {a.code}
                  </span>
                </div>
                <h3
                  className="mt-12"
                  style={{
                    fontFamily: HEADING_FONT,
                    fontSize: 36,
                    letterSpacing: "0.01em",
                    lineHeight: 1,
                    color: INK,
                  }}
                >
                  {a.name}
                </h3>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: BODY_FONT,
                    fontSize: 13,
                    color: INK_SOFT,
                    lineHeight: "22px",
                  }}
                >
                  {a.full}
                </p>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 transition-all group-hover:gap-3"
                  style={{
                    fontFamily: BODY_FONT,
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: INK,
                  }}
                >
                  Book Transfer <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={250}>
          <div
            className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-10 py-8"
            style={{
              borderRadius: RADIUS,
              background: WHITE,
              border: `1px solid ${HAIR}`,
              boxShadow: SHADOW_CARD,
            }}
          >
            <div>
              <Eyebrow>Pickup & Drop Coverage</Eyebrow>
              <div
                className="mt-3"
                style={{ fontFamily: HEADING_FONT, fontSize: 34, letterSpacing: "0.01em", color: INK, lineHeight: 1 }}
              >
                {content.airports.coverageTitle}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {COVERAGE.map((c) => (
                <span
                  key={c}
                  className="px-5 py-2.5"
                  style={{
                    borderRadius: 999,
                    background: SOFT,
                    border: `1px solid ${HAIR}`,
                    fontFamily: BODY_FONT,
                    fontSize: 13,
                    color: INK,
                    fontWeight: 500,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   FLEETS — automotive showcase
============================================================ */
function Fleets({ content }: SectionProps) {
  const FLEETS = content.fleets.items;
  const WHATSAPP = content.contact.whatsapp;
  return (
    <section
      id="fleet"
      className="relative w-full overflow-hidden"
      style={{ background: WHITE, color: INK, paddingTop: 160, paddingBottom: 180 }}
    >
      <div className="mx-auto" style={container}>
        <Reveal>
          <SectionHeading
            eyebrow={content.fleets.eyebrow}
            title={content.fleets.title}
            subtitle={content.fleets.subtitle}
            center
          />
        </Reveal>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-7">
          {FLEETS.map((f, i) => (
            <Reveal key={f.name} delay={i * 90}>
              <div
                className="group relative overflow-hidden transition-all duration-700 hover:-translate-y-2"
                style={{
                  borderRadius: RADIUS,
                  background: SOFT,
                  border: `1px solid ${HAIR}`,
                  boxShadow: SHADOW_CARD,
                }}
              >
                <div className="relative h-80 overflow-hidden flex items-center justify-center" style={{ background: SOFT }}>
                  <img
                    src={f.img}
                    alt={f.name}
                    className="h-full w-full object-contain p-6 transition-transform duration-[1800ms] group-hover:scale-105"
                  />
                  <span
                    className="absolute left-6 top-6 px-4 py-2"
                    style={{
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(12px)",
                      color: INK,
                      fontFamily: BODY_FONT,
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {f.badge}
                  </span>
                </div>
                <div className="p-8 sm:p-10">
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      style={{
                        fontFamily: HEADING_FONT,
                        fontSize: 38,
                        letterSpacing: "0.01em",
                        color: INK,
                        lineHeight: 1,
                      }}
                    >
                      {f.name}
                    </h3>
                    <span
                      className="px-4 py-2 shrink-0"
                      style={{
                        borderRadius: 999,
                        background: WHITE,
                        border: `1px solid ${HAIR}`,
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: INK,
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {f.seats}
                    </span>
                  </div>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 transition-all hover:gap-4"
                    style={{
                      height: 52,
                      padding: "0 26px",
                      borderRadius: 999,
                      background: INK,
                      color: WHITE,
                      fontFamily: BODY_FONT,
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Book Now
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   RESORTS — editorial grid
============================================================ */
function Resorts({ content }: SectionProps) {
  const RESORTS = content.resorts.items;
  const WHATSAPP = content.contact.whatsapp;
  return (
    <section
      id="resorts"
      className="relative w-full overflow-hidden"
      style={{ background: SOFT, color: INK, paddingTop: 160, paddingBottom: 180 }}
    >
      <div className="mx-auto" style={container}>
        <Reveal>
          <SectionHeading
            eyebrow={content.resorts.eyebrow}
            title={content.resorts.title}
            subtitle={content.resorts.subtitle}
            center
          />
        </Reveal>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESORTS.map((r, i) => (
            <Reveal key={r.name} delay={i * 70}>
              <div
                className="group relative overflow-hidden"
                style={{
                  borderRadius: RADIUS,
                  background: WHITE,
                  border: `1px solid ${HAIR}`,
                  boxShadow: SHADOW_CARD,
                }}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.name}
                    className="h-full w-full object-cover transition-transform duration-[1800ms] group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 p-7">
                  <div>
                    <div
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 11,
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: GOLD,
                        fontWeight: 500,
                      }}
                    >
                      Luxury Stay
                    </div>
                    <h3
                      className="mt-2"
                      style={{
                        fontFamily: HEADING_FONT,
                        fontSize: 32,
                        letterSpacing: "0.01em",
                        color: INK,
                        lineHeight: 1,
                      }}
                    >
                      {r.name}
                    </h3>
                  </div>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 hover:rotate-45"
                    style={{
                      background: SOFT,
                      border: `1px solid ${HAIR}`,
                      color: INK,
                    }}
                    aria-label={`Book ${r.name}`}
                  >
                    <ArrowUpRight className="h-5 w-5" strokeWidth={1.4} />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS — minimal luxury
============================================================ */
function Testimonials({ content }: SectionProps) {
  const TESTIMONIALS = content.testimonials.items;
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, [TESTIMONIALS.length]);
  const t = TESTIMONIALS[i] ?? TESTIMONIALS[0];
  if (!t) return null;
  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden"
      style={{ background: WHITE, color: INK, paddingTop: 160, paddingBottom: 180 }}
    >
      <div className="relative mx-auto" style={{ ...container, maxWidth: 1100 }}>
        <Reveal>
          <div className="text-center">
            <Eyebrow>Testimonials</Eyebrow>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div
            key={i}
            className="mt-12 p-12 sm:p-20 text-center animate-fade-in"
            style={{
              borderRadius: RADIUS,
              background: SOFT,
              border: `1px solid ${HAIR}`,
              boxShadow: SHADOW_CARD,
            }}
          >
            <div
              style={{
                fontFamily: HEADING_FONT,
                fontSize: 80,
                lineHeight: 0.4,
                color: GOLD,
                letterSpacing: "-0.02em",
              }}
            >
              "
            </div>
            <p
              className="mt-6 mx-auto"
              style={{
                fontFamily: HEADING_FONT,
                fontSize: "clamp(28px, 3.6vw, 48px)",
                lineHeight: 1.15,
                letterSpacing: "0.01em",
                maxWidth: 820,
                color: INK,
              }}
            >
              {t.quote}
            </p>
            <div
              className="mx-auto my-10"
              style={{ height: 1, width: 60, background: HAIR_STRONG }}
            />
            <div style={{ fontFamily: BODY_FONT, fontSize: 15, fontWeight: 500, color: INK }}>
              {t.name}
            </div>
            <div
              className="mt-1"
              style={{
                fontFamily: BODY_FONT,
                fontSize: 12,
                color: INK_SOFT,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {t.role}
            </div>

            <div className="mt-12 flex justify-center gap-2">
              {TESTIMONIALS.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: k === i ? 40 : 16,
                    background: k === i ? INK : HAIR_STRONG,
                  }}
                  aria-label={`Go to testimonial ${k + 1}`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ — ultra clean accordion
============================================================ */
function Faq({ content }: SectionProps) {
  const FAQS = content.faqs.items;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden"
      style={{ background: SOFT, color: INK, paddingTop: 160, paddingBottom: 180 }}
    >
      <div className="mx-auto" style={{ ...container, maxWidth: 980 }}>
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Questions, answered." center />
        </Reveal>

        <div className="mt-16">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 60}>
                <div
                  className="transition-all"
                  style={{ borderTop: `1px solid ${HAIR_STRONG}` }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-8 text-left transition-colors"
                  >
                    <span
                      style={{
                        fontFamily: HEADING_FONT,
                        fontSize: 26,
                        letterSpacing: "0.01em",
                        color: INK,
                        lineHeight: 1.1,
                      }}
                    >
                      {f.q}
                    </span>
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-500"
                      style={{
                        background: isOpen ? INK : WHITE,
                        color: isOpen ? WHITE : INK,
                        border: `1px solid ${HAIR_STRONG}`,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                      }}
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-700"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="pb-10 pr-16"
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: 16,
                          lineHeight: "30px",
                          color: INK_SOFT,
                          maxWidth: 720,
                        }}
                      >
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
          <div style={{ borderTop: `1px solid ${HAIR_STRONG}` }} />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT — white luxury layout
============================================================ */
function Contact({ content }: SectionProps) {
  const c = content.contact;
  const WHATSAPP = c.whatsapp;
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden"
      style={{ background: WHITE, color: INK, paddingTop: 160, paddingBottom: 180 }}
    >
      <div className="relative mx-auto text-center" style={{ ...container, maxWidth: 1000 }}>
        <Reveal>
          <img
            src={content.media.logo}
            alt="Marshal Travels logo"
            className="mx-auto mb-6"
            style={{ height: 64, width: "auto", objectFit: "contain" }}
          />
          <Eyebrow>Get In Touch</Eyebrow>
          <h2
            className="mt-8"
            style={{
              fontFamily: HEADING_FONT,
              fontSize: "clamp(56px, 9vw, 132px)",
              lineHeight: 0.92,
              letterSpacing: "0.005em",
              color: INK,
            }}
          >
            Let's plan your
            <br />
            <span style={{ fontStyle: "italic", color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>
              journey
            </span>
            .
          </h2>
          <p
            className="mt-8 mx-auto"
            style={{
              fontFamily: BODY_FONT,
              fontSize: 17,
              lineHeight: "32px",
              color: INK_SOFT,
              maxWidth: 580,
            }}
          >
            Reach out for premium travel, airport transfers, and bespoke holiday
            packages across South India.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="mt-14 mx-auto overflow-hidden"
            style={{
              borderRadius: RADIUS,
              boxShadow: SHADOW_LIFT,
              maxWidth: 820,
              aspectRatio: "16 / 9",
            }}
          >
            <iframe
              src={c.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 460 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Marshal Holidays Location"
            />
          </div>
        </Reveal>


        <Reveal delay={200}>
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={c.phoneHref}
              className="inline-flex items-center gap-3 transition-all hover:-translate-y-0.5"
              style={{
                height: 60,
                padding: "0 32px",
                borderRadius: 999,
                background: SOFT,
                border: `1px solid ${HAIR}`,
                color: INK,
                fontFamily: BODY_FONT,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              <Phone className="h-4 w-4" strokeWidth={1.4} style={{ color: GOLD }} />
              {c.phone}
            </a>
            <a
              href={`mailto:${c.email}`}
              className="inline-flex items-center gap-3 transition-all hover:-translate-y-1 hover:gap-5"
              style={{
                height: 60,
                padding: "0 32px",
                borderRadius: 999,
                background: "#EA4335",
                color: WHITE,
                fontFamily: BODY_FONT,
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              <Mail className="h-4 w-4" strokeWidth={1.4} />
              {c.email}
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:gap-5"
              style={{
                height: 60,
                padding: "0 32px",
                borderRadius: 999,
                background: INK,
                color: WHITE,
                fontFamily: BODY_FONT,
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              Chat on WhatsApp
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
            </a>
            <a
              href={c.mapLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 transition-all hover:-translate-y-1 hover:gap-5"
              style={{
                height: 60,
                padding: "0 32px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC04 75%, #EA4335 100%)",
                color: WHITE,
                fontFamily: BODY_FONT,
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              <MapPin className="h-4 w-4" strokeWidth={1.4} />
              View on Google Maps
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.4} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={350}>
          <div className="mt-20">
            <Eyebrow>Service Areas</Eyebrow>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {c.serviceAreas.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 px-5 py-2.5"
                  style={{
                    borderRadius: 999,
                    background: SOFT,
                    border: `1px solid ${HAIR}`,
                    fontFamily: BODY_FONT,
                    fontSize: 13,
                    color: INK,
                    fontWeight: 500,
                  }}
                >
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.4} style={{ color: GOLD }} />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full transition-all hover:-translate-y-1 hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
          color: "#fff",
          boxShadow: "0 20px 50px -10px rgba(37,211,102,0.5)",
        }}
      >
        <MessageCircle className="h-6 w-6" strokeWidth={1.6} />
      </a>
    </section>
  );
}

/* ============================================================
   FOOTER — premium dual-card, cinematic watermark
============================================================ */
function Footer({ content }: SectionProps) {
  const WHATSAPP = content.contact.whatsapp;
  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ background: SOFT, color: INK, paddingTop: 120, paddingBottom: 0 }}
    >
      <div className="relative mx-auto" style={container}>
        {/* Floating dual-card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — cinematic video card */}
          <Reveal className="lg:col-span-5">
            <div
              className="relative h-full min-h-[560px] overflow-hidden flex flex-col justify-between"
              style={{
                borderRadius: RADIUS,
                boxShadow: SHADOW_LIFT,
                padding: 36,
                color: WHITE,
              }}
            >
              <video
                src={content.media.footerVideo}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(17,17,17,0.25) 0%, rgba(17,17,17,0.55) 60%, rgba(17,17,17,0.85) 100%)",
                }}
              />

              <div className="relative">
                <img
                  src={content.media.logo}
                  alt="Marshal Holidays"
                  className="h-11 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                />
              </div>

              <div className="relative">
                <h3
                  style={{
                    fontFamily: HEADING_FONT,
                    fontSize: "clamp(32px, 3.4vw, 44px)",
                    lineHeight: 1.05,
                    letterSpacing: "0.01em",
                  }}
                >
                  {content.footer.heading}
                </h3>
                <p
                  className="mt-5 max-w-md"
                  style={{
                    fontFamily: BODY_FONT,
                    fontSize: 14,
                    lineHeight: "26px",
                    color: "rgba(255,255,255,0.78)",
                  }}
                >
                  {content.footer.description}
                </p>

                <div className="mt-8 flex gap-2.5">
                  {content.social.map(({ platform, href }) => {
                    const Icon = SOCIAL_ICONS[platform] ?? ArrowUpRight;
                    return (
                    <a
                      key={platform}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      className="flex h-11 w-11 items-center justify-center rounded-full transition-all hover:-translate-y-0.5 hover:bg-white hover:text-black"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        border: "1px solid rgba(255,255,255,0.22)",
                        color: WHITE,
                      }}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — premium glass card */}
          <Reveal delay={120} className="lg:col-span-7">
            <div
              className="relative h-full min-h-[560px] overflow-hidden"
              style={{
                borderRadius: RADIUS,
                background: WHITE,
                border: `1px solid ${HAIR}`,
                boxShadow: SHADOW_CARD,
                padding: "44px 44px 40px",
              }}
            >
              {/* Floating cube badge */}
              <div
                className="absolute -top-6 -right-6 animate-[float_7s_ease-in-out_infinite]"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 22,
                  background: `linear-gradient(135deg, ${INK} 0%, #2a2a2a 100%)`,
                  color: WHITE,
                  boxShadow: "0 30px 60px -20px rgba(17,17,17,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: HEADING_FONT,
                  fontSize: 56,
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                  border: `1px solid ${GOLD}55`,
                }}
              >
                M
              </div>

              {/* Handwritten text */}
              <div
                style={{
                  fontFamily: "'Caveat', 'Brush Script MT', cursive",
                  fontSize: 32,
                  color: GOLD,
                  lineHeight: 1.1,
                  letterSpacing: "0.01em",
                }}
              >
                Ready for your next journey?
              </div>

              {/* Three nav columns */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-10">
                <FooterCol
                  title="Navigation"
                  items={[
                    { label: "Home", href: "#" },
                    { label: "Destinations", href: "#destinations" },
                    { label: "Fleets", href: "#fleet" },
                    { label: "Airport Transfers", href: "#airports" },
                    { label: "Blog", href: "/blog" },
                    { label: "Contact", href: "#contact" },
                  ]}
                />
                <FooterCol
                  title="Services"
                  items={[
                    { label: "Family Tours", href: `${WHATSAPP}?text=${encodeURIComponent("Hi Marshal Holidays, I'd like to enquire about Family Tours.")}` },
                    { label: "Honeymoon Packages", href: `${WHATSAPP}?text=${encodeURIComponent("Hi Marshal Holidays, I'd like to enquire about Honeymoon Packages.")}` },
                    { label: "Group Tours", href: `${WHATSAPP}?text=${encodeURIComponent("Hi Marshal Holidays, I'd like to enquire about Group Tours.")}` },
                    { label: "Resort Booking", href: "#resorts" },
                    { label: "Custom Packages", href: `${WHATSAPP}?text=${encodeURIComponent("Hi Marshal Holidays, I'd like a Custom Package quote.")}` },
                  ]}
                />
                <FooterCol
                  title="Company"
                  items={[
                    { label: "About Marshal Holidays", href: "#about" },
                    { label: "Testimonials", href: "#testimonials" },
                    { label: "FAQ", href: "#faq" },
                    { label: "Contact", href: "#contact" },
                  ]}
                />
              </div>

              {/* Bottom CTA */}
              <div
                className="mt-12 pt-10"
                style={{ borderTop: `1px solid ${HAIR}` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                  <h4
                    style={{
                      fontFamily: HEADING_FONT,
                      fontSize: "clamp(26px, 2.4vw, 34px)",
                      lineHeight: 1.1,
                      color: INK,
                      letterSpacing: "0.005em",
                      maxWidth: 420,
                    }}
                  >
                    Travel smarter.
                    <br />
                    Stay comfortable with Marshal Holidays.
                  </h4>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const phone = String(fd.get("phone") || "").trim();
                      const msg = phone
                        ? `Hi Marshal Holidays, please contact me on ${phone}.`
                        : "";
                      window.open(
                        `${WHATSAPP}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="flex items-center w-full lg:w-auto"
                    style={{
                      borderRadius: 999,
                      background: SOFT,
                      border: `1px solid ${HAIR_STRONG}`,
                      padding: 6,
                      minWidth: 320,
                    }}
                  >
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="flex-1 bg-transparent outline-none px-4"
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 14,
                        color: INK,
                        height: 44,
                      }}
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 transition-all hover:gap-3"
                      style={{
                        height: 44,
                        padding: "0 22px",
                        borderRadius: 999,
                        background: INK,
                        color: WHITE,
                        fontFamily: BODY_FONT,
                        fontSize: 13,
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <MessageCircle className="h-4 w-4" strokeWidth={1.6} />
                      Chat on WhatsApp
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Bottom copyright */}
        <div
          className="mt-14 pb-10 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            fontFamily: BODY_FONT,
            fontSize: 12,
            color: INK_MUTE,
            letterSpacing: "0.04em",
          }}
        >
          <span>© 2026 Marshal Holidays. All rights reserved.</span>
          <span>Crafted with care for luxury travel.</span>
        </div>
      </div>

      {/* Cinematic watermark — flush to edges */}
      <div
        aria-hidden
        className="relative w-full overflow-hidden select-none pointer-events-none"
        style={{ marginTop: -20 }}
      >
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontSize: "clamp(80px, 22vw, 340px)",
            lineHeight: 0.85,
            letterSpacing: "-0.02em",
            color: "transparent",
            background: `linear-gradient(180deg, ${INK}26 0%, ${INK}08 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            whiteSpace: "nowrap",
            textAlign: "center",
            paddingBottom: "0.05em",
          }}
        >
          MARSHAL&nbsp;HOLIDAYS
        </div>
      </div>
    </footer>
  );
}

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: BODY_FONT,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: INK_MUTE,
      }}
    >
      {children}
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div>
      <ColTitle>{title}</ColTitle>
      <ul className="mt-6 space-y-3.5">
        {items.map((it) => {
          const internalRoute = it.href.startsWith("/");
          const external = !it.href.startsWith("#") && !internalRoute;
          return (
            <li key={it.label}>
              <a
                href={it.href}
                onClick={(e) => handleClick(e, it.href)}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-block cursor-pointer transition-all hover:translate-x-1 hover:text-black"
                style={{
                  fontFamily: BODY_FONT,
                  fontSize: 14,
                  color: INK_SOFT,
                }}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


/* ============================================================
   EXPORT
============================================================ */
export default function MarshalSections({ content }: SectionProps) {
  return (
    <>
      <About content={content} />
      <Services content={content} />
      <Destinations content={content} />
      <Airports content={content} />
      <Fleets content={content} />
      <Resorts content={content} />
      <Testimonials content={content} />
      <Faq content={content} />
      <Contact content={content} />
      <Footer content={content} />
    </>
  );
}
