import { PrismaClient, AllowedRoles } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Check if roles exist
  const roleCount = await prisma.role.count();
  if (roleCount === 0) {
    console.log('No roles found, creating roles...');
    await prisma.role.createMany({
      data: Object.values(AllowedRoles).map((role) => ({ name: role })),
    });
  }

  // Check if users exist
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    console.log('No users found, creating users...');

    // Define users with plaintext passwords
    const usersToCreate = [
      {
        email: 'admin@example.com',
        password: '123456',
        firstName: 'Admin',
        lastName: 'User',
        roleName: AllowedRoles.ADMIN,
      },
      {
        email: 'user@example.com',
        password: '123456',
        firstName: 'Regular',
        lastName: 'User',
        roleName: AllowedRoles.USER,
      },
    ];

    // Fetch roles after inserting (to get their IDs)
    const roles = await prisma.role.findMany();
    const roleMap = new Map(roles.map((role) => [role.name, role.id]));

    // Insert users and their roles
    await Promise.all(
      usersToCreate.map(async (user) => {
        const roleId = roleMap.get(user.roleName);
        if (!roleId) return;

        await prisma.user.create({
          data: {
            email: user.email,
            password: user.password, // Storing plain text password (not secure)
            firstName: user.firstName,
            lastName: user.lastName,
            roles: {
              create: { role: { connect: { id: roleId } } },
            },
          },
        });
      })
    );
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void (async () => {
      await prisma.$disconnect();
    })();
  });
