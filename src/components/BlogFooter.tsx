import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import marshalLogo from "@/assets/marshal-logo.png";

const WHATSAPP = "https://wa.me/919188700777";

const SOCIALS = [
  { Icon: Facebook, href: "https://www.facebook.com/share/1ErcXUcLtx/?mibextid=wwXIfr", label: "Facebook" },
  { Icon: Instagram, href: "https://www.instagram.com/marshalholidays?utm_source=qr", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@marshalholidays?si=twP5Fp6i0YLahBI6", label: "YouTube" },
];

export default function BlogFooter() {
  return (
    <footer className="bg-[#272835] text-white">
      <div
        className="mx-auto max-w-6xl py-14 md:py-16"
        style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src={marshalLogo} alt="Marshal Holidays" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p
              className="mt-4 max-w-xs text-white/60"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: 1.6 }}
            >
              Kerala's premium chauffeur-driven travel partner — destination guides, itineraries, and journey notes.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white hover:text-[#272835]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4
              className="text-[#9a8666] uppercase"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.16em" }}
            >
              Explore
            </h4>
            <ul
              className="mt-4 space-y-3 text-white/70"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
            >
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Plan a trip
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4
              className="text-[#9a8666] uppercase"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.16em" }}
            >
              Contact
            </h4>
            <ul
              className="mt-4 space-y-3 text-white/70"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}
            >
              <li>
                <a href="tel:+919188700777" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="h-4 w-4" style={{ color: "#9a8666" }} /> +91 91887 00777
                </a>
              </li>
              <li>
                <a
                  href="mailto:info.marshalholidays@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" style={{ color: "#9a8666" }} /> info.marshalholidays@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 border-t border-white/10 pt-6 text-white/50"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "13px" }}
        >
          © {new Date().getFullYear()} Marshal Holidays. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
