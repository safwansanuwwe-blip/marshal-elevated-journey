import { createFileRoute } from "@tanstack/react-router";
import MarshalHero from "@/components/MarshalHero";
import MarshalSections from "@/components/MarshalSections";
import { SITE } from "@/lib/site";
import { getSiteContent } from "@/lib/content.functions";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/content";

export const Route = createFileRoute("/")({
  loader: () => getSiteContent(),
  head: ({ loaderData }) => {
    const seo = (loaderData as SiteContent | undefined)?.seo ?? DEFAULT_CONTENT.seo;
    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { name: "keywords", content: seo.keywords },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.socialDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE.url}/` },
        { property: "og:image", content: seo.ogImage },
        { name: "twitter:card", content: SITE.twitterCard },
        { name: "twitter:title", content: seo.title },
        { name: "twitter:description", content: seo.socialDescription },
        { name: "twitter:image", content: seo.ogImage },
      ],
      links: [{ rel: "canonical", href: `${SITE.url}/` }],
    };
  },
  component: Index,
});

function Index() {
  const content = Route.useLoaderData() as SiteContent;
  return (
    <main className="bg-white">
      <MarshalHero content={content} />
      <MarshalSections content={content} />
    </main>
  );
}
