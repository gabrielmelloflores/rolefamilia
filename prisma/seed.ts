import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@rolefamilia.com.br" },
    update: {},
    create: {
      email: "admin@rolefamilia.com.br",
      password: adminPassword,
      name: "Admin Rolê Família",
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "europa" },
      update: {},
      create: { name: "Europa", slug: "europa", color: "#4f46e5", description: "Viagens pela Europa" },
    }),
    prisma.category.upsert({
      where: { slug: "brasil" },
      update: {},
      create: { name: "Brasil", slug: "brasil", color: "#16a34a", description: "Destinos brasileiros" },
    }),
    prisma.category.upsert({
      where: { slug: "dicas" },
      update: {},
      create: { name: "Dicas", slug: "dicas", color: "#d97706", description: "Dicas gerais de viagem" },
    }),
    prisma.category.upsert({
      where: { slug: "familia" },
      update: {},
      create: { name: "Família", slug: "familia", color: "#dc2626", description: "Viagens em família" },
    }),
  ]);
  console.log("✅ Categories:", categories.length);

  // Destinations
  const bali = await prisma.destination.upsert({
    where: { slug: "bali" },
    update: {},
    create: {
      name: "Bali",
      slug: "bali",
      country: "Indonésia",
      countryCode: "ID",
      continent: "ASIA",
      coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
      description: "A ilha dos deuses, com templos, arrozais e praias paradisíacas.",
      isPublished: true,
      isFeatured: true,
    },
  });

  const porto = await prisma.destination.upsert({
    where: { slug: "porto" },
    update: {},
    create: {
      name: "Porto",
      slug: "porto",
      country: "Portugal",
      countryCode: "PT",
      continent: "EUROPA",
      coverImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
      description: "A cidade das pontes, do vinho do Porto e dos azulejos.",
      isPublished: true,
      isFeatured: true,
    },
  });

  const noronha = await prisma.destination.upsert({
    where: { slug: "fernando-de-noronha" },
    update: {},
    create: {
      name: "Fernando de Noronha",
      slug: "fernando-de-noronha",
      country: "Brasil",
      countryCode: "BR",
      continent: "AMERICA_DO_SUL",
      region: "nordeste",
      coverImage: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&q=80",
      description: "O arquipélago mais lindo do Brasil, com praias cristalinas e vida marinha exuberante.",
      isPublished: true,
      isFeatured: true,
    },
  });

  console.log("✅ Destinations:", [bali.name, porto.name, noronha.name].join(", "));

  // Itinerary
  const itinerary = await prisma.itinerary.upsert({
    where: { slug: "bali-em-10-dias" },
    update: {},
    create: {
      title: "Bali em 10 dias com crianças",
      slug: "bali-em-10-dias",
      coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
      summary: "O roteiro completo para explorar o melhor de Bali em família: Ubud, Seminyak, Uluwatu e muito mais.",
      duration: 10,
      difficulty: "FACIL",
      priceFrom: 4500,
      highlights: [
        "Templo de Tanah Lot ao pôr do sol",
        "Terraços de arroz de Tegalalang",
        "Praia de Seminyak",
        "Espetáculo de dança Kecak",
        "Aula de culinária balinesa",
      ],
      included: [
        "Motorista particular para os passeios",
        "Hospedagem em villas privativas",
        "Café da manhã incluído em todos os dias",
        "Entradas nos principais templos",
      ],
      notIncluded: [
        "Passagens aéreas",
        "Seguro viagem",
        "Chip internacional",
        "Refeições não especificadas",
      ],
      isPublished: true,
      isFeatured: true,
      destinationId: bali.id,
    },
  });

  // Itinerary days
  const dayTitles = [
    "Chegada em Bali — Transfer e descanso",
    "Ubud — Arte, cultura e arrozais",
    "Tirta Empul e Tegalalang",
    "Seminyak — Praias e pôr do sol",
    "Uluwatu e Kecak",
    "Dia livre em Seminyak",
    "Nusa Penida — Snorkeling",
    "Canggu — Surf e café",
    "Compras e despedida",
    "Transfer para o aeroporto",
  ];

  for (let i = 0; i < dayTitles.length; i++) {
    await prisma.itineraryDay.upsert({
      where: { itineraryId_dayNumber: { itineraryId: itinerary.id, dayNumber: i + 1 } },
      update: {},
      create: {
        itineraryId: itinerary.id,
        dayNumber: i + 1,
        title: dayTitles[i],
        description: `Programação completa para o dia ${i + 1} do roteiro em Bali.`,
        meals: i < 9 ? ["CAFE_DA_MANHA"] : [],
      },
    });
  }
  console.log("✅ Itinerary + days:", itinerary.title);

  // Product
  const product = await prisma.product.upsert({
    where: { slug: "guia-bali-familia" },
    update: {},
    create: {
      name: "Guia Completo: Bali com Crianças",
      slug: "guia-bali-familia",
      description: "Tudo o que você precisa saber para planejar uma viagem inesquecível a Bali com sua família. Inclui roteiros, dicas de restaurantes kids-friendly, melhores praias e muito mais.",
      type: "EBOOK",
      price: 37,
      coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      isPublished: true,
      isFeatured: true,
    },
  });
  console.log("✅ Product:", product.name);

  // Affiliate links
  const affiliates = await Promise.all([
    prisma.affiliateLink.upsert({
      where: { id: "booking-main" },
      update: {},
      create: {
        id: "booking-main",
        name: "Booking.com — Hotéis em geral",
        provider: "BOOKING",
        url: "https://booking.com",
        description: "Link principal do Booking.com",
        isActive: true,
      },
    }),
    prisma.affiliateLink.upsert({
      where: { id: "holafly-main" },
      update: {},
      create: {
        id: "holafly-main",
        name: "Holafly — eSIM Internacional",
        provider: "HOLAFLY",
        url: "https://holafly.com",
        description: "Chip internacional para viagens",
        isActive: true,
      },
    }),
    prisma.affiliateLink.upsert({
      where: { id: "seguros-main" },
      update: {},
      create: {
        id: "seguros-main",
        name: "Seguros Promo — Seguro Viagem",
        provider: "SEGUROS_PROMO",
        url: "https://www.segurospromo.com.br",
        description: "Seguro de viagem com as melhores coberturas",
        isActive: true,
      },
    }),
  ]);
  console.log("✅ Affiliate links:", affiliates.length);

  // Site settings
  await prisma.siteSetting.upsert({
    where: { key: "site_name" },
    update: { value: "Rolê Família" },
    create: { key: "site_name", value: "Rolê Família" },
  });
  await prisma.siteSetting.upsert({
    where: { key: "site_description" },
    update: { value: "Viagens em família pelo Brasil e pelo mundo" },
    create: { key: "site_description", value: "Viagens em família pelo Brasil e pelo mundo" },
  });
  console.log("✅ Site settings");

  console.log("\n🎉 Database seeded successfully!");
  console.log("   Admin: admin@rolefamilia.com.br / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
