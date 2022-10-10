import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testAthltes = async () => {
  const athletes = await prisma.athlete.create({
    include: {
      result: true,
    },
    // data: testAthletes,
    data: {
      id: '42fdsf',
      athleteName: 'Fredrik Froberg',
      club: 'Sjundo',
      PB: 1,
      SB: 12,
      result: {
        create: {
          attempts: {
            create: {
              attempt1: '10.10',
            },
          },
          ownerToken: '232fd',
        },
      },
    },
  });
  console.log('test athlete', athletes);
};

testAthltes();
