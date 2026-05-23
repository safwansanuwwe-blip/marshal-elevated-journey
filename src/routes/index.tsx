import { createFileRoute } from "@tanstack/react-router";
import MarshalHero from "@/components/MarshalHero";
import MarshalSections from "@/components/MarshalSections";

export const Route = createFileRoute("/")({
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
