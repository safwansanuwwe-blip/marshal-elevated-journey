import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getSiteContent, saveSiteContent } from "@/lib/content.functions";
import { uploadCoverImage } from "@/lib/posts.functions";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/content";
import { AdminShell, ADMIN } from "@/components/admin/AdminShell";

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  return token;
}

// Upload photos/videos straight to Supabase Storage from the browser using the
// signed-in admin session. This bypasses server-function body limits, so large
// video files upload reliably. RLS on the `post-images` bucket restricts writes
// to admins.
async function uploadMedia(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `media/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("post-images")
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl;
}

export const Route = createFileRoute("/_authenticated/admin/content")({
  head: () => ({
    meta: [
      { title: "Site Content · Marshal Holidays" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: () => getSiteContent(),
  component: ContentEditor,
  errorComponent: ({ error }) => (
    <div className="p-10 text-red-600">Content editor failed: {error.message}</div>
  ),
});

function ContentEditor() {
  const initial = Route.useLoaderData() as SiteContent;
  const qc = useQueryClient();
  const save = useServerFn(saveSiteContent);
  const upload = useServerFn(uploadCoverImage);

  const [c, setC] = useState<SiteContent>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => setC(initial), [initial]);

  // Immutable update helper: mutate a structured clone.
  function up(fn: (draft: SiteContent) => void) {
    setC((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });
  }

  async function uploadImage(file: File): Promise<string> {
    const buf = await file.arrayBuffer();
    let bin = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
    const res = await upload({
      data: {
        filename: file.name,
        contentType: file.type || "image/jpeg",
        base64: btoa(bin),
        accessToken: await getAccessToken(),
      },
    });
    return res.url;
  }

  async function onSave() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      await save({ data: { accessToken: await getAccessToken(), data: c } });
      await qc.invalidateQueries();
      setMsg("Saved. Changes are live on the site.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  function resetToDefaults() {
    if (confirm("Reset ALL content back to the built-in defaults? This only changes the form — nothing is saved until you click Save.")) {
      setC(structuredClone(DEFAULT_CONTENT));
    }
  }

  return (
    <AdminShell
      title="Site Content"
      subtitle="Edit every section of your public homepage — changes go live on save."
      crumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Site Content" }]}
      contentClassName="mx-auto max-w-4xl space-y-4"
      actions={
        <>
          <button onClick={resetToDefaults} className={ADMIN.btnGhost}>Reset</button>
          <button onClick={onSave} disabled={busy} className={ADMIN.btnPrimary}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </>
      }
    >
        {(msg || err) && (
          <div className="mb-2">
            {msg && <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm text-emerald-700">{msg}</p>}
            {err && <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">{err}</p>}
          </div>
        )}
        {/* SEO */}
        <Panel title="SEO & sharing" defaultOpen>
          <Txt label="Page title" value={c.seo.title} onChange={(v) => up((d) => { d.seo.title = v; })} max={60} />
          <Txt label="Meta description" area value={c.seo.description} onChange={(v) => up((d) => { d.seo.description = v; })} max={160} />
          <Txt label="Social share description" area value={c.seo.socialDescription} onChange={(v) => up((d) => { d.seo.socialDescription = v; })} />
          <Txt label="Keywords (comma separated)" value={c.seo.keywords} onChange={(v) => up((d) => { d.seo.keywords = v; })} />
          <ImgField label="Social share image (OG image)" value={c.seo.ogImage} onChange={(v) => up((d) => { d.seo.ogImage = v; })} onUpload={uploadImage} setErr={setErr} />
        </Panel>

        {/* Hero */}
        <Panel title="Hero (top of page)">
          <Txt label="Welcome heading (big faded text)" value={c.hero.welcomeHeading} onChange={(v) => up((d) => { d.hero.welcomeHeading = v; })} />
          <Txt label="Tagline title" value={c.hero.taglineTitle} onChange={(v) => up((d) => { d.hero.taglineTitle = v; })} />
          <Txt label="Tagline subtitle" value={c.hero.taglineSubtitle} onChange={(v) => up((d) => { d.hero.taglineSubtitle = v; })} />
          <Txt label="Big headline (bottom right)" value={c.hero.headline} onChange={(v) => up((d) => { d.hero.headline = v; })} />
          <Row>
            <Txt label="CTA button label" value={c.hero.ctaLabel} onChange={(v) => up((d) => { d.hero.ctaLabel = v; })} />
            <Txt label="CTA link" value={c.hero.ctaHref} onChange={(v) => up((d) => { d.hero.ctaHref = v; })} />
          </Row>
          <Row>
            <Txt label={'"Book Now" label'} value={c.hero.bookNowLabel} onChange={(v) => up((d) => { d.hero.bookNowLabel = v; })} />
            <Txt label={'"Explore" label'} value={c.hero.exploreLabel} onChange={(v) => up((d) => { d.hero.exploreLabel = v; })} />
          </Row>
          <SubHead>Navigation links</SubHead>
          <ListEditor
            items={c.hero.navLinks}
            onAdd={() => up((d) => d.hero.navLinks.push({ label: "New", href: "#" }))}
            onRemove={(i) => up((d) => d.hero.navLinks.splice(i, 1))}
            render={(item, i) => (
              <Row>
                <Txt label="Label" value={item.label} onChange={(v) => up((d) => { d.hero.navLinks[i].label = v; })} />
                <Txt label="Link (href)" value={item.href} onChange={(v) => up((d) => { d.hero.navLinks[i].href = v; })} />
              </Row>
            )}
          />
        </Panel>

        {/* Media */}
        <Panel title="Photos & videos">
          <p className="text-xs text-[#272835]/50">
            Upload images or videos (MP4 recommended for background clips). Large files upload
            directly to storage. You can also paste a URL.
          </p>
          <MediaField kind="image" label="Logo" value={c.media.logo} onChange={(v) => up((d) => { d.media.logo = v; })} setErr={setErr} />
          <MediaField kind="image" label="Hero poster (shows before video loads)" value={c.media.heroPoster} onChange={(v) => up((d) => { d.media.heroPoster = v; })} setErr={setErr} />
          <MediaField kind="video" label="Hero background video — desktop" value={c.media.heroVideoDesktop} onChange={(v) => up((d) => { d.media.heroVideoDesktop = v; })} setErr={setErr} />
          <MediaField kind="video" label="Hero background video — mobile" value={c.media.heroVideoMobile} onChange={(v) => up((d) => { d.media.heroVideoMobile = v; })} setErr={setErr} />
          <MediaField kind="video" label="About video 1 (large tile)" value={c.media.aboutVideo1} onChange={(v) => up((d) => { d.media.aboutVideo1 = v; })} setErr={setErr} />
          <MediaField kind="video" label="About video 2 (small tile)" value={c.media.aboutVideo2} onChange={(v) => up((d) => { d.media.aboutVideo2 = v; })} setErr={setErr} />
          <MediaField kind="video" label="Footer video" value={c.media.footerVideo} onChange={(v) => up((d) => { d.media.footerVideo = v; })} setErr={setErr} />
          <SubHead>Airport photos (4-up grid)</SubHead>
          <ListEditor
            items={c.media.airportPhotos}
            onAdd={() => up((d) => d.media.airportPhotos.push({ img: "", alt: "" }))}
            onRemove={(i) => up((d) => d.media.airportPhotos.splice(i, 1))}
            render={(item, i) => (
              <>
                <MediaField kind="image" label="Photo" value={item.img} onChange={(v) => up((d) => { d.media.airportPhotos[i].img = v; })} setErr={setErr} />
                <Txt label="Alt text (describe the photo for SEO/accessibility)" value={item.alt} onChange={(v) => up((d) => { d.media.airportPhotos[i].alt = v; })} />
              </>
            )}
          />
        </Panel>

        {/* Contact */}
        <Panel title="Contact details">
          <Row>
            <Txt label="Phone (display)" value={c.contact.phone} onChange={(v) => up((d) => { d.contact.phone = v; })} />
            <Txt label="Phone link (tel:)" value={c.contact.phoneHref} onChange={(v) => up((d) => { d.contact.phoneHref = v; })} />
          </Row>
          <Row>
            <Txt label="Email" value={c.contact.email} onChange={(v) => up((d) => { d.contact.email = v; })} />
            <Txt label="WhatsApp link" value={c.contact.whatsapp} onChange={(v) => up((d) => { d.contact.whatsapp = v; })} />
          </Row>
          <Txt label="Google Maps embed URL (iframe src)" area value={c.contact.mapEmbedUrl} onChange={(v) => up((d) => { d.contact.mapEmbedUrl = v; })} />
          <Txt label="Google Maps link (View on Maps button)" value={c.contact.mapLink} onChange={(v) => up((d) => { d.contact.mapLink = v; })} />
          <SubHead>Service area chips</SubHead>
          <StringList
            items={c.contact.serviceAreas}
            onChange={(items) => up((d) => { d.contact.serviceAreas = items; })}
          />
        </Panel>

        {/* Social */}
        <Panel title="Social links">
          <p className="text-xs text-[#272835]/50 mb-2">Platform must be one of: Facebook, Instagram, X, YouTube (controls the icon).</p>
          <ListEditor
            items={c.social}
            onAdd={() => up((d) => d.social.push({ platform: "Facebook", href: "" }))}
            onRemove={(i) => up((d) => d.social.splice(i, 1))}
            render={(item, i) => (
              <Row>
                <Txt label="Platform" value={item.platform} onChange={(v) => up((d) => { d.social[i].platform = v; })} />
                <Txt label="URL" value={item.href} onChange={(v) => up((d) => { d.social[i].href = v; })} />
              </Row>
            )}
          />
        </Panel>

        {/* About */}
        <Panel title="About section">
          <Txt label="Eyebrow" value={c.about.eyebrow} onChange={(v) => up((d) => { d.about.eyebrow = v; })} />
          <Txt label="Title" value={c.about.title} onChange={(v) => up((d) => { d.about.title = v; })} />
          <Txt label="Subtitle" area value={c.about.subtitle} onChange={(v) => up((d) => { d.about.subtitle = v; })} />
          <Row>
            <Txt label="Stat 1 — top" value={c.about.stat1Top} onChange={(v) => up((d) => { d.about.stat1Top = v; })} />
            <Txt label="Stat 1 — bottom" value={c.about.stat1Bottom} onChange={(v) => up((d) => { d.about.stat1Bottom = v; })} />
          </Row>
          <Row>
            <Txt label="Stat 2 — top" value={c.about.stat2Top} onChange={(v) => up((d) => { d.about.stat2Top = v; })} />
            <Txt label="Stat 2 — bottom" value={c.about.stat2Bottom} onChange={(v) => up((d) => { d.about.stat2Bottom = v; })} />
          </Row>
          <Txt label="CTA button label" value={c.about.ctaLabel} onChange={(v) => up((d) => { d.about.ctaLabel = v; })} />
          <SubHead>Feature chips (max 3 shown with icons)</SubHead>
          <StringList items={c.about.features} onChange={(items) => up((d) => { d.about.features = items; })} />
        </Panel>

        {/* Services */}
        <Panel title="Services">
          <SectionMeta
            eyebrow={c.services.eyebrow} title={c.services.title} subtitle={c.services.subtitle}
            onEyebrow={(v) => up((d) => { d.services.eyebrow = v; })}
            onTitle={(v) => up((d) => { d.services.title = v; })}
            onSubtitle={(v) => up((d) => { d.services.subtitle = v; })}
          />
          <ListEditor
            items={c.services.items}
            onAdd={() => up((d) => d.services.items.push({ title: "New service", desc: "" }))}
            onRemove={(i) => up((d) => d.services.items.splice(i, 1))}
            render={(item, i) => (
              <>
                <Txt label="Title" value={item.title} onChange={(v) => up((d) => { d.services.items[i].title = v; })} />
                <Txt label="Description" value={item.desc} onChange={(v) => up((d) => { d.services.items[i].desc = v; })} />
              </>
            )}
          />
        </Panel>

        {/* Destinations */}
        <Panel title="Destinations">
          <SectionMeta
            eyebrow={c.destinations.eyebrow} title={c.destinations.title} subtitle={c.destinations.subtitle}
            onEyebrow={(v) => up((d) => { d.destinations.eyebrow = v; })}
            onTitle={(v) => up((d) => { d.destinations.title = v; })}
            onSubtitle={(v) => up((d) => { d.destinations.subtitle = v; })}
          />
          <ListEditor
            items={c.destinations.items}
            onAdd={() => up((d) => d.destinations.items.push({ name: "New place", region: "", img: "" }))}
            onRemove={(i) => up((d) => d.destinations.items.splice(i, 1))}
            render={(item, i) => (
              <>
                <Row>
                  <Txt label="Name" value={item.name} onChange={(v) => up((d) => { d.destinations.items[i].name = v; })} />
                  <Txt label="Region" value={item.region} onChange={(v) => up((d) => { d.destinations.items[i].region = v; })} />
                </Row>
                <ImgField label="Image" value={item.img} onChange={(v) => up((d) => { d.destinations.items[i].img = v; })} onUpload={uploadImage} setErr={setErr} />
              </>
            )}
          />
        </Panel>

        {/* Airports */}
        <Panel title="Airport transfers">
          <SectionMeta
            eyebrow={c.airports.eyebrow} title={c.airports.title} subtitle={c.airports.subtitle}
            onEyebrow={(v) => up((d) => { d.airports.eyebrow = v; })}
            onTitle={(v) => up((d) => { d.airports.title = v; })}
            onSubtitle={(v) => up((d) => { d.airports.subtitle = v; })}
          />
          <ListEditor
            items={c.airports.items}
            onAdd={() => up((d) => d.airports.items.push({ name: "New", code: "", full: "" }))}
            onRemove={(i) => up((d) => d.airports.items.splice(i, 1))}
            render={(item, i) => (
              <>
                <Row>
                  <Txt label="Name" value={item.name} onChange={(v) => up((d) => { d.airports.items[i].name = v; })} />
                  <Txt label="Code" value={item.code} onChange={(v) => up((d) => { d.airports.items[i].code = v; })} />
                </Row>
                <Txt label="Full name" value={item.full} onChange={(v) => up((d) => { d.airports.items[i].full = v; })} />
              </>
            )}
          />
          <SubHead>Coverage</SubHead>
          <Txt label="Coverage title" value={c.airports.coverageTitle} onChange={(v) => up((d) => { d.airports.coverageTitle = v; })} />
          <StringList items={c.airports.coverage} onChange={(items) => up((d) => { d.airports.coverage = items; })} />
        </Panel>

        {/* Fleets */}
        <Panel title="Fleet">
          <SectionMeta
            eyebrow={c.fleets.eyebrow} title={c.fleets.title} subtitle={c.fleets.subtitle}
            onEyebrow={(v) => up((d) => { d.fleets.eyebrow = v; })}
            onTitle={(v) => up((d) => { d.fleets.title = v; })}
            onSubtitle={(v) => up((d) => { d.fleets.subtitle = v; })}
          />
          <ListEditor
            items={c.fleets.items}
            onAdd={() => up((d) => d.fleets.items.push({ name: "New vehicle", seats: "", badge: "", img: "" }))}
            onRemove={(i) => up((d) => d.fleets.items.splice(i, 1))}
            render={(item, i) => (
              <>
                <Row>
                  <Txt label="Name" value={item.name} onChange={(v) => up((d) => { d.fleets.items[i].name = v; })} />
                  <Txt label="Seats" value={item.seats} onChange={(v) => up((d) => { d.fleets.items[i].seats = v; })} />
                </Row>
                <Txt label="Badge" value={item.badge} onChange={(v) => up((d) => { d.fleets.items[i].badge = v; })} />
                <ImgField label="Image" value={item.img} onChange={(v) => up((d) => { d.fleets.items[i].img = v; })} onUpload={uploadImage} setErr={setErr} />
              </>
            )}
          />
        </Panel>

        {/* Resorts */}
        <Panel title="Rooms & resorts">
          <SectionMeta
            eyebrow={c.resorts.eyebrow} title={c.resorts.title} subtitle={c.resorts.subtitle}
            onEyebrow={(v) => up((d) => { d.resorts.eyebrow = v; })}
            onTitle={(v) => up((d) => { d.resorts.title = v; })}
            onSubtitle={(v) => up((d) => { d.resorts.subtitle = v; })}
          />
          <ListEditor
            items={c.resorts.items}
            onAdd={() => up((d) => d.resorts.items.push({ name: "New resort", img: "" }))}
            onRemove={(i) => up((d) => d.resorts.items.splice(i, 1))}
            render={(item, i) => (
              <>
                <Txt label="Name" value={item.name} onChange={(v) => up((d) => { d.resorts.items[i].name = v; })} />
                <ImgField label="Image" value={item.img} onChange={(v) => up((d) => { d.resorts.items[i].img = v; })} onUpload={uploadImage} setErr={setErr} />
              </>
            )}
          />
        </Panel>

        {/* Testimonials */}
        <Panel title="Testimonials">
          <ListEditor
            items={c.testimonials.items}
            onAdd={() => up((d) => d.testimonials.items.push({ quote: "", name: "", role: "" }))}
            onRemove={(i) => up((d) => d.testimonials.items.splice(i, 1))}
            render={(item, i) => (
              <>
                <Txt label="Quote" area value={item.quote} onChange={(v) => up((d) => { d.testimonials.items[i].quote = v; })} />
                <Row>
                  <Txt label="Name" value={item.name} onChange={(v) => up((d) => { d.testimonials.items[i].name = v; })} />
                  <Txt label="Role" value={item.role} onChange={(v) => up((d) => { d.testimonials.items[i].role = v; })} />
                </Row>
              </>
            )}
          />
        </Panel>

        {/* FAQs */}
        <Panel title="FAQ">
          <ListEditor
            items={c.faqs.items}
            onAdd={() => up((d) => d.faqs.items.push({ q: "", a: "" }))}
            onRemove={(i) => up((d) => d.faqs.items.splice(i, 1))}
            render={(item, i) => (
              <>
                <Txt label="Question" value={item.q} onChange={(v) => up((d) => { d.faqs.items[i].q = v; })} />
                <Txt label="Answer" area value={item.a} onChange={(v) => up((d) => { d.faqs.items[i].a = v; })} />
              </>
            )}
          />
        </Panel>

        {/* Footer */}
        <Panel title="Footer">
          <Txt label="Heading" area value={c.footer.heading} onChange={(v) => up((d) => { d.footer.heading = v; })} />
          <Txt label="Description" area value={c.footer.description} onChange={(v) => up((d) => { d.footer.description = v; })} />
        </Panel>

        <div className="pt-2">
          <button onClick={onSave} disabled={busy} className={`${ADMIN.btnPrimary} w-full py-3`}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
    </AdminShell>
  );
}

/* ---------------- reusable form primitives ---------------- */

const LBL = "block text-xs font-semibold text-[#272835]/70 mb-1 uppercase tracking-wider";
const INP =
  "w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9a8666]/40 bg-white";

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

function SubHead({ children }: { children: React.ReactNode }) {
  return <h4 className="text-xs font-bold uppercase tracking-wider text-[#9a8666] mt-2">{children}</h4>;
}

function Txt({
  label, value, onChange, area, max,
}: {
  label: string; value: string; onChange: (v: string) => void; area?: boolean; max?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className={LBL}>{label}</label>
        {max && (
          <span className={`text-[10px] ${value.length > max ? "text-red-600" : "text-[#272835]/40"}`}>
            {value.length}/{max}
          </span>
        )}
      </div>
      {area ? (
        <textarea className={INP} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={INP} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function ImgField({
  label, value, onChange, onUpload, setErr,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onUpload: (f: File) => Promise<string>;
  setErr: (m: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setErr("Image must be under 8 MB");
      return;
    }
    setUploading(true);
    setErr(null);
    try {
      onChange(await onUpload(file));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className={LBL}>{label}</label>
      <div className="flex items-center gap-3">
        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md border border-black/10 bg-[#f3f3f3]">
          {value && <img src={value} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="flex-1">
          <input className={INP} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or upload →" />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded-md border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#272835] hover:bg-[#fafafa] disabled:opacity-50"
        >
          {uploading ? "…" : "Upload"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={handle} className="hidden" />
      </div>
    </div>
  );
}

function MediaField({
  kind, label, value, onChange, setErr,
}: {
  kind: "image" | "video";
  label: string;
  value: string;
  onChange: (v: string) => void;
  setErr: (m: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxMb = kind === "video" ? 50 : 8;

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxMb * 1024 * 1024) {
      setErr(`${kind === "video" ? "Video" : "Image"} must be under ${maxMb} MB`);
      return;
    }
    setUploading(true);
    setProgress(0);
    setErr(null);
    // Rough progress cue since the storage SDK upload here is not streamed.
    const timer = setInterval(() => setProgress((p) => Math.min(p + 8, 92)), 400);
    try {
      onChange(await uploadMedia(file));
      setProgress(100);
    } catch (err: unknown) {
      setErr(err instanceof Error ? err.message : "Upload failed");
    } finally {
      clearInterval(timer);
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className={LBL}>{label}</label>
      <div className="flex items-start gap-3">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-black/10 bg-[#111] flex items-center justify-center">
          {value ? (
            kind === "video" ? (
              <video src={value} muted loop playsInline autoPlay className="h-full w-full object-cover" />
            ) : (
              <img src={value} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <span className="text-[10px] text-white/50">none</span>
          )}
        </div>
        <div className="flex-1">
          <input className={INP} value={value} onChange={(e) => onChange(e.target.value)} placeholder={`${kind === "video" ? "Video" : "Image"} URL or upload →`} />
          {uploading && (
            <div className="mt-1.5 h-1 w-full rounded-full bg-black/10 overflow-hidden">
              <div className="h-full rounded-full bg-[#9a8666] transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded-md border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[#272835] hover:bg-[#fafafa] disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input ref={inputRef} type="file" accept={kind === "video" ? "video/*" : "image/*"} onChange={handle} className="hidden" />
      </div>
    </div>
  );
}

function StringList({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={INP}
            value={it}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, k) => k !== i))}
            className="shrink-0 rounded-md border border-black/10 bg-white px-3 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="rounded-md border border-dashed border-black/20 px-3 py-1.5 text-xs font-semibold text-[#272835]/70 hover:bg-white"
      >
        + Add
      </button>
    </div>
  );
}

function ListEditor<T>({
  items, render, onAdd, onRemove,
}: {
  items: T[];
  render: (item: T, index: number) => React.ReactNode;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-black/10 bg-[#fafafa] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#272835]/40">Item {i + 1}</span>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          {render(item, i)}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="rounded-md border border-dashed border-black/20 px-3 py-1.5 text-xs font-semibold text-[#272835]/70 hover:bg-white"
      >
        + Add item
      </button>
    </div>
  );
}

function SectionMeta({
  eyebrow, title, subtitle, onEyebrow, onTitle, onSubtitle,
}: {
  eyebrow: string; title: string; subtitle: string;
  onEyebrow: (v: string) => void; onTitle: (v: string) => void; onSubtitle: (v: string) => void;
}) {
  return (
    <div className="space-y-3 border-b border-black/5 pb-4 mb-2">
      <Row>
        <Txt label="Eyebrow" value={eyebrow} onChange={onEyebrow} />
        <Txt label="Title" value={title} onChange={onTitle} />
      </Row>
      <Txt label="Subtitle" area value={subtitle} onChange={onSubtitle} />
    </div>
  );
}

function Panel({
  title, children, defaultOpen = false,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-xl border border-black/5 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#fafafa]"
      >
        <h3 className="text-[#272835]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px" }}>{title}</h3>
        <span className="text-[#272835]/40 text-sm">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-5 pb-6 pt-1 space-y-4">{children}</div>}
    </section>
  );
}
