import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const colors = [
  { name: 'Vermelho', hexCode: '#FF0000' },
  { name: 'Laranja', hexCode: '#FF7F00' },
  { name: 'Amarelo', hexCode: '#FFFF00' },
  { name: 'Verde', hexCode: '#00FF00' },
  { name: 'Azul', hexCode: '#0000FF' },
  { name: 'Anil', hexCode: '#4B0082' },
  { name: 'Violeta', hexCode: '#9400D3' },
];

async function main() {
  console.log('Seeding colors...');
  for (const color of colors) {
    await prisma.color.create({
      data: color,
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
