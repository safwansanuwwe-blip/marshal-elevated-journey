import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import marshalLogo from "@/assets/marshal-logo.png";

const WHATSAPP = "https://wa.me/919188700777";

export default function BlogHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 py-4"
        style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
      >
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img src={marshalLogo} alt="Marshal Holidays" className="h-9 w-auto" />
          <span
            className="hidden sm:inline text-[#272835] leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "0.02em" }}
          >
            Marshal Holidays
          </span>
        </Link>

        <nav
          className="flex items-center gap-6 text-[#272835]/70"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500 }}
        >
          <Link to="/" className="hidden sm:inline hover:text-[#272835] transition-colors">
            Home
          </Link>
          <Link to="/blog" className="hover:text-[#272835] transition-colors">
            Blog
          </Link>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#272835] px-4 py-2 text-white transition-colors hover:bg-black"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Plan a trip</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
