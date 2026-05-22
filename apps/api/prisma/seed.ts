/// <reference types="node" />
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';

const prisma = new PrismaClient();

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  } as admin.ServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();

async function seedFirebaseConversation(
  firebaseId: string,
  messages: { key: string; senderId: string; content: string; createdAt: number }[],
  readBy: Record<string, number>,
) {
  const msgMap: Record<string, { senderId: string; type: string; content: string; createdAt: number }> = {};
  for (const m of messages) {
    msgMap[m.key] = { senderId: m.senderId, type: 'text', content: m.content, createdAt: m.createdAt };
  }
  await db.ref(`conversations/${firebaseId}`).set({ messages: msgMap, readBy });
}

async function main() {
  // Clear existing item-related data so seed is safe to re-run
  await prisma.transaction.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.itemImage.deleteMany();
  await prisma.item.deleteMany();

  // ─── Users ───────────────────────────────────────────────────────
  const devUser = await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: DEV_USER,
      microsoftId: 'dev-bypass-microsoft-id',
      email: 'dev@university.edu',
      fullName: 'Dev User',
      year: 2,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Engineering',
      major: 'Computer Science',
      onboarded: true,
    },
  });

  const pim = await prisma.user.upsert({
    where: { microsoftId: 'pim-ms' },
    update: {},
    create: {
      microsoftId: 'pim-ms',
      email: 'pim@university.edu',
      fullName: 'Pim Suwannarat',
      year: 3,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Science',
      major: 'Mathematics',
      onboarded: true,
    },
  });

  const tanya = await prisma.user.upsert({
    where: { microsoftId: 'tanya-ms' },
    update: {},
    create: {
      microsoftId: 'tanya-ms',
      email: 'tanya@university.edu',
      fullName: 'Tanya R.',
      year: 4,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Business',
      major: 'Business Administration',
      onboarded: true,
    },
  });

  const boom = await prisma.user.upsert({
    where: { microsoftId: 'boom-ms' },
    update: {},
    create: {
      microsoftId: 'boom-ms',
      email: 'boom@university.edu',
      fullName: 'Boom K.',
      year: 2,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Engineering',
      major: 'Civil Engineering',
      onboarded: true,
    },
  });

  const earth = await prisma.user.upsert({
    where: { microsoftId: 'earth-ms' },
    update: {},
    create: {
      microsoftId: 'earth-ms',
      email: 'earth@university.edu',
      fullName: 'Earth W.',
      year: 1,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Computing',
      major: 'Computer Science',
      onboarded: true,
    },
  });

  const mai = await prisma.user.upsert({
    where: { microsoftId: 'mai-ms' },
    update: {},
    create: {
      microsoftId: 'mai-ms',
      email: 'mai@university.edu',
      fullName: 'Mai L.',
      year: 3,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Arts & Social Sciences',
      major: 'Psychology',
      onboarded: true,
    },
  });

  const jay = await prisma.user.upsert({
    where: { microsoftId: 'jay-ms' },
    update: {},
    create: {
      microsoftId: 'jay-ms',
      email: 'jay@university.edu',
      fullName: 'Jay P.',
      year: 2,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Computing',
      major: 'Information Systems',
      onboarded: true,
    },
  });

  const tee = await prisma.user.upsert({
    where: { microsoftId: 'tee-ms' },
    update: {},
    create: {
      microsoftId: 'tee-ms',
      email: 'tee@university.edu',
      fullName: 'Tee C.',
      year: 4,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Science',
      major: 'Chemistry',
      onboarded: true,
    },
  });

  const nat = await prisma.user.upsert({
    where: { microsoftId: 'nat-ms' },
    update: {},
    create: {
      microsoftId: 'nat-ms',
      email: 'nat@university.edu',
      fullName: 'Nat A.',
      year: 1,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Engineering',
      major: 'Electrical Engineering',
      onboarded: true,
    },
  });

  // ─── Items ────────────────────────────────────────────────────────
  const now = new Date();
  const minsAgo = (n: number) => new Date(now.getTime() - n * 60 * 1000);
  const hoursAgo = (n: number) => new Date(now.getTime() - n * 60 * 60 * 1000);
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  await prisma.item.createMany({
    data: [
      {
        sellerId: pim.id,
        title: 'Calculus: Early Transcendentals, 8th ed. — light highlighting',
        description: 'Only a few pages highlighted in Chapter 1–3. Spine intact. Great condition for the price.',
        price: 250,
        category: 'books',
        condition: 'good',
        pickupLocation: 'Science Building Lobby',
        openToOffers: true,
        status: 'active',
        createdAt: minsAgo(12),
      },
      {
        sellerId: tanya.id,
        title: 'Mini fridge (1.7 cu ft), works great — moving out',
        description: "Compact dorm fridge, runs quietly. Selling because I'm moving off campus.",
        price: 1400,
        category: 'other',
        condition: 'good',
        pickupLocation: 'Dorm Block C',
        openToOffers: true,
        status: 'active',
        createdAt: hoursAgo(1),
      },
      {
        sellerId: boom.id,
        title: 'IKEA MALM desk, white — some scratches on top',
        description: 'Solid desk, minor surface scratches. Comes disassembled. Pick up only.',
        price: 950,
        category: 'furniture',
        condition: 'good',
        pickupLocation: 'Student Housing Block A',
        openToOffers: false,
        status: 'active',
        createdAt: hoursAgo(2),
      },
      {
        sellerId: earth.id,
        title: 'TI-84 Plus graphing calculator + charger',
        description: 'Used for one semester. All keys work perfectly. Comes with USB charger.',
        price: 1600,
        category: 'electronics',
        condition: 'like_new',
        pickupLocation: 'Engineering Building',
        openToOffers: false,
        status: 'active',
        createdAt: hoursAgo(2),
      },
      {
        sellerId: mai.id,
        title: 'Twin XL dorm bedding set (sheets + duvet)',
        description: 'Washed and clean. Light blue set. Fits standard dorm beds.',
        price: 480,
        category: 'other',
        condition: 'good',
        pickupLocation: 'Dorm Block B',
        openToOffers: true,
        status: 'active',
        createdAt: hoursAgo(4),
      },
      {
        sellerId: jay.id,
        title: 'Lenovo 65W laptop charger USB-C — like new',
        description: 'Used only a couple times. Compatible with most USB-C laptops.',
        price: 320,
        category: 'electronics',
        condition: 'like_new',
        pickupLocation: 'Computing Building',
        openToOffers: false,
        status: 'active',
        createdAt: hoursAgo(5),
      },
      {
        sellerId: tanya.id,
        title: 'Road bike, size M, recently serviced — pickup near campus',
        description: 'Shimano gears, new brake pads. Serviced last month. Great for commuting.',
        price: 3800,
        category: 'other',
        condition: 'good',
        pickupLocation: 'Carpark B',
        openToOffers: true,
        status: 'active',
        createdAt: hoursAgo(6),
      },
      {
        sellerId: tee.id,
        title: 'Organic Chemistry, Klein 4th ed. — no writing inside',
        description: 'Pristine condition. No highlights, no notes. Bought but ended up not using.',
        price: 1450,
        category: 'books',
        condition: 'like_new',
        pickupLocation: 'Science Library',
        openToOffers: true,
        status: 'active',
        createdAt: hoursAgo(8),
      },
      {
        sellerId: nat.id,
        title: 'IKEA RANARP desk lamp, black — works perfectly',
        description: 'Classic arm lamp. Bulb included. Great for late-night studying.',
        price: 580,
        category: 'furniture',
        condition: 'good',
        pickupLocation: 'Engineering Dorm',
        openToOffers: false,
        status: 'active',
        createdAt: hoursAgo(11),
      },
      {
        sellerId: mai.id,
        title: 'AirPods Pro (2nd gen) with MagSafe case — barely used',
        description: 'Less than 5 hours of use. Battery health 100%. Original box included.',
        price: 2700,
        category: 'electronics',
        condition: 'like_new',
        pickupLocation: 'Student Center',
        openToOffers: false,
        status: 'active',
        createdAt: hoursAgo(14),
      },
      {
        sellerId: boom.id,
        title: "North Face puffer jacket, men's M, black",
        description: 'Worn one season. No tears or stains. Perfect for cold lecture halls.',
        price: 1100,
        category: 'clothing',
        condition: 'good',
        pickupLocation: 'Engineering Building',
        openToOffers: true,
        status: 'active',
        createdAt: daysAgo(1),
      },
      {
        sellerId: jay.id,
        title: 'Ethernet cable 8m, Cat 6 — for dorm Wi-Fi backup',
        description: 'Flat cable, easy to route along walls. Never had signal issues.',
        price: 250,
        category: 'electronics',
        condition: 'like_new',
        pickupLocation: 'Computing Building',
        openToOffers: false,
        status: 'active',
        createdAt: daysAgo(1),
      },
      {
        sellerId: earth.id,
        title: 'KMUTT engineering hoodie, size L — worn once',
        description: 'Limited edition faculty hoodie. Too big for me. Still has that new-hoodie feel.',
        price: 380,
        category: 'clothing',
        condition: 'like_new',
        pickupLocation: 'Engineering Building Lobby',
        openToOffers: true,
        status: 'active',
        createdAt: daysAgo(1),
      },
      {
        sellerId: nat.id,
        title: 'Full-length floor mirror, 150cm — pickup only',
        description: 'Thin frame, no cracks. Leaning style. Needs two people to move safely.',
        price: 650,
        category: 'furniture',
        condition: 'good',
        pickupLocation: 'Engineering Dorm',
        openToOffers: true,
        status: 'active',
        createdAt: daysAgo(2),
      },
      {
        sellerId: pim.id,
        title: 'CS 101: Intro to Programming, 4th ed. — minor highlighting',
        description: 'Yellow highlights in Ch.1–4 only. Good for first-year CS students.',
        price: 640,
        category: 'books',
        condition: 'good',
        pickupLocation: 'Science Building Lobby',
        openToOffers: false,
        status: 'active',
        createdAt: daysAgo(2),
      },
      {
        sellerId: tanya.id,
        title: 'Standing fan, 3 speeds, like new',
        description: 'Bought last semester, barely used. Quiet motor. Easy to assemble.',
        price: 800,
        category: 'other',
        condition: 'like_new',
        pickupLocation: 'Dorm Block C',
        openToOffers: true,
        status: 'active',
        createdAt: daysAgo(3),
      },
      {
        sellerId: jay.id,
        title: 'Hori Switch Pro controller — wired',
        description: 'Tournament-grade wired controller. No wireless lag. Works on PC too.',
        price: 690,
        category: 'electronics',
        condition: 'good',
        pickupLocation: 'Computing Building',
        openToOffers: false,
        status: 'active',
        createdAt: daysAgo(3),
      },
      {
        sellerId: tee.id,
        title: 'Linear Algebra Done Right, 3rd ed.',
        description: 'Excellent for self-study. A few pencil notes, fully erasable. No rips.',
        price: 580,
        category: 'books',
        condition: 'good',
        pickupLocation: 'Science Library',
        openToOffers: true,
        status: 'active',
        createdAt: daysAgo(4),
      },
    ],
  });

  // ─── One conversation between dev user and pim ────────────────────
  const firstItem = await prisma.item.findFirst({ where: { sellerId: pim.id } });
  if (firstItem) {
    await prisma.conversation.create({
      data: {
        firebaseId: 'demo-conv-1',
        itemId: firstItem.id,
        buyerId: devUser.id,
        sellerId: pim.id,
      },
    });
  }

  console.log('Seed complete — 18 items, 9 users');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
