/// <reference types="node" />
// ^ TS 7 no longer loads @types/node implicitly, and this file is outside tsconfig "include"
import { PrismaClient, Prisma, Status } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Test accounts (dev only). Password for both: password123
const TEST_PASSWORD = "password123";

const TEST_USERS = [
    {
        email: "admin@homemarket.test",
        name: "Админ Тестовый",
        role: "ADMIN" as const,
        phone: "+380500000001",
        telegramUsername: "@hm_admin_test",
    },
    {
        email: "owner@homemarket.test",
        name: "Олег Владелец",
        role: "USER" as const,
        phone: "+380500000002",
        telegramUsername: "@hm_owner_test",
    },
];

const PHOTOS = {
    living: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    bedroom: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    bathroom: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    view: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
};

type SeedListing = Omit<Prisma.ListingUncheckedCreateInput, "ownerId" | "categoryId"> & {
    id: string;
    category: "Room" | "Apartment" | "Dormitory";
    status: Status;
};

// Fixed ids make the seed idempotent: re-running resets these listings to their initial state
const TEST_LISTINGS: SeedListing[] = [
    {
        id: "00000000-0000-4000-8000-000000000001",
        category: "Apartment",
        status: "ACTIVE",
        name: "Светлая двушка возле метро Лукьяновская",
        description: "Уютная квартира после ремонта, 5 минут пешком до метро. Есть вся техника, большой балкон, тихий двор.",
        price: 18000,
        deposit: true,
        depositAmount: 18000,
        latitude: 50.4619,
        longitude: 30.4826,
        street: "Мельникова",
        streetNumber: "12",
        amenities: ["Wi-Fi", "Кондиционер", "Стиральная машина", "Балкон"],
        isShared: false,
        countPeople: 3,
        countRoom: 2,
        allowedGender: "ANY",
        area: 58,
        photos: [PHOTOS.living, PHOTOS.bedroom, PHOTOS.kitchen],
    },
    {
        id: "00000000-0000-4000-8000-000000000002",
        category: "Room",
        status: "ACTIVE",
        name: "Комната в квартире с двумя студентками",
        description: "Ищем соседку в трёхкомнатную квартиру на Позняках. Комната 14 м², общая кухня и ванная, коммуналка пополам.",
        price: 6500,
        deposit: false,
        depositAmount: null,
        latitude: 50.3986,
        longitude: 30.6346,
        street: "Драгоманова",
        streetNumber: "31Б",
        amenities: ["Wi-Fi", "Стиральная машина"],
        isShared: true,
        countPeople: 1,
        countRoom: 1,
        allowedGender: "ONLY_FEMALE",
        area: 14,
        photos: [PHOTOS.bedroom, PHOTOS.bathroom],
    },
    {
        id: "00000000-0000-4000-8000-000000000003",
        category: "Dormitory",
        status: "ACTIVE",
        name: "Место в общежитии КПИ, блок на двоих",
        description: "Сдаю место в блоке общежития рядом с КПИ. Душ и туалет в блоке, кухня на этаже. Подходит студентам.",
        price: 3000,
        deposit: true,
        depositAmount: 1500,
        latitude: 50.4488,
        longitude: 30.4567,
        street: "Борщаговская",
        streetNumber: "146",
        amenities: ["Wi-Fi"],
        isShared: true,
        countPeople: 1,
        countRoom: 1,
        allowedGender: "ONLY_MALE",
        area: 12,
        photos: [PHOTOS.view],
    },
    {
        id: "00000000-0000-4000-8000-000000000004",
        category: "Apartment",
        status: "PENDING",
        name: "Однокомнатная квартира на Оболони у Днепра",
        description: "Новое объявление, ожидает модерации. Квартира с видом на реку, новый дом, подземный паркинг за доплату.",
        price: 15000,
        deposit: true,
        depositAmount: 15000,
        latitude: 50.5012,
        longitude: 30.5234,
        street: "Героев Сталинграда",
        streetNumber: "2Д",
        amenities: ["Wi-Fi", "Кондиционер", "Посудомоечная машина"],
        isShared: false,
        countPeople: 2,
        countRoom: 1,
        allowedGender: "ANY",
        area: 42,
        photos: [PHOTOS.view, PHOTOS.living],
    },
    {
        id: "00000000-0000-4000-8000-000000000005",
        category: "Room",
        status: "PENDING",
        name: "Комната для парня на Троещине",
        description: "Второе объявление на модерации. Комната в двухкомнатной квартире, сосед — спокойный айтишник, не курит.",
        price: 5000,
        deposit: false,
        depositAmount: null,
        latitude: 50.5103,
        longitude: 30.6043,
        street: "Закревского",
        streetNumber: "47",
        amenities: ["Wi-Fi", "Холодильник"],
        isShared: true,
        countPeople: 1,
        countRoom: 1,
        allowedGender: "ONLY_MALE",
        area: 16,
        photos: [PHOTOS.bedroom],
    },
    {
        id: "00000000-0000-4000-8000-000000000006",
        category: "Apartment",
        status: "BANNED",
        name: "Подозрительно дешёвая квартира в центре",
        description: "Заблокированное объявление для проверки: владелец не может его редактировать или удалять.",
        price: 2000,
        deposit: true,
        depositAmount: 20000,
        latitude: 50.4501,
        longitude: 30.5234,
        street: "Крещатик",
        streetNumber: "1",
        amenities: ["Wi-Fi"],
        isShared: false,
        countPeople: 4,
        countRoom: 3,
        allowedGender: "ANY",
        area: 90,
        photos: [PHOTOS.living],
    },
    {
        id: "00000000-0000-4000-8000-000000000007",
        category: "Room",
        status: "HIDDEN",
        name: "Удалённое владельцем объявление",
        description: "Скрытое (мягко удалённое) объявление: не должно отображаться ни в каталоге, ни в профиле.",
        price: 4000,
        deposit: false,
        depositAmount: null,
        latitude: 50.4400,
        longitude: 30.5100,
        street: "Антоновича",
        streetNumber: "50",
        amenities: [],
        isShared: true,
        countPeople: 1,
        countRoom: 1,
        allowedGender: "ANY",
        area: 11,
        photos: [],
    },
];

async function seedCategories() {
    const categoryInitial = [
        "Room",
        "Apartment",
        "Dormitory"
    ];

    for( const categoryName of categoryInitial ){
        await prisma.category.upsert({
            where: {typeCategory: categoryName},
            update: {},
            create: {typeCategory: categoryName}
        });
    }
}

async function seedTestData() {
    const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

    const users: Record<string, string> = {};
    for (const user of TEST_USERS) {
        const saved = await prisma.user.upsert({
            where: { email: user.email },
            update: { role: user.role, passwordHash },
            create: { ...user, passwordHash },
        });
        users[user.email] = saved.id;
    }
    const ownerId = users["owner@homemarket.test"];

    const categories = await prisma.category.findMany();
    const categoryIdByName = Object.fromEntries(categories.map((c) => [c.typeCategory, c.id]));

    for (const { id, category, ...listing } of TEST_LISTINGS) {
        const data = {
            ...listing,
            ownerId,
            categoryId: categoryIdByName[category],
            deletedAt: listing.status === "HIDDEN" ? new Date() : null,
            updatedAt: new Date(),
        };
        await prisma.listing.upsert({
            where: { id },
            update: data,
            create: { id, ...data },
        });
    }

    console.log(`Test data: ${TEST_USERS.length} users (password: ${TEST_PASSWORD}), ${TEST_LISTINGS.length} listings`);
}

async function main() {
    try{
        await seedCategories();

        // Never create known-password accounts in production
        if (process.env.NODE_ENV === "production") {
            console.log("NODE_ENV=production: skipping test users and listings");
        } else {
            await seedTestData();
        }
    }catch(error){
        console.log(error);
        process.exitCode = 1;

    } finally {
        await prisma.$disconnect();
    }

}

main();
