import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

function createUniqueCategories(targetCount: number): Prisma.CategoryCreateInput[] {
  const categories = new Set<string>();
  const categoryData: Prisma.CategoryCreateInput[] = [];

  while (categoryData.length < targetCount) {
    const categoryName = faker.commerce.department();

    if (!categories.has(categoryName)) {
      const createdAt = faker.date.between({ from: '2010-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' });
      categoryData.push({ categoryUuid: faker.string.uuid(), name: categoryName, createdAt, updatedAt: createdAt });
      categories.add(categoryName);
    }
  }

  return categoryData;
}

function createUniqueProducts(
  categories: Prisma.CategoryCreateInput[],
  productsPerCategory: number
): Prisma.ProductCreateInput[] {
  const productData: Prisma.ProductCreateInput[] = [];

  categories.forEach((category) => {
    const uniqueProductNames = new Set<string>();

    while (uniqueProductNames.size < productsPerCategory) {
      const productName = faker.commerce.productName();

      if (!uniqueProductNames.has(productName)) {
        const createdAt = faker.date.between({ from: '2010-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' });

        productData.push({
          productUuid: faker.string.uuid(),
          name: productName,
          description: faker.commerce.productDescription(),
          price: new Decimal(faker.commerce.price()),
          stock: faker.number.int({ min: 1, max: 100 }),
          color: faker.color.human(),
          createdAt,
          updatedAt: createdAt,
          categories: {
            connect: { categoryUuid: category.categoryUuid },
          },
        });

        uniqueProductNames.add(productName);
      }
    }
  });

  return productData;
}

async function main() {
  const numberOfCategories = 20;
  const productsPerCategory = 3000;

  const categories = createUniqueCategories(numberOfCategories);
  const categoriesResult = await prisma.category.createMany({ data: categories });

  console.log('Categories were successfully seeded', { categories: categoriesResult });

  const products = createUniqueProducts(categories, productsPerCategory);

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('Products were successfully seeded', { products: { count: products.length } });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
