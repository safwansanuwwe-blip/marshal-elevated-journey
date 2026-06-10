import { Link } from "@tanstack/react-router";

export default function BlogFooter() {
  return (
    <footer className="border-t border-black/5 bg-[#272835] text-white">
      <div
        className="mx-auto max-w-6xl py-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
      >
        <div>
          <p
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px", letterSpacing: "0.02em" }}
          >
            MARSHAL HOLIDAYS
          </p>
          <p
            className="mt-2 text-white/60"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: 1.6 }}
          >
            Premium Kerala tour & transport services. Chauffeur-driven journeys since 2013.
          </p>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px" }}>
          <p className="text-white/40 uppercase tracking-[0.18em] text-[11px] font-semibold mb-3">
            Explore
          </p>
          <ul className="space-y-2 text-white/80">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px" }}>
          <p className="text-white/40 uppercase tracking-[0.18em] text-[11px] font-semibold mb-3">
            Contact
          </p>
          <ul className="space-y-2 text-white/80">
            <li>info.marshalholidays@gmail.com</li>
          </ul>
        </div>
      </div>
      <div
        className="border-t border-white/10 py-5 text-center text-white/40"
        style={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}
      >
        © {new Date().getFullYear()} Marshal Holidays. All rights reserved.
      </div>
    </footer>
  );
}
