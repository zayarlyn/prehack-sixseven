/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      microsoftId: 'dev-bypass-microsoft-id',
      email: 'dev@university.edu',
      fullName: 'Dev User',
      year: 2,
      programLevel: 'undergraduate',
      faculty: 'Faculty of Engineering',
      major: 'Computer Science',
      onboarded: true,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      microsoftId: 'user1-ms',
      email: 'user1@university.edu',
      fullName: 'John Doe',
      year: 2,
      programLevel: 'undergraduate',
      faculty: 'Engineering',
      major: 'Computer Science',
      onboarded: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      microsoftId: 'user2-ms',
      email: 'user2@university.edu',
      fullName: 'Jane Smith',
      year: 3,
      programLevel: 'undergraduate',
      faculty: 'Science',
      major: 'Biology',
      onboarded: true,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      microsoftId: 'user3-ms',
      email: 'user3@university.edu',
      fullName: 'Bob Wilson',
      year: 1,
      programLevel: 'undergraduate',
      faculty: 'Engineering',
      major: 'Mechanical Engineering',
      onboarded: true,
    },
  });

  const item1 = await prisma.item.create({
    data: {
      id: 'item1',
      sellerId: user1.id,
      title: 'Introduction to Algorithms',
      description: 'Used textbook in excellent condition',
      price: 45.99,
      category: 'books',
      condition: 'good',
      pickupLocation: 'Library Building',
      openToOffers: true,
      status: 'active',
    },
  });

  await prisma.item.create({
    data: {
      id: 'item2',
      sellerId: user1.id,
      title: 'Mechanical Keyboard',
      description: 'RGB backlit keyboard, rarely used',
      price: 89.99,
      category: 'electronics',
      condition: 'like_new',
      pickupLocation: 'Tech Building',
      openToOffers: false,
      status: 'active',
    },
  });

  const item3 = await prisma.item.create({
    data: {
      id: 'item3',
      sellerId: user2.id,
      title: 'IKEA Desk',
      description: 'White desk, perfect for studying',
      price: 35.0,
      category: 'furniture',
      condition: 'good',
      pickupLocation: 'Student Housing',
      openToOffers: true,
      status: 'active',
    },
  });

  await prisma.item.create({
    data: {
      id: 'item4',
      sellerId: user2.id,
      title: 'Winter Jacket',
      description: 'Navy blue winter jacket, size M',
      price: 25.0,
      category: 'clothing',
      condition: 'good',
      pickupLocation: 'Student Center',
      openToOffers: true,
      status: 'active',
    },
  });

  await prisma.item.create({
    data: {
      id: 'item5',
      sellerId: user3.id,
      title: 'Calculus Textbook',
      description: 'Calculus I textbook with notes',
      price: 55.0,
      category: 'books',
      condition: 'fair',
      pickupLocation: 'Math Building',
      openToOffers: false,
      status: 'active',
    },
  });

  await prisma.item.create({
    data: {
      id: 'item6',
      sellerId: user3.id,
      title: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI',
      price: 19.99,
      category: 'electronics',
      condition: 'new',
      pickupLocation: 'Tech Building',
      openToOffers: false,
      status: 'active',
    },
  });

  await prisma.conversation.create({
    data: {
      id: 'conv1',
      firebaseId: 'conv1-fb',
      itemId: item1.id,
      buyerId: user2.id,
      sellerId: user1.id,
    },
  });

  await prisma.conversation.create({
    data: {
      id: 'conv2',
      firebaseId: 'conv2-fb',
      itemId: item3.id,
      buyerId: user1.id,
      sellerId: user2.id,
    },
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
