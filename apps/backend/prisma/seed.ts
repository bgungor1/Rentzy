import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEED_DATA = [
    {
        brand: { name: "BMW", slug: "bmw", logoUrl: "/logos/bmw.svg" },
        cars: [
            {
                name: "M4 G82 (Adro Edition)",
                slug: "m4-g82-adro",
                description: "Agresif hatlar, karbon fiber detaylar ve saf sürüş dinamiği.",
                basePrice: 850.00,
                horsepower: 503,
                zeroTo100: 3.8,
                topSpeed: 290,
                year: 2022,
                variants: [
                    { name: "Adro Kit Base", colorName: "Isle of Man Green", colorHex: "#1C352D", modelUrl: "/models/bmw_g82_m4_with_adro_kit_2022__www.vecarz.com.glb", priceMultiplier: 1.0 },
                    { name: "Adro Carbon Widebody", colorName: "Frozen Black", colorHex: "#111111", modelUrl: "/models/2022_bmw_g82_m4_adro_carbon_fiber_widebody_kit.glb", priceMultiplier: 1.15 },
                ],
            },
        ],
    },
    {
        brand: { name: "Mercedes-Benz", slug: "mercedes-benz", logoUrl: "/logos/mercedes-benz.svg" },
        cars: [
            {
                name: "AMG GT3 Evo",
                slug: "amg-gt3-evo",
                description: "Pistlerin acımasız gücü, aerodinamik mükemmellikle buluşuyor.",
                basePrice: 1250.00,
                horsepower: 550,
                zeroTo100: 3.0,
                topSpeed: 332,
                year: 2020,
                variants: [
                    { name: "Track Spec", colorName: "Silver Arrow", colorHex: "#C0C0C0", modelUrl: "/models/mercedes_amg_gt3_evo_2020__www.vecarz.com.glb", priceMultiplier: 1.0 },
                ],
            },
            {
                name: "300SL Gullwing",
                slug: "300sl-gullwing",
                description: "Otomotiv tarihinin en ikonik martı kanatlı efsanesi.",
                basePrice: 2500.00,
                horsepower: 215,
                zeroTo100: 8.8,
                topSpeed: 260,
                year: 1954,
                variants: [
                    { name: "Classic Silver", colorName: "Silver", colorHex: "#E0E0E0", modelUrl: "/models/mercedes-benz_300sl_gullwing__www.vecarz.com.glb", priceMultiplier: 1.0 },
                ],
            },
        ],
    },
    {
        brand: { name: "Ferrari", slug: "ferrari", logoUrl: "/logos/ferrari.svg" },
        cars: [
            {
                name: "F50",
                slug: "f50",
                description: "F1 teknolojisinin caddelere inmiş en saf hali.",
                basePrice: 3500.00,
                horsepower: 512,
                zeroTo100: 3.8,
                topSpeed: 325,
                year: 1995,
                variants: [
                    { name: "Rosso Corsa", colorName: "Red", colorHex: "#CC0000", modelUrl: "/models/ferrari_f50_1995__www.vecarz.com.glb", priceMultiplier: 1.0 },
                ],
            },
            {
                name: "Enzo",
                slug: "enzo",
                description: "Milenyumun hiper otomobil standartlarını belirleyen şaheser.",
                basePrice: 4000.00,
                horsepower: 660,
                zeroTo100: 3.6,
                topSpeed: 350,
                year: 2002,
                variants: [
                    { name: "Rosso Scuderia", colorName: "Red", colorHex: "#D00000", modelUrl: "/models/ferrari_enzo_2002__www.vecarz.com.glb", priceMultiplier: 1.0 },
                ],
            },
        ],
    },
];

async function main() {
    console.log("🧹 Eski veriler temizleniyor...");
    await prisma.$transaction([
        prisma.reservation.deleteMany(),
        prisma.carVariant.deleteMany(),
        prisma.car.deleteMany(),
        prisma.brand.deleteMany(),
    ]);
    console.log("✅ Veriler temizlendi.\n");

    console.log("🚀 Yeni veriler ekleniyor...");

    for (const data of SEED_DATA) {

        const brand = await prisma.brand.create({
            data: data.brand,
        });


        for (const carData of data.cars) {
            const { variants, ...carFields } = carData;

            await prisma.car.create({
                data: {
                    ...carFields,
                    brandId: brand.id,
                    variants: {
                        create: variants,
                    },
                },
            });
        }
        console.log(`- ${brand.name} ve araçları eklendi.`);
    }

    console.log("\n🎉 Efsanevi garaj veritabanına başarıyla park edildi!");
}

main()
    .catch((e) => {
        console.error("❌ Veritabanı seed işlemi sırasında hata oluştu:");
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });