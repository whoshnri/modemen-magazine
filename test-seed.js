const { PrismaClient } = require('./lib/generated/prisma/client');

try {
    const db = new PrismaClient();
    console.log('PrismaClient initialized successfully');
} catch (e) {
    console.error(e);
}
