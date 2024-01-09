import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient, RoleEnum, ThemeEnum } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function createRoles() {
  const roles: Prisma.RoleCreateInput[] = [
    {
      roleUuid: 'fb1f6cf4-4836-410b-a56e-97712f41e2ce',
      name: RoleEnum.USER,
    },
    {
      roleUuid: '5b92a913-be89-4bf4-b41a-15c1c7f5beb7',
      name: RoleEnum.MANAGER,
    },
    {
      roleUuid: 'd327f90f-f9ff-4e91-b9da-c73679d5f8db',
      name: RoleEnum.ADMIN,
    },
  ];

  await prisma.role.createMany({ data: roles });
}

async function createUniqueUsers(targetCount: number): Promise<Prisma.UserCreateInput[]> {
  const generatedEmails = new Set<string>();
  const generatedUsernames = new Set<string>();
  const users: Prisma.UserCreateInput[] = [];

  while (users.length < targetCount) {
    const newUser = await createRandomUser();

    if (!generatedEmails.has(newUser.email) && !generatedUsernames.has(newUser.username)) {
      users.push(newUser);
      generatedEmails.add(newUser.email);
      generatedUsernames.add(newUser.username);
    }
  }

  return users;
}

async function createRandomUser(): Promise<Prisma.UserCreateInput> {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const userInitial = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  const createdAt = faker.date.between({ from: '2010-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' });

  return {
    userUuid: faker.string.uuid(),
    firstName,
    lastName,
    userInitial,
    username: faker.internet.userName({ firstName, lastName }),
    displayName: `${firstName} ${lastName}`,
    dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    email: faker.internet.email({ firstName, lastName }),
    passwordHash: await argon2.hash('password'),
    language: faker.helpers.arrayElement(['ua', 'en', 'pl']),
    theme: faker.helpers.arrayElement([ThemeEnum.AUTO, ThemeEnum.DARK, ThemeEnum.LIGHT]),
    createdAt,
    updatedAt: createdAt,
    address: {
      create: {
        addressUuid: faker.string.uuid(),
        streetAddress: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        createdAt,
        updatedAt: createdAt,
      },
    },
    roles: {
      connect: { roleUuid: 'fb1f6cf4-4836-410b-a56e-97712f41e2ce' },
    },
  };
}

async function main() {
  await createRoles();

  const users: Prisma.UserCreateInput[] = await createUniqueUsers(10000);

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log('Users were successfully seeded', { users: { count: users.length } });
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
