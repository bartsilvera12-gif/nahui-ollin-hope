import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ReferenceLetters } from "@/components/site/ReferenceLetters";

export const Route = createFileRoute("/cartas-referenciales")({
  component: ReferenceLettersPage,
});

function ReferenceLettersPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <ReferenceLetters />
      </main>
      <Footer />
    </>
  );
}
