import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
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
  Bus,
  ChevronLeft,
  ChevronRight,
  Star,
  ChevronDown,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  ShieldCheck,
  Clock,
  Award,
} from "lucide-react";

const WHATSAPP = "https://wa.me/919188700777?utm_source=chatgpt.com";

const HEADING_FONT = "'Bebas Neue', sans-serif";
const BODY_FONT = "Inter, sans-serif";

/* Light palette */
const INK = "#0B0B0F";
const INK_SOFT = "rgba(11,11,15,0.65)";
const INK_MUTE = "rgba(11,11,15,0.5)";
const GOLD = "#B8893A";
const GOLD_SOFT = "#E7C27A";
const BG = "#F7F5F0"; // warm off-white
const BG_ALT = "#FFFFFF";
const BORDER = "rgba(11,11,15,0.08)";

/* ---------------- Reveal on scroll ---------------- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    // If element is already in/near viewport on mount, show immediately
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
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
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
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s ease-out ${delay}ms, transform 0.9s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- Section Heading ---------------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
      style={{
        background: "rgba(184,137,58,0.08)",
        border: `1px solid rgba(184,137,58,0.25)`,
        fontFamily: BODY_FONT,
        fontSize: 12,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: GOLD,
        fontWeight: 600,
      }}
    >
      <Sparkles className="h-3.5 w-3.5" style={{ color: GOLD }} />
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
    <div className={center ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2
        className="mt-5"
        style={{
          fontFamily: HEADING_FONT,
          fontSize: "clamp(36px, 5vw, 64px)",
          lineHeight: 1.02,
          letterSpacing: "0.01em",
          color: INK,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-5"
          style={{
            fontFamily: BODY_FONT,
            fontSize: 17,
            lineHeight: "30px",
            color: INK_SOFT,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   ABOUT
============================================================ */
function About() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden"
      style={{ background: BG, color: INK, paddingTop: 120, paddingBottom: 140 }}
    >
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(184,137,58,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(120,160,255,0.08) 0%, transparent 70%)" }}
      />

      <div
        className="relative mx-auto grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center"
        style={{
          maxWidth: 1320,
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <Reveal>
          <div className="relative h-[520px] sm:h-[600px]">
            <div
              className="absolute left-0 top-0 h-[78%] w-[68%] overflow-hidden rounded-3xl"
              style={{ boxShadow: "0 30px 80px -20px rgba(11,11,15,0.25)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80"
                alt="Kerala landscape"
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-110"
              />
            </div>
            <div
              className="absolute bottom-0 right-0 h-[55%] w-[55%] overflow-hidden rounded-3xl"
              style={{ boxShadow: "0 30px 80px -20px rgba(11,11,15,0.3)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
                alt="Premium travel"
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-110"
              />
            </div>
            <div
              className="absolute -left-2 sm:left-4 top-4 rounded-2xl px-5 py-4 animate-[float_6s_ease-in-out_infinite]"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${BORDER}`,
                boxShadow: "0 20px 50px -10px rgba(11,11,15,0.2)",
              }}
            >
              <div style={{ fontFamily: HEADING_FONT, fontSize: 36, color: GOLD, lineHeight: 1 }}>
                12+
              </div>
              <div
                style={{
                  fontFamily: BODY_FONT,
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: INK_SOFT,
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                Years of Service
              </div>
            </div>
            <div
              className="absolute -right-2 sm:right-4 bottom-[42%] rounded-2xl px-5 py-4 animate-[float_7s_ease-in-out_infinite]"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${BORDER}`,
                boxShadow: "0 20px 50px -10px rgba(11,11,15,0.2)",
              }}
            >
              <div style={{ fontFamily: HEADING_FONT, fontSize: 36, color: GOLD, lineHeight: 1 }}>
                5K+
              </div>
              <div
                style={{
                  fontFamily: BODY_FONT,
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: INK_SOFT,
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                Happy Travelers
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div>
            <SectionHeading
              eyebrow="About Marshal Holidays"
              title="Welcome to Marshal Holidays"
              subtitle="From premium tourist vehicles and comfortable airport transfers to customized holiday packages, we make every trip smooth, safe, and memorable. Whether it's a family vacation, group tour, honeymoon, corporate travel, or a weekend getaway, Marshal Holidays is here to take you there with comfort and care."
            />

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: ShieldCheck, label: "Safe Travel" },
                { icon: Clock, label: "24/7 Support" },
                { icon: Award, label: "Premium Fleet" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl p-5 transition-all hover:-translate-y-1"
                  style={{
                    background: BG_ALT,
                    border: `1px solid ${BORDER}`,
                    boxShadow: "0 10px 30px -15px rgba(11,11,15,0.15)",
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: GOLD }} />
                  <div
                    className="mt-3"
                    style={{ fontFamily: BODY_FONT, fontSize: 14, fontWeight: 600, color: INK }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-lg px-6 transition-all hover:-translate-y-0.5"
              style={{
                height: 48,
                background: INK,
                color: "#fff",
                fontFamily: BODY_FONT,
                fontSize: 15,
                fontWeight: 600,
                boxShadow: "0 15px 40px -10px rgba(11,11,15,0.4)",
              }}
            >
              Plan Your Journey
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SERVICES
============================================================ */
const SERVICES = [
  { icon: Users, title: "Family Tours", desc: "Comfortable getaways crafted for every age." },
  { icon: Heart, title: "Honeymoon Packages", desc: "Romantic escapes to dreamy destinations." },
  { icon: UsersRound, title: "Group Tours", desc: "Memorable journeys for friends & teams." },
  { icon: Church, title: "Pilgrimage Tours", desc: "Spiritual travel with reverent comfort." },
  { icon: GraduationCap, title: "Educational & College Trips", desc: "Safe, fun, organised student travel." },
  { icon: Plane, title: "Airport Transfer Services", desc: "Reliable pickups & drops, on time, every time." },
  { icon: Sparkles, title: "Customised Holiday Packages", desc: "Tailored itineraries that fit you perfectly." },
];

function Services() {
  return (
    <section
      id="services"
      className="relative w-full overflow-hidden"
      style={{ background: BG_ALT, color: INK, paddingTop: 120, paddingBottom: 140 }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 1320,
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <Reveal>
          <SectionHeading
            eyebrow="Our Services"
            title="Choose Your Journey"
            subtitle="From short getaways to grand expeditions — pick the experience and we'll craft it to perfection."
            center
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SERVICES.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 70}>
              <div
                className="group relative h-full overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: BG,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 10px 40px -20px rgba(11,11,15,0.15)",
                }}
              >
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(184,137,58,0.25) 0%, transparent 70%)",
                  }}
                />
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(184,137,58,0.18), rgba(184,137,58,0.04))",
                    border: `1px solid rgba(184,137,58,0.3)`,
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: GOLD }} />
                </div>
                <h3
                  className="mt-6"
                  style={{
                    fontFamily: HEADING_FONT,
                    fontSize: 26,
                    letterSpacing: "0.01em",
                    color: INK,
                  }}
                >
                  {title}
                </h3>
                <p
                  className="mt-3"
                  style={{
                    fontFamily: BODY_FONT,
                    fontSize: 14,
                    lineHeight: "24px",
                    color: INK_SOFT,
                  }}
                >
                  {desc}
                </p>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 transition-all group-hover:gap-3"
                  style={{
                    fontFamily: BODY_FONT,
                    fontSize: 13,
                    fontWeight: 600,
                    color: GOLD,
                    letterSpacing: "0.04em",
                  }}
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DESTINATIONS
============================================================ */
const DESTINATIONS = [
  { name: "Munnar", img: "https://images.unsplash.com/photo-1609766975161-d390cdc7c89e?auto=format&fit=crop&w=900&q=80" },
  { name: "Ooty", img: "https://images.unsplash.com/photo-1580793241537-fb236ddca8a3?auto=format&fit=crop&w=900&q=80" },
  { name: "Kodaikanal", img: "https://images.unsplash.com/photo-1591018653829-f5ad7eef3186?auto=format&fit=crop&w=900&q=80" },
  { name: "Mysore", img: "https://images.unsplash.com/photo-1600100397196-1a7bb3a09d6e?auto=format&fit=crop&w=900&q=80" },
  { name: "Coorg", img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80" },
  { name: "Wayanad", img: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80" },
  { name: "Alleppey", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80" },
  { name: "Thekkady", img: "https://images.unsplash.com/photo-1567606404787-d4e1e6f3e1a8?auto=format&fit=crop&w=900&q=80" },
  { name: "Varkala", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80" },
  { name: "Goa", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80" },
  { name: "Hyderabad", img: "https://images.unsplash.com/photo-1626714086015-c63379ec4a1b?auto=format&fit=crop&w=900&q=80" },
  { name: "Pondicherry", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80" },
  { name: "Yercaud", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80" },
  { name: "Chikmagalur", img: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?auto=format&fit=crop&w=900&q=80" },
  { name: "Rameswaram", img: "https://images.unsplash.com/photo-1582636047939-bf8f43b95f80?auto=format&fit=crop&w=900&q=80" },
  { name: "Hampi", img: "https://images.unsplash.com/photo-1600100397196-1a7bb3a09d6e?auto=format&fit=crop&w=900&q=80" },
];

function Destinations() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(4);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 640) setPerView(1);
      else if (w < 1024) setPerView(2);
      else if (w < 1280) setPerView(3);
      else setPerView(4);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const max = DESTINATIONS.length - perView;
  const go = (d: number) => setIndex((i) => Math.max(0, Math.min(max, i + d)));

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i >= max ? 0 : i + 1));
    }, 3500);
    return () => clearInterval(t);
  }, [max]);

  return (
    <section
      id="destinations"
      className="relative w-full overflow-hidden"
      style={{ background: BG, color: INK, paddingTop: 120, paddingBottom: 140 }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 1320,
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <SectionHeading
              eyebrow="Popular Destinations"
              title="Where do you dream of going?"
              subtitle="Cinematic landscapes, vibrant cities and hidden gems across South India."
            />
            <div className="flex gap-3">
              <button
                onClick={() => go(-1)}
                className="flex h-12 w-12 items-center justify-center rounded-full transition-all hover:-translate-y-0.5"
                style={{
                  background: BG_ALT,
                  border: `1px solid ${BORDER}`,
                  color: INK,
                  boxShadow: "0 10px 25px -10px rgba(11,11,15,0.15)",
                }}
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(1)}
                className="flex h-12 w-12 items-center justify-center rounded-full transition-all hover:-translate-y-0.5"
                style={{
                  background: INK,
                  color: "#fff",
                  boxShadow: "0 10px 25px -10px rgba(11,11,15,0.4)",
                }}
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 overflow-hidden">
          <div
            className="flex"
            style={{
              transform: `translateX(-${(index * 100) / perView}%)`,
              transition: "transform 0.9s cubic-bezier(0.7,0,0.3,1)",
            }}
          >
            {DESTINATIONS.map((d) => (
              <div
                key={d.name}
                className="shrink-0 px-3"
                style={{ width: `${100 / perView}%` }}
              >
                <div
                  className="group relative h-[440px] overflow-hidden rounded-3xl"
                  style={{ boxShadow: "0 20px 60px -20px rgba(11,11,15,0.25)" }}
                >
                  <img
                    src={d.img}
                    alt={d.name}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: GOLD_SOFT }} />
                      <span
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: 12,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.85)",
                        }}
                      >
                        South India
                      </span>
                    </div>
                    <h3
                      className="mt-2"
                      style={{
                        fontFamily: HEADING_FONT,
                        fontSize: 36,
                        lineHeight: 1,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {d.name}
                    </h3>
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 transition-all group-hover:gap-3"
                      style={{
                        fontFamily: BODY_FONT,
                        fontSize: 13,
                        fontWeight: 600,
                        color: GOLD_SOFT,
                      }}
                    >
                      Explore <ArrowRight className="h-4 w-4" />
                    </a>
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
   AIRPORT TRANSFERS
============================================================ */
const AIRPORTS = [
  "Cochin International Airport",
  "Trivandrum International Airport",
  "Calicut International Airport",
  "Kannur International Airport",
];
const COVERAGE = ["Chavakkad", "Guruvayur", "Orumanayur", "Pavaratty", "Mullassery"];

function Airports() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: BG_ALT, color: INK, paddingTop: 120, paddingBottom: 140 }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 1320,
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <Reveal>
          <SectionHeading
            eyebrow="Airport Transfers"
            title="Smooth airport pickups & drops"
            subtitle="Reliable, punctual, and luxurious airport transfers across Kerala's major airports."
            center
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AIRPORTS.map((a, i) => (
            <Reveal key={a} delay={i * 80}>
              <div
                className="group relative h-full overflow-hidden rounded-3xl p-7 transition-all hover:-translate-y-2"
                style={{
                  background: BG,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 10px 40px -20px rgba(11,11,15,0.15)",
                }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6"
                  style={{
                    background: "linear-gradient(135deg, rgba(60,100,200,0.18), rgba(60,100,200,0.04))",
                    border: `1px solid rgba(60,100,200,0.25)`,
                  }}
                >
                  <Plane className="h-6 w-6" style={{ color: "#3C64C8" }} />
                </div>
                <h3
                  className="mt-6"
                  style={{
                    fontFamily: HEADING_FONT,
                    fontSize: 24,
                    letterSpacing: "0.01em",
                    lineHeight: 1.1,
                    color: INK,
                  }}
                >
                  {a}
                </h3>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5"
                  style={{
                    fontFamily: BODY_FONT,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#3C64C8",
                  }}
                >
                  Book Transfer <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={250}>
          <div
            className="mt-14 rounded-3xl p-8"
            style={{
              background: BG,
              border: `1px solid ${BORDER}`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div
                  style={{
                    fontFamily: BODY_FONT,
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: INK_MUTE,
                    fontWeight: 600,
                  }}
                >
                  Pickup & Drop Coverage
                </div>
                <div
                  className="mt-2"
                  style={{ fontFamily: HEADING_FONT, fontSize: 32, letterSpacing: "0.01em", color: INK }}
                >
                  Serving Across Thrissur Region
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {COVERAGE.map((c) => (
                  <span
                    key={c}
                    className="rounded-full px-4 py-2"
                    style={{
                      background: BG_ALT,
                      border: `1px solid ${BORDER}`,
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   FLEETS
============================================================ */
const FLEETS = [
  {
    name: "Toyota Innova Crysta",
    seats: "7 Seats",
    badge: "Premium",
    img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Force Urbania",
    seats: "12 Seats",
    badge: "Luxury Van",
    img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Force Traveller",
    seats: "26 Seats",
    badge: "Mini Coach",
    img: "https://images.unsplash.com/photo-1597007030739-6d2e7f5cdd75?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Tourist Bus",
    seats: "AC & Non-AC",
    badge: "Group Travel",
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
  },
];

function Fleets() {
  return (
    <section
      id="fleet"
      className="relative w-full overflow-hidden"
      style={{ background: BG, color: INK, paddingTop: 120, paddingBottom: 140 }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 1320,
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <Reveal>
          <SectionHeading
            eyebrow="Our Fleets"
            title="Travel in luxury & comfort"
            subtitle="Hand-picked premium vehicles maintained to the highest standards."
            center
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-7">
          {FLEETS.map((f, i) => (
            <Reveal key={f.name} delay={i * 90}>
              <div
                className="group relative overflow-hidden rounded-3xl"
                style={{
                  background: BG_ALT,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 20px 60px -25px rgba(11,11,15,0.2)",
                }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.name}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                  />
                  <span
                    className="absolute left-5 top-5 rounded-full px-3 py-1"
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      color: GOLD,
                      fontFamily: BODY_FONT,
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    {f.badge}
                  </span>
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      style={{
                        fontFamily: HEADING_FONT,
                        fontSize: 30,
                        letterSpacing: "0.01em",
                        color: INK,
                      }}
                    >
                      {f.name}
                    </h3>
                    <span
                      className="rounded-full px-3 py-1.5"
                      style={{
                        background: BG,
                        border: `1px solid ${BORDER}`,
                        fontFamily: BODY_FONT,
                        fontSize: 12,
                        color: INK,
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                      }}
                    >
                      {f.seats}
                    </span>
                  </div>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 transition-all hover:-translate-y-0.5"
                    style={{
                      height: 44,
                      background: INK,
                      color: "#fff",
                      fontFamily: BODY_FONT,
                      fontSize: 14,
                      fontWeight: 600,
                      boxShadow: "0 10px 30px -10px rgba(11,11,15,0.35)",
                    }}
                  >
                    <Bus className="h-4 w-4" />
                    Book Now
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
   RESORTS
============================================================ */
const RESORTS = [
  { name: "Guruvayoor", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80" },
  { name: "Munnar", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80" },
  { name: "Thekkady", img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80" },
  { name: "Wayanad", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80" },
  { name: "Varkala", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=80" },
  { name: "Alleppey", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80" },
  { name: "Ooty", img: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=900&q=80" },
  { name: "Kodaikanal", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80" },
  { name: "Coorg", img: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80" },
];

function Resorts() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: BG_ALT, color: INK, paddingTop: 120, paddingBottom: 140 }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 1320,
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <Reveal>
          <SectionHeading
            eyebrow="Room & Resort Booking"
            title="Stays as memorable as the journey"
            subtitle="Curated luxury resorts and premium stays across the most loved destinations."
            center
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESORTS.map((r, i) => (
            <Reveal key={r.name} delay={i * 60}>
              <div
                className="group relative h-80 overflow-hidden rounded-3xl"
                style={{ boxShadow: "0 20px 60px -25px rgba(11,11,15,0.25)" }}
              >
                <img
                  src={r.img}
                  alt={r.name}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.85) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div
                    style={{
                      fontFamily: BODY_FONT,
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: GOLD_SOFT,
                      fontWeight: 600,
                    }}
                  >
                    Luxury Stay
                  </div>
                  <h3
                    className="mt-1"
                    style={{ fontFamily: HEADING_FONT, fontSize: 32, letterSpacing: "0.02em" }}
                  >
                    {r.name}
                  </h3>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 transition-all group-hover:gap-3"
                    style={{ fontFamily: BODY_FONT, fontSize: 13, fontWeight: 600, color: "#fff" }}
                  >
                    Book Stay <ArrowRight className="h-4 w-4" />
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
   TESTIMONIALS
============================================================ */
const TESTIMONIALS = [
  { quote: "Excellent service and very comfortable trip experience.", name: "Arjun M.", role: "Family Tour" },
  { quote: "Best airport transfer service near Guruvayur.", name: "Priya S.", role: "Airport Transfer" },
  { quote: "Our college tour was perfectly managed from start to finish.", name: "Rahul K.", role: "College Trip" },
];

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: BG, color: INK, paddingTop: 120, paddingBottom: 140 }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(184,137,58,0.10) 0%, transparent 60%)",
        }}
      />
      <div
        className="relative mx-auto"
        style={{
          maxWidth: 1100,
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <Reveal>
          <SectionHeading eyebrow="Testimonials" title="Loved by travelers" center />
        </Reveal>

        <Reveal delay={150}>
          <div
            key={i}
            className="mt-14 rounded-3xl p-10 sm:p-14 text-center animate-fade-in"
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${BORDER}`,
              boxShadow: "0 30px 80px -20px rgba(11,11,15,0.18)",
            }}
          >
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="h-5 w-5 fill-current" style={{ color: GOLD }} />
              ))}
            </div>
            <p
              className="mt-8 mx-auto"
              style={{
                fontFamily: HEADING_FONT,
                fontSize: "clamp(26px, 3.4vw, 42px)",
                lineHeight: 1.2,
                letterSpacing: "0.01em",
                maxWidth: 800,
                color: INK,
              }}
            >
              "{t.quote}"
            </p>
            <div className="mt-8">
              <div style={{ fontFamily: BODY_FONT, fontSize: 15, fontWeight: 600, color: INK }}>
                {t.name}
              </div>
              <div
                style={{ fontFamily: BODY_FONT, fontSize: 13, color: INK_SOFT, marginTop: 4 }}
              >
                {t.role}
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-2">
              {TESTIMONIALS.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: k === i ? 32 : 12,
                    background: k === i ? GOLD : "rgba(11,11,15,0.15)",
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
   FAQ
============================================================ */
const FAQS = [
  { q: "Do you provide customized tour packages?", a: "Yes — we craft fully tailored itineraries for families, groups, honeymoons, corporate trips and more." },
  { q: "Are airport pickup and drop services available?", a: "Absolutely. We cover Cochin, Trivandrum, Calicut and Kannur airports with premium vehicles 24/7." },
  { q: "Can we book vehicles for group tours?", a: "Yes. From 7-seater Innovas to 26-seater Travellers and full Tourist Buses — AC & Non-AC available." },
  { q: "Do you provide hotel and resort booking?", a: "Yes, we partner with premium resorts across Munnar, Thekkady, Wayanad, Alleppey and more." },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: BG_ALT, color: INK, paddingTop: 120, paddingBottom: 140 }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 980,
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Questions, answered" center />
        </Reveal>

        <div className="mt-14 space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 70}>
                <div
                  className="overflow-hidden rounded-2xl transition-all"
                  style={{
                    background: isOpen ? BG : "transparent",
                    border: `1px solid ${BORDER}`,
                    boxShadow: isOpen ? "0 10px 30px -15px rgba(11,11,15,0.15)" : "none",
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                  >
                    <span
                      style={{ fontFamily: BODY_FONT, fontSize: 17, fontWeight: 600, color: INK }}
                    >
                      {f.q}
                    </span>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 transition-transform"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                        color: GOLD,
                      }}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-500"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="px-6 pb-6"
                        style={{
                          fontFamily: BODY_FONT,
                          fontSize: 15,
                          lineHeight: "26px",
                          color: INK_SOFT,
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
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT  (kept dark for premium contrast)
============================================================ */
function Contact() {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden text-white"
      style={{
        paddingTop: 140,
        paddingBottom: 140,
        background: "radial-gradient(ellipse at top, #1a1a22 0%, #050507 60%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(231,194,122,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(120,160,255,0.18) 0%, transparent 50%)",
        }}
      />
      <div
        className="relative mx-auto text-center"
        style={{
          maxWidth: 900,
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <Reveal>
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md"
            style={{
              fontFamily: BODY_FONT,
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: GOLD_SOFT,
              fontWeight: 600,
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Get In Touch
          </span>
          <h2
            className="mt-6"
            style={{
              fontFamily: HEADING_FONT,
              fontSize: "clamp(44px, 7vw, 88px)",
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}
          >
            Let's plan your journey
          </h2>
          <p
            className="mt-6 mx-auto"
            style={{
              fontFamily: BODY_FONT,
              fontSize: 17,
              lineHeight: "30px",
              color: "rgba(255,255,255,0.7)",
              maxWidth: 560,
            }}
          >
            Reach out today for premium travel, airport transfers, and customised
            holiday packages across South India.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919188700777"
              className="inline-flex items-center gap-3 rounded-lg border border-white/20 bg-white/5 px-6 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/10"
              style={{
                height: 56,
                fontFamily: BODY_FONT,
                fontSize: 16,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              <Phone className="h-5 w-5" style={{ color: GOLD_SOFT }} />
              +91 91887 00777
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-lg px-6 transition-all hover:-translate-y-0.5"
              style={{
                height: 56,
                background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                color: "#fff",
                fontFamily: BODY_FONT,
                fontSize: 16,
                fontWeight: 600,
                boxShadow: "0 20px 40px -10px rgba(37,211,102,0.45)",
              }}
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal delay={350}>
          <div className="mt-14">
            <div
              style={{
                fontFamily: BODY_FONT,
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Service Areas
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Guruvayur", "Chavakkad", "Thrissur", "Kerala"].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2"
                  style={{
                    fontFamily: BODY_FONT,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <MapPin className="mr-1.5 -mt-0.5 inline h-3.5 w-3.5" style={{ color: GOLD_SOFT }} />
                  {s}
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
   FOOTER
============================================================ */
function Footer() {
  return (
    <footer className="relative w-full bg-[#040406] text-white">
      <div
        className="mx-auto"
        style={{
          maxWidth: 1320,
          paddingTop: 80,
          paddingBottom: 40,
          paddingLeft: "clamp(20px, 6vw, 80px)",
          paddingRight: "clamp(20px, 6vw, 80px)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div
              style={{
                fontFamily: HEADING_FONT,
                fontSize: 32,
                letterSpacing: "0.04em",
                color: "#fff",
              }}
            >
              MARSHAL
            </div>
            <p
              className="mt-4"
              style={{
                fontFamily: BODY_FONT,
                fontSize: 14,
                lineHeight: "24px",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Premium tourist vehicles, airport transfers and customised holiday
              packages across South India.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Youtube, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Quick Links" items={["Home", "About Us", "Fleet", "Destinations", "Contact"]} />
          <FooterCol
            title="Services"
            items={["Family Tours", "Honeymoon Packages", "Group Tours", "Airport Transfers", "Resort Booking"]}
          />

          <div>
            <div
              style={{
                fontFamily: BODY_FONT,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Contact
            </div>
            <ul
              className="mt-6 space-y-3"
              style={{
                fontFamily: BODY_FONT,
                fontSize: 14,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-1" style={{ color: GOLD_SOFT }} />
                +91 91887 00777
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1" style={{ color: GOLD_SOFT }} />
                Guruvayur, Thrissur, Kerala
              </li>
              <li>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-2 rounded-lg px-4 py-2 transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    fontFamily: BODY_FONT,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8"
          style={{ fontFamily: BODY_FONT, fontSize: 13, color: "rgba(255,255,255,0.5)" }}
        >
          <span>© {new Date().getFullYear()} Marshal Holidays. All rights reserved.</span>
          <span>Crafted with care for luxury travel.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div
        style={{
          fontFamily: BODY_FONT,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {title}
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((it) => (
          <li key={it}>
            <a
              href="#"
              className="inline-block transition-all hover:translate-x-1 hover:text-white"
              style={{
                fontFamily: BODY_FONT,
                fontSize: 14,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   EXPORT
============================================================ */
export default function MarshalSections() {
  return (
    <>
      <About />
      <Services />
      <Destinations />
      <Airports />
      <Fleets />
      <Resorts />
      <Testimonials />
      <Faq />
      <Contact />
      <Footer />
    </>
  );
}
