// Site content model + defaults.
//
// The whole public site reads its copy/lists from a single `SiteContent`
// object. `DEFAULT_CONTENT` mirrors the original hard-coded values, and the
// admin dashboard stores overrides in the `site_content` table (JSONB). At
// runtime we deep-merge the stored data over the defaults, so the site keeps
// working even before anything is saved and when new fields are added later.

import alleppeyImg from "@/assets/alleppey.jpg";
import coorgImg from "@/assets/coorg.jpg";
import dhanushkodiImg from "@/assets/dhanushkodi.jpg";
import varkalaImg from "@/assets/varkala.jpg";
import yercaudImg from "@/assets/yercaud.jpg";
import ootyImg from "@/assets/ooty.jpg";
import kodaikanalImg from "@/assets/kodaikanal.jpg";
import hyderabadImg from "@/assets/hyderabad.jpg";
import wayanadImg from "@/assets/wayanad.jpg";
import thekkadyImg from "@/assets/thekkady.jpg";
import mysoreImg from "@/assets/mysore.jpg";
import pondicherryImg from "@/assets/pondicherry.jpg";
import chikmagalurImg from "@/assets/chikmagalur.jpg";
import munnarImg from "@/assets/munnar.jpg";
import cochinAirportImg from "@/assets/cochin-airport.jpg";
import calicutAirportImg from "@/assets/calicut-airport.jpg";
import trivandrumAirportImg from "@/assets/trivandrum-airport.jpg";
import kannurAirportImg from "@/assets/kannur-airport.jpg";
import fleetInnovaImg from "@/assets/fleet-innova.png";
import fleetUrbaniaImg from "@/assets/fleet-urbania.png";
import fleetTravellerImg from "@/assets/fleet-traveller.png";
import fleetBusImg from "@/assets/fleet-bus.png";
import marshalLogoImg from "@/assets/marshal-logo.png";
import heroPosterImg from "@/assets/marshal-bg.jpg";

export type NavLink = { label: string; href: string };
export type SocialLink = { platform: string; href: string };

export type SiteContent = {
  seo: {
    title: string;
    description: string;
    socialDescription: string;
    ogImage: string;
    keywords: string;
  };
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    whatsapp: string;
    mapEmbedUrl: string;
    mapLink: string;
    serviceAreas: string[];
  };
  social: SocialLink[];
  hero: {
    welcomeHeading: string;
    navLinks: NavLink[];
    bookNowLabel: string;
    exploreLabel: string;
    taglineTitle: string;
    taglineSubtitle: string;
    ctaLabel: string;
    ctaHref: string;
    headline: string;
  };
  about: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stat1Top: string;
    stat1Bottom: string;
    stat2Top: string;
    stat2Bottom: string;
    features: string[];
    ctaLabel: string;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[];
  };
  destinations: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { name: string; region: string; img: string }[];
  };
  airports: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { name: string; code: string; full: string }[];
    coverageTitle: string;
    coverage: string[];
  };
  fleets: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { name: string; seats: string; badge: string; img: string }[];
  };
  resorts: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { name: string; img: string }[];
  };
  testimonials: {
    items: { quote: string; name: string; role: string }[];
  };
  faqs: {
    items: { q: string; a: string }[];
  };
  footer: {
    heading: string;
    description: string;
  };
  media: {
    logo: string;
    heroPoster: string;
    heroVideoDesktop: string;
    heroVideoMobile: string;
    aboutVideo1: string;
    aboutVideo2: string;
    footerVideo: string;
    airportPhotos: { img: string; alt: string }[];
  };
};

const WHATSAPP = "https://wa.me/919188700777";

export const DEFAULT_CONTENT: SiteContent = {
  seo: {
    title: "Marshal Holidays — Premium Kerala Chauffeur & Tour Experiences",
    description:
      "Marshal Holidays offers premium chauffeur-driven tours and luxury travel across Kerala — backwaters, hill stations, and beaches with 12+ years of trusted service.",
    socialDescription:
      "Luxury chauffeur-driven journeys across Kerala. Backwaters, hills, beaches — crafted by Marshal Holidays.",
    ogImage:
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d4a66333-3f2c-48fc-b1b5-45a8816eb784/id-preview-5f23fa6f--a5daecb7-c446-425e-8ca3-a3b225f7e4c7.lovable.app-1779566633057.png",
    keywords:
      "Kerala tour packages, chauffeur, airport transfer, Guruvayur, Thrissur, luxury travel, Innova, Urbania",
  },
  contact: {
    phone: "+91 91887 00777",
    phoneHref: "tel:+919188700777",
    email: "info.marshalholidays@gmail.com",
    whatsapp: WHATSAPP,
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.6385!2d76.0764!3d10.5796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba79300216e31ff%3A0xb7393fa9ab1137c8!2sMarshal%20Holidays!5e0!3m2!1sen!2sin!4v1716540000000!5m2!1sen!2sin",
    mapLink: "https://maps.app.goo.gl/ZgufaygNto4HigW3A?g_st=ic",
    serviceAreas: ["Guruvayur", "Chavakkad", "Thrissur", "Kerala"],
  },
  social: [
    { platform: "Facebook", href: "https://www.facebook.com/share/1ErcXUcLtx/?mibextid=wwXIfr" },
    { platform: "Instagram", href: "https://www.instagram.com/marshalholidays?utm_source=qr" },
    { platform: "X", href: "https://x.com/marshalholidays?s=11" },
    { platform: "YouTube", href: "https://youtube.com/@marshalholidays?si=twP5Fp6i0YLahBI6" },
  ],
  hero: {
    welcomeHeading: "Welcome to Marshal Holidays",
    navLinks: [
      { label: "Home", href: "#" },
      { label: "Fleet", href: "#fleet" },
      { label: "Packages", href: "#services" },
      { label: "About Us", href: "#about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "#contact" },
    ],
    bookNowLabel: "Book Now",
    exploreLabel: "Explore",
    taglineTitle: "Premium Kerala Tour & Transport Services",
    taglineSubtitle: "Airport Transfers • Holiday Packages • Luxury Rides",
    ctaLabel: "View Fleet",
    ctaHref: "#fleet",
    headline: "Luxury journeys begin with Marshal",
  },
  about: {
    eyebrow: "About Marshal Holidays",
    title: "Quiet luxury, in motion.",
    subtitle:
      "From premium tourist vehicles and discreet airport transfers to bespoke holiday journeys — we design effortless travel for those who value comfort, time, and the finer details.",
    stat1Top: "Years of",
    stat1Bottom: "Service",
    stat2Top: "5K+",
    stat2Bottom: "Happy Travelers",
    features: ["Safe Travel", "24/7 Support", "Premium Fleet"],
    ctaLabel: "Plan Your Journey",
  },
  services: {
    eyebrow: "Our Services",
    title: "Choose your journey.",
    subtitle:
      "From short escapes to grand expeditions — pick the experience and we'll craft it to perfection.",
    items: [
      { title: "Family Tours", desc: "Comfortable getaways crafted for every age." },
      { title: "Honeymoon", desc: "Romantic escapes to dreamy destinations." },
      { title: "Group Tours", desc: "Memorable journeys for friends & teams." },
      { title: "Pilgrimage", desc: "Spiritual travel with reverent comfort." },
      { title: "College Trips", desc: "Safe, organised student travel." },
      { title: "Airport Transfer", desc: "On-time pickups and drops, always." },
      { title: "Custom Holidays", desc: "Tailored itineraries, made to fit you." },
      { title: "Weekend Getaways", desc: "Short escapes, perfectly planned." },
    ],
  },
  destinations: {
    eyebrow: "Popular Destinations",
    title: "Where do you dream of going?",
    subtitle: "Cinematic landscapes, vibrant cities and hidden gems across South India.",
    items: [
      { name: "Munnar", region: "Kerala", img: munnarImg },
      { name: "Ooty", region: "Tamil Nadu", img: ootyImg },
      { name: "Kodaikanal", region: "Tamil Nadu", img: kodaikanalImg },
      { name: "Mysore", region: "Karnataka", img: mysoreImg },
      { name: "Coorg", region: "Karnataka", img: coorgImg },
      { name: "Hyderabad", region: "Telangana", img: hyderabadImg },
      { name: "Dhanushkodi", region: "Tamil Nadu", img: dhanushkodiImg },
      { name: "Yercaud", region: "Tamil Nadu", img: yercaudImg },
      { name: "Varkala", region: "Kerala", img: varkalaImg },
      { name: "Wayanad", region: "Kerala", img: wayanadImg },
      { name: "Thekkady", region: "Kerala", img: thekkadyImg },
      { name: "Alleppey", region: "Kerala", img: alleppeyImg },
      {
        name: "Goa",
        region: "Goa",
        img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      },
      { name: "Pondicherry", region: "Tamil Nadu", img: pondicherryImg },
      { name: "Chikmagalur", region: "Karnataka", img: chikmagalurImg },
    ],
  },
  airports: {
    eyebrow: "Airport Transfers",
    title: "Smooth airport pickups & drops.",
    subtitle: "Reliable, punctual, and discreet luxury transfers across Kerala's major airports.",
    items: [
      { name: "Cochin", code: "COK", full: "Cochin International Airport" },
      { name: "Trivandrum", code: "TRV", full: "Trivandrum International Airport" },
      { name: "Calicut", code: "CCJ", full: "Calicut International Airport" },
      { name: "Kannur", code: "CNN", full: "Kannur International Airport" },
    ],
    coverageTitle: "Serving Across Thrissur",
    coverage: ["Chavakkad", "Guruvayur", "Orumanayur", "Pavaratty", "Mullassery"],
  },
  fleets: {
    eyebrow: "Our Fleet",
    title: "Travel in luxury & comfort.",
    subtitle: "Hand-picked premium vehicles maintained to the highest standards.",
    items: [
      { name: "Toyota Innova Crysta", seats: "7 Seats", badge: "Premium", img: fleetInnovaImg },
      { name: "Force Urbania", seats: "12 Seats", badge: "Luxury Van", img: fleetUrbaniaImg },
      { name: "Force Traveller", seats: "26 Seats", badge: "Mini Coach", img: fleetTravellerImg },
      { name: "Tourist Bus", seats: "AC & Non-AC", badge: "Group Travel", img: fleetBusImg },
    ],
  },
  resorts: {
    eyebrow: "Rooms & Resorts",
    title: "Stays as memorable as the journey.",
    subtitle: "Curated luxury resorts and premium stays across the most loved destinations.",
    items: [
      {
        name: "Guruvayoor",
        img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      },
      { name: "Munnar", img: munnarImg },
      { name: "Thekkady", img: thekkadyImg },
      { name: "Wayanad", img: wayanadImg },
      { name: "Varkala", img: varkalaImg },
      { name: "Alleppey", img: alleppeyImg },
    ],
  },
  testimonials: {
    items: [
      { quote: "Excellent service and a truly comfortable trip from start to end.", name: "Arjun M.", role: "Family Tour" },
      { quote: "The best airport transfer service we've found near Guruvayur.", name: "Priya S.", role: "Airport Transfer" },
      { quote: "Our college tour was perfectly managed — every detail handled.", name: "Rahul K.", role: "College Trip" },
    ],
  },
  faqs: {
    items: [
      { q: "Do you provide customized tour packages?", a: "Yes — we craft fully tailored itineraries for families, groups, honeymoons, corporate trips and more." },
      { q: "Are airport pickup and drop services available?", a: "Absolutely. We cover Cochin, Trivandrum, Calicut and Kannur airports with premium vehicles, 24/7." },
      { q: "Can we book vehicles for group tours?", a: "Yes. From 7-seater Innovas to 26-seater Travellers and full Tourist Buses — both AC and Non-AC." },
      { q: "Do you provide hotel and resort booking?", a: "Yes, we partner with premium resorts across Munnar, Thekkady, Wayanad, Alleppey and more." },
    ],
  },
  footer: {
    heading: "Travel more beautifully, with comfort and care.",
    description:
      "Premium tourist vehicles, airport transfers, and customized holiday packages across Kerala and South India.",
  },
  media: {
    logo: marshalLogoImg,
    heroPoster: heroPosterImg,
    heroVideoDesktop: "/marshal-bg.mp4",
    heroVideoMobile: "/marshal-bg-mobile.mp4",
    aboutVideo1: "/videos/marshal-years.mp4",
    aboutVideo2: "/videos/marshal-about.mp4",
    footerVideo: "/videos/marshal-about.mp4",
    airportPhotos: [
      { img: cochinAirportImg, alt: "Cochin International Airport pickup with premium Force Urbania traveller" },
      { img: calicutAirportImg, alt: "Calicut International Airport pickup with premium Toyota Innova Crysta" },
      { img: trivandrumAirportImg, alt: "Trivandrum International Airport pickup with premium Toyota Innova Crysta" },
      { img: kannurAirportImg, alt: "Kannur International Airport pickup at dusk with premium Toyota Innova Crysta" },
    ],
  },
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge `override` onto `base`. Arrays and scalars in override replace. */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(override)) {
      out[key] = deepMerge((base as Record<string, unknown>)[key], override[key]);
    }
    return out as T;
  }
  return override as T;
}

/** Merge stored JSONB over the code defaults to produce a full SiteContent. */
export function resolveContent(data: unknown): SiteContent {
  return deepMerge(DEFAULT_CONTENT, data);
}
