import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createPool } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';

// DATABASE_URL expected like: mysql://user:password@host:port/database
const DATABASE_URL = process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/blackbelt';

const pool = createPool(DATABASE_URL);

// drizzle instance
export const db = drizzle(pool);
