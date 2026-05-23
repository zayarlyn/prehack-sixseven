/// <reference types="node" />
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';

const prisma = new PrismaClient();

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_DATABASE_URL } = process.env;
if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_DATABASE_URL) {
  throw new Error('Missing required Firebase environment variables for seeding');
}

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: FIREBASE_DATABASE_URL,
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
  const DEV_USER = '00000000-0000-0000-0000-000000000001';

  // ── Cleanup ───────────────────────────────────────────────────────────────────
  await prisma.transaction.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.itemImage.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.user.deleteMany({});

  for (const id of ['demo-conv-1', 'demo-conv-2', 'demo-conv-3', 'demo-conv-4']) {
    await db.ref(`conversations/${id}`).remove();
  }

  // ─── Users ────────────────────────────────────────────────────────────────────
  const devUser = await prisma.user.create({
    data: {
      id: DEV_USER,
      microsoftId: 'dev-bypass-microsoft-id',
      email: 'dev@university.edu',
      fullName: 'Dev User',
      year: 2,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Engineering',
      major: 'Computer Science',
      bio: '2nd year CS student. Selling stuff I no longer need. Quick replies, easy pickup.',
      onboarded: true,
    },
  });

  const pim = await prisma.user.create({
    data: {
      microsoftId: 'pim-ms',
      email: 'pim@university.edu',
      fullName: 'Pim Suwannarat',
      year: 3,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Science',
      major: 'Mathematics',
      bio: 'Math major, usually clearing out textbooks end of semester. Fast replies!',
      onboarded: true,
    },
  });

  const tanya = await prisma.user.create({
    data: {
      microsoftId: 'tanya-ms',
      email: 'tanya@university.edu',
      fullName: 'Tanya R.',
      year: 4,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Business',
      major: 'Business Administration',
      bio: 'Moving off campus this semester, clearing out furniture and appliances.',
      onboarded: true,
    },
  });

  const boom = await prisma.user.create({
    data: {
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

  const earth = await prisma.user.create({
    data: {
      microsoftId: 'earth-ms',
      email: 'earth@university.edu',
      fullName: 'Earth W.',
      year: 1,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Computing',
      major: 'Computer Science',
      bio: 'Freshman CS student. Selling things I brought from home but ended up not using.',
      onboarded: true,
    },
  });

  const mai = await prisma.user.create({
    data: {
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

  const jay = await prisma.user.create({
    data: {
      microsoftId: 'jay-ms',
      email: 'jay@university.edu',
      fullName: 'Jay P.',
      year: 2,
      programLevel: 'Undergraduate',
      faculty: 'Faculty of Computing',
      major: 'Information Systems',
      bio: 'Buying and selling tech stuff. Always open to bundle deals.',
      onboarded: true,
    },
  });

  const tee = await prisma.user.create({
    data: {
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

  const nat = await prisma.user.create({
    data: {
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

  // ─── Time helpers ─────────────────────────────────────────────────────────────
  const now = new Date();
  const minsAgo = (n: number) => new Date(now.getTime() - n * 60 * 1000);
  const hoursAgo = (n: number) => new Date(now.getTime() - n * 3600 * 1000);
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400 * 1000);

  // ─── Dev user's active listings ───────────────────────────────────────────────
  const devItem1 = await prisma.item.create({
    data: {
      sellerId: DEV_USER,
      title: 'Dell XPS 15 laptop sleeve, barely used',
      description: 'Fits any 15" laptop. Water-resistant neoprene. Kept clean, no marks.',
      price: 280,
      category: 'electronics',
      condition: 'like_new',
      pickupLocation: 'Engineering Building',
      openToOffers: true,
      status: 'active',
      createdAt: hoursAgo(3),
    },
  });

  await prisma.item.create({
    data: {
      sellerId: DEV_USER,
      title: 'Discrete Mathematics and Its Applications, 8th ed.',
      description: 'Light pencil notes in Ch.1–3 only. Great for CS or Math students.',
      price: 720,
      category: 'books',
      condition: 'good',
      pickupLocation: 'Engineering Building',
      openToOffers: false,
      status: 'active',
      createdAt: daysAgo(1),
    },
  });

  await prisma.item.create({
    data: {
      sellerId: DEV_USER,
      title: 'Wooden bookshelf, 4 shelves — self-assembly',
      description: 'Brown finish. All parts and screws included. Perfect for a dorm room.',
      price: 890,
      category: 'furniture',
      condition: 'good',
      pickupLocation: 'Student Housing Block A',
      openToOffers: true,
      status: 'active',
      createdAt: daysAgo(3),
    },
  });

  // ─── Dev user's sold items ────────────────────────────────────────────────────
  const devSold1 = await prisma.item.create({
    data: {
      sellerId: DEV_USER,
      title: 'Sony WH-1000XM4 headphones — great condition',
      description: 'Noise cancelling, great battery life. Comes with case and cable.',
      price: 3200,
      category: 'electronics',
      condition: 'good',
      pickupLocation: 'Engineering Building',
      openToOffers: false,
      status: 'sold',
      soldAt: daysAgo(7),
      createdAt: daysAgo(14),
    },
  });

  const devSold2 = await prisma.item.create({
    data: {
      sellerId: DEV_USER,
      title: 'Introduction to Algorithms (CLRS), 3rd ed.',
      description: 'No marks, spine intact. Classic algorithms textbook.',
      price: 1100,
      category: 'books',
      condition: 'like_new',
      pickupLocation: 'Engineering Building',
      openToOffers: false,
      status: 'sold',
      soldAt: daysAgo(14),
      createdAt: daysAgo(21),
    },
  });

  // ─── Items dev user purchased (sold by others) ────────────────────────────────
  const tanyaSoldItem = await prisma.item.create({
    data: {
      sellerId: tanya.id,
      title: 'IKEA desk chair, adjustable height — white',
      description: 'Adjustable height. Minor scuff on one armrest. Great for long sessions.',
      price: 1200,
      category: 'furniture',
      condition: 'good',
      pickupLocation: 'Dorm Block C',
      openToOffers: false,
      status: 'sold',
      soldAt: daysAgo(5),
      createdAt: daysAgo(10),
    },
  });

  const earthSoldItem = await prisma.item.create({
    data: {
      sellerId: earth.id,
      title: 'Logitech MX Master 3 mouse — ergonomic, rechargeable',
      description: 'Works on any surface. Used one semester. Includes USB receiver.',
      price: 1450,
      category: 'electronics',
      condition: 'good',
      pickupLocation: 'Computing Building',
      openToOffers: false,
      status: 'sold',
      soldAt: daysAgo(10),
      createdAt: daysAgo(17),
    },
  });

  // ─── Transactions ─────────────────────────────────────────────────────────────
  // Dev user sold to others
  await prisma.transaction.create({
    data: { itemId: devSold1.id, sellerId: DEV_USER, buyerId: pim.id, finalPrice: 3200, createdAt: daysAgo(7) },
  });
  await prisma.transaction.create({
    data: { itemId: devSold2.id, sellerId: DEV_USER, buyerId: tee.id, finalPrice: 1100, createdAt: daysAgo(14) },
  });
  // Dev user bought from others
  await prisma.transaction.create({
    data: { itemId: tanyaSoldItem.id, sellerId: tanya.id, buyerId: DEV_USER, finalPrice: 1200, createdAt: daysAgo(5) },
  });
  await prisma.transaction.create({
    data: { itemId: earthSoldItem.id, sellerId: earth.id, buyerId: DEV_USER, finalPrice: 1450, createdAt: daysAgo(10) },
  });

  // ─── Other users' active listings ─────────────────────────────────────────────
  await prisma.item.createMany({
    data: [
      {
        sellerId: pim.id,
        title: 'Calculus: Early Transcendentals, 8th ed. — light highlighting',
        description: 'Only a few pages highlighted in Chapter 1–3. Spine intact.',
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

  // ─── Conversations ────────────────────────────────────────────────────────────
  const ms = (n: number) => Date.now() - n;
  const min = 60 * 1000;
  const hr = 60 * min;

  // Conv 1: devUser (buyer) ↔ pim (seller) — Calculus book — both read all
  const calcBook = await prisma.item.findFirst({ where: { sellerId: pim.id, category: 'books' } });
  if (calcBook) {
    await prisma.conversation.create({
      data: { firebaseId: 'demo-conv-1', itemId: calcBook.id, buyerId: DEV_USER, sellerId: pim.id },
    });
    await seedFirebaseConversation(
      'demo-conv-1',
      [
        {
          key: 'm1',
          senderId: pim.id,
          content: 'Hi! Still available. Highlighting is only in Ch.1–3, rest is clean.',
          createdAt: ms(5 * hr),
        },
        {
          key: 'm2',
          senderId: DEV_USER,
          content: 'Sounds good! Is Science Building Lobby pickup fine this week?',
          createdAt: ms(4 * hr + 40 * min),
        },
        {
          key: 'm3',
          senderId: pim.id,
          content: "Yep, I'm around weekdays after 1pm.",
          createdAt: ms(4 * hr + 20 * min),
        },
        {
          key: 'm4',
          senderId: DEV_USER,
          content: "Perfect, I'll come by tomorrow at 2pm. Thanks!",
          createdAt: ms(4 * hr),
        },
        { key: 'm5', senderId: pim.id, content: 'Great, see you then!', createdAt: ms(3 * hr + 55 * min) },
      ],
      { [DEV_USER]: ms(3 * hr), [pim.id]: ms(3 * hr + 50 * min) },
    );
  }

  // Conv 2: devUser (buyer) ↔ earth (seller) — TI-84 — earth replied last, devUser has unread
  const ti84 = await prisma.item.findFirst({ where: { sellerId: earth.id, title: { contains: 'TI-84' } } });
  if (ti84) {
    await prisma.conversation.create({
      data: { firebaseId: 'demo-conv-2', itemId: ti84.id, buyerId: DEV_USER, sellerId: earth.id },
    });
    await seedFirebaseConversation(
      'demo-conv-2',
      [
        {
          key: 'm1',
          senderId: DEV_USER,
          content: 'Hi! Is the TI-84 still available?',
          createdAt: ms(2 * hr + 30 * min),
        },
        {
          key: 'm2',
          senderId: earth.id,
          content: 'Yes it is! Want to meet up today?',
          createdAt: ms(2 * hr + 10 * min),
        },
        { key: 'm3', senderId: DEV_USER, content: 'Sure, when are you free?', createdAt: ms(2 * hr) },
        {
          key: 'm4',
          senderId: earth.id,
          content: 'How about 3pm at the Engineering Building entrance?',
          createdAt: ms(1 * hr + 45 * min),
        },
      ],
      // devUser hasn't read earth's last reply → unread badge for devUser
      { [DEV_USER]: ms(2 * hr), [earth.id]: ms(1 * hr + 40 * min) },
    );
  }

  // Conv 3: devUser (buyer) ↔ mai (seller) — AirPods — mai replied last, devUser has unread
  const airpods = await prisma.item.findFirst({ where: { sellerId: mai.id, title: { contains: 'AirPods' } } });
  if (airpods) {
    await prisma.conversation.create({
      data: { firebaseId: 'demo-conv-3', itemId: airpods.id, buyerId: DEV_USER, sellerId: mai.id },
    });
    await seedFirebaseConversation(
      'demo-conv-3',
      [
        {
          key: 'm1',
          senderId: DEV_USER,
          content: 'Hi! Interested in the AirPods. Any room to negotiate on price?',
          createdAt: ms(6 * hr),
        },
        {
          key: 'm2',
          senderId: mai.id,
          content: "They're barely used so I'd prefer to keep the price. But I can throw in the original box.",
          createdAt: ms(5 * hr + 40 * min),
        },
        {
          key: 'm3',
          senderId: DEV_USER,
          content: 'Understood! Are they still available?',
          createdAt: ms(5 * hr + 20 * min),
        },
        {
          key: 'm4',
          senderId: mai.id,
          content: 'Yes! Available any day this week. Just DM me when you want to come by.',
          createdAt: ms(5 * hr),
        },
      ],
      // devUser hasn't read mai's last message
      { [DEV_USER]: ms(5 * hr + 20 * min), [mai.id]: ms(4 * hr + 55 * min) },
    );
  }

  // Conv 4: jay (buyer) ↔ devUser (seller) — devUser's laptop sleeve — devUser read all, waiting for jay
  await prisma.conversation.create({
    data: { firebaseId: 'demo-conv-4', itemId: devItem1.id, buyerId: jay.id, sellerId: DEV_USER },
  });
  await seedFirebaseConversation(
    'demo-conv-4',
    [
      {
        key: 'm1',
        senderId: jay.id,
        content: 'Hey! Is the laptop sleeve still available?',
        createdAt: ms(1 * hr + 20 * min),
      },
      {
        key: 'm2',
        senderId: DEV_USER,
        content: "Yep, barely used. It's in perfect shape.",
        createdAt: ms(1 * hr + 5 * min),
      },
      { key: 'm3', senderId: jay.id, content: "What's the lowest you'd go?", createdAt: ms(55 * min) },
      {
        key: 'm4',
        senderId: DEV_USER,
        content: 'I can do ฿250 if you pick up today at Engineering Building.',
        createdAt: ms(40 * min),
      },
    ],
    // devUser has read all; jay hasn't read devUser's last reply
    { [DEV_USER]: ms(35 * min), [jay.id]: ms(55 * min) },
  );

  console.log('Seed complete — 9 users, 23 active items, 4 sold items, 4 transactions, 4 conversations');

  await firebaseApp.delete();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
