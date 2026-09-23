import { createFileRoute } from "@tanstack/react-router";
import MarshalHero from "@/components/MarshalHero";
import MarshalSections from "@/components/MarshalSections";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "canonical", href: `${SITE.url}/` }],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-white">
      <MarshalHero />
      <MarshalSections />
    </main>
  );
}
