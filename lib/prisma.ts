// lib/prisma.ts (or lib/db.ts)

import { PrismaClient } from '@prisma/client'

declare global {
  // This prevents TypeScript errors in ESM
  var prisma: PrismaClient | undefined
}

// Use globalThis instead of global (works in both Node and Edge)
const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  })

// Only attach to globalThis in development/hot-reload environments
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}


export default prisma