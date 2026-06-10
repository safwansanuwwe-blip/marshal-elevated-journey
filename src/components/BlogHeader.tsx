import { Link } from "@tanstack/react-router";

export default function BlogHeader() {
  return (
    <header className="border-b border-black/5 bg-white/90 backdrop-blur sticky top-0 z-30">
      <div
        className="mx-auto max-w-6xl flex items-center justify-between py-4"
        style={{ paddingLeft: "clamp(20px, 6vw, 80px)", paddingRight: "clamp(20px, 6vw, 80px)" }}
      >
        <Link
          to="/"
          className="text-[#272835] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "26px", letterSpacing: "0.02em" }}
        >
          MARSHAL HOLIDAYS
        </Link>
        <nav
          className="flex items-center gap-6 text-[#272835]/80"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500 }}
        >
          <Link to="/" className="hover:text-[#272835]">Home</Link>
          <Link to="/blog" className="hover:text-[#272835] font-semibold">Blog</Link>
        </nav>
      </div>
    </header>
  );
}
