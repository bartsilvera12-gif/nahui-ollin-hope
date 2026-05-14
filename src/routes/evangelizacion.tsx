import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Evangelization } from "@/components/site/Evangelization";

export const Route = createFileRoute("/evangelizacion")({
  component: EvangelizationPage,
});

function EvangelizationPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <Evangelization />
      </main>
      <Footer />
    </>
  );
}
