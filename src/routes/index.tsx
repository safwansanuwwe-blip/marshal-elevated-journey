import { createFileRoute } from "@tanstack/react-router";
import MarshalHero from "@/components/MarshalHero";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <MarshalHero />;
}
