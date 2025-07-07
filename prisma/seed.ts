import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crate a user
  const user = await prisma.user.create({
    data: {
      id: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f',
      name: 'Victor Hugo Mosquera',
      email: 'victor.mosquera@unillanos.edu.co',
    },
  });

  console.log('User created:', user);

  // Create a messages related to the user
  const message = await prisma.message.create({
    data: {
      content: '¡Hi there, Joan!',
      userId: user.id, // relationship with the user
    },
  });
  console.log('Message created:', message);

  const message2 = await prisma.message.create({
    data: {
      content: 'Can you help me with this selection process ?',
      userId: user.id, // relationship with the user
    },
  });

  console.log('Message created:', message2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });