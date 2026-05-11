import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Impact } from "@/components/site/Impact";
import { Actions } from "@/components/site/Actions";
import { Stories } from "@/components/site/Stories";
import { Donation } from "@/components/site/Donation";
import { Gallery } from "@/components/site/Gallery";
import { Volunteer } from "@/components/site/Volunteer";
import { Footer } from "@/components/site/Footer";

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Nahui Ollin Inc",
  description:
    "Fundación dedicada a acompañar, alimentar y brindar esperanza a niños en situación vulnerable.",
  areaServed: "Paraguay",
  sameAs: ["https://instagram.com/nahuiollininc"],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nahui Ollin Inc | Fundación de ayuda a niños en estado de calle" },
      {
        name: "description",
        content:
          "Fundación dedicada a acompañar, alimentar y brindar esperanza a niños en situación vulnerable.",
      },
      { property: "og:title", content: "Nahui Ollin Inc | Fundación solidaria" },
      {
        property: "og:description",
        content:
          "Acompañamos a niños en situación vulnerable con alimentación, regalos y jornadas solidarias.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Header />
      <main>
        <Hero />
        <About />
        <Impact />
        <Actions />
        <Stories />
        <Donation />
        <Gallery />
        <Volunteer />
      </main>
      <Footer />
    </>
  );
}
