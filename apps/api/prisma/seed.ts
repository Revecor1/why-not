import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

async function main() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const managerHash = await bcrypt.hash("manager123", 10);
  const userHash = await bcrypt.hash("user123", 10);

  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: { role: "ADMIN" },
    create: { email: "admin@test.com", passwordHash: adminHash, role: "ADMIN" }
  });

  await prisma.user.upsert({
    where: { email: "manager@test.com" },
    update: { role: "MANAGER" },
    create: { email: "manager@test.com", passwordHash: managerHash, role: "MANAGER" }
  });

  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: { role: "USER" },
    create: { email: "user@test.com", passwordHash: userHash, role: "USER" }
  });

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.news.deleteMany();

  await prisma.product.createMany({
    data: [
      { title: "Espresso", price: 15000, category: "Coffee", description: "Classic shot." },
      { title: "Americano", price: 19000, category: "Coffee", description: "Espresso + hot water." },
      { title: "Cappuccino", price: 24000, category: "Coffee", description: "Espresso + milk foam." },
      { title: "Latte", price: 26000, category: "Coffee", description: "Soft and creamy." },
      { title: "Croissant", price: 22000, category: "Bakery", description: "Buttery pastry." }
    ]
  });

  await prisma.news.create({
    data: {
      title: "Why Not is live",
      content: "New menu items and seasonal drinks are available.",
      isPublished: true,
      publishedAt: new Date()
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
