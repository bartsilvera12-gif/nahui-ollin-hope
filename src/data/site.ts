// Static data for Nahui Ollin Inc — easy to swap for Supabase later.

/** Enlace oficial de donación (Square). */
export const DONATION_URL = "https://square.link/u/rHdd8zZz";

export const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Acciones", href: "#acciones" },
  { label: "Historias", href: "#historias" },

];

export const WHATSAPP_URL = "https://wa.me/595XXXXXXXXX";
export const FACEBOOK_URL = "https://www.facebook.com/share/v/1LJBW74MXL/";
export const FAX = "(214) 416-7771";
export const PHONE_FREE = "+1 (833) 500-LUPE";

export const aboutContent = {
  quienesSomos: [
    "Nahui Ollin, Inc., también haciendo negocios como Fundación Sueños de Barrio, es una organización de caridad católica y de beneficencia, sin fines de lucro, reconocida por el Servicio de Impuestos Internos de los Estados Unidos (IRS) como entidad exenta de impuestos bajo la sección 501(c)(3) del Código de Rentas Internas.",
    "Su propósito es ayudar, alimentar, apoyar, catequizar y evangelizar a niños que viven en condiciones de extrema pobreza en basureros.",
    "Sus fundadores son la cantautora católica internacional Carmen Rosa y su amado esposo, el abogado Allan Medina.",
    "Desde hace doce (12) años, trabajamos incansablemente al servicio de estos hermosos niños, acompañándolos en su crecimiento humano y espiritual.",
    "Inclusive somos Padrinos de Bautismo, de Primera Comunión y de Confirmación de muchos de estos nuestros niños.",
    "A lo largo de este tiempo, hemos sido testigos de cómo, de la mano de Dios, han crecido y logrado alcanzar sus sueños.",
  ],
  mision:
    "Satisfacer las necesidades básicas y sanar el dolor causado por el hambre, la pobreza y el abandono de niños y/o vendedores que viven bajo la sombra de la muerte: niños abandonados que buscan de comer en los basureros y vendedores en diferentes países. Empoderarlos a través de la educación para que puedan manejar y conquistar su mundo y cumplir sus más grandes sueños. Capacitarlos para que les enseñen a otros a cambiar hacia la ruta de la productividad.",
  vision:
    "Promover el amor, la misericordia y la igualdad de derechos para aquellos niños que están en desventaja debido al rechazo, el olvido y el aislamiento social. Impulsar un modelo que fomente la participación y la responsabilidad social hacia estas comunidades en necesidad, también de parte de otras comunidades.",
};

export const objetivos = [
  {
    icon: "MapPinned",
    title: "Identificar comunidades",
    description:
      "Detectar comunidades marginadas socialmente para acercarles ayuda concreta.",
  },
  {
    icon: "HandHeart",
    title: "Abastecer a los más vulnerables",
    description:
      "Brindar abastecimiento a niños e individuos que viven en miseria y extrema pobreza en los sectores ya identificados.",
  },
  {
    icon: "Shield",
    title: "Cubrir necesidades básicas",
    description:
      "Vestimenta, salud, vivienda, educación y ayuda psicológica, entre otras, para esta población.",
  },
  {
    icon: "GraduationCap",
    title: "Educación y capacitación",
    description:
      "Diseñar un plan educativo y de capacitación basado en las necesidades del sector para optimizar su calidad de vida y desarrollo comunitario.",
  },
  {
    icon: "Home",
    title: "Casa-hogar",
    description:
      "Establecer una casa-hogar para atender a niños huérfanos y abandonados en los basureros, de manera digna y con igualdad de derechos humanos, basada en el amor y la misericordia.",
  },
  {
    icon: "Megaphone",
    title: "Visibilizar la causa",
    description:
      "Elaborar una campaña publicitaria para dar a conocer esta realidad social y atraer a sectores y ayuda pública para sumarse como auspiciadores o voluntarios.",
  },
];

export const values = [
  { icon: "Heart", title: "Amor", description: "Cada acción nace desde el corazón." },
  { icon: "Sparkles", title: "Esperanza", description: "Creemos en pequeños gestos que pueden cambiar días enteros." },
  { icon: "Shield", title: "Protección", description: "Buscamos que cada niño se sienta acompañado y cuidado." },
  { icon: "Users", title: "Comunidad", description: "Unimos personas, voluntarios y familias para ayudar." },
  { icon: "HandHeart", title: "Movimiento solidario", description: "La ayuda crece cuando más personas deciden sumarse." },
];

export const impactStats = [
  { icon: "Smile", value: 250, suffix: "+", label: "Niños acompañados" },
  { icon: "CalendarHeart", value: 40, suffix: "+", label: "Jornadas solidarias" },
  { icon: "Users", value: 60, suffix: "+", label: "Voluntarios activos" },
  { icon: "Utensils", value: 1500, suffix: "+", label: "Alimentos entregados" },
];

export const actions = [
  { icon: "Utensils", title: "Alimentación", description: "Realizamos jornadas de entrega de alimentos para niños en situación de calle y comunidades vulnerables.", image: "/galeria/galeria-08.jpg" },
  { icon: "Gift", title: "Entrega de regalos", description: "Organizamos campañas para entregar juguetes, ropa y detalles especiales que llenan de alegría a los niños.", image: "/galeria/galeria-05.jpg" },
  { icon: "Sun", title: "Jornadas solidarias", description: "Creamos espacios de encuentro donde voluntarios y familias se unen para ayudar.", image: "/galeria/galeria-11.jpg" },
  { icon: "HandHeart", title: "Acompañamiento social", description: "Buscamos escuchar, contener y acompañar a quienes más lo necesitan.", image: "/galeria/galeria-04.jpg" },
  { icon: "Smile", title: "Actividades recreativas", description: "Promovemos momentos de juego, sonrisas y conexión humana.", image: "/galeria/galeria-15.jpg" },
  { icon: "Megaphone", title: "Campañas de donación", description: "Impulsamos campañas para reunir alimentos, juguetes, ropa y fondos para nuestras acciones.", image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop" },
];

export type Story = {
  title: string;
  date: string;
  description: string;
  images: string[];
  beforeImages?: string[];
  afterImages?: string[];
};

export const stories: Story[] = [
  {
    title: "La nueva casa de Yoselin",
    date: "Transformación reciente",
    description:
      "La casa de Yoselin pasó de ser un espacio precario e inseguro a convertirse en un hogar digno, con luz, paredes firmes y un techo que la abriga. Gracias al trabajo conjunto de voluntarios, donantes y la comunidad, hoy Yoselin puede crecer en un ambiente que merece.",
    beforeImages: [
      "/historias/yoselin/antes/antes-1.jpg",
      "/historias/yoselin/antes/antes-2.jpg",
      "/historias/yoselin/antes/antes-3.jpg",
      "/historias/yoselin/antes/antes-4.jpg",
      "/historias/yoselin/antes/antes-5.jpg",
    ],
    afterImages: [
      "/historias/yoselin/ahora/ahora-1.jpg",
      "/historias/yoselin/ahora/ahora-2.jpg",
      "/historias/yoselin/ahora/ahora-3.jpg",
      "/historias/yoselin/ahora/ahora-4.jpg",
      "/historias/yoselin/ahora/ahora-5.jpg",
    ],
    images: [
      "/historias/yoselin/antes/antes-1.jpg",
      "/historias/yoselin/ahora/ahora-1.jpg",
    ],
  },
  {
    title: "Regalos que abrazan",
    date: "Diciembre 2025",
    description: "Gracias al apoyo de voluntarios y donantes, pudimos entregar regalos y compartir una tarde especial con niños en situación vulnerable.",
    images: [
      "/galeria/galeria-09.jpg",
    ],
  },
  {
    title: "Un plato de comida, una esperanza",
    date: "Enero 2026",
    description: "En cada jornada de alimentación buscamos brindar más que comida: queremos ofrecer compañía, respeto y esperanza.",
    images: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&auto=format&fit=crop",
    ],
  },
];

export const galleryImages = Array.from({ length: 21 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/galeria/galeria-${n}.jpg`;
});

export const volunteerWays = [
  { icon: "Utensils", title: "Donar alimentos" },
  { icon: "Gift", title: "Donar juguetes" },
  { icon: "HandHeart", title: "Ser voluntario" },
  { icon: "Megaphone", title: "Difundir campañas" },
];
