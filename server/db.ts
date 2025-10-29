import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  services,
  clients,
  pricingParameters,
  proposals,
  proposalItems,
  type Service,
  type Client,
  type PricingParameters,
  type Proposal,
  type ProposalItem,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// SERVICES
// ============================================================================

export async function createService(
  userId: number,
  data: Omit<typeof services.$inferInsert, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(services).values(data);
  return result;
}

export async function getServices(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(services);
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateService(
  id: number,
  data: Partial<typeof services.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(services).set(data).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(services).where(eq(services.id, id));
}

// ============================================================================
// CLIENTS
// ============================================================================

export async function createClient(
  userId: number,
  data: Omit<typeof clients.$inferInsert, "id" | "createdAt" | "updatedAt" | "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(clients).values({ ...data, userId });
}

export async function getClients(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(clients).where(eq(clients.userId, userId));
}

export async function getClientById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, id), eq(clients.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateClient(
  id: number,
  userId: number,
  data: Partial<typeof clients.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(clients)
    .set(data)
    .where(and(eq(clients.id, id), eq(clients.userId, userId)));
}

export async function deleteClient(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .delete(clients)
    .where(and(eq(clients.id, id), eq(clients.userId, userId)));
}

// ============================================================================
// PRICING PARAMETERS
// ============================================================================

export async function createPricingParameters(
  userId: number,
  data: Omit<
    typeof pricingParameters.$inferInsert,
    "id" | "createdAt" | "updatedAt" | "userId"
  >
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(pricingParameters).values({ ...data, userId });
}

export async function getActivePricingParameters(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(pricingParameters)
    .where(
      and(
        eq(pricingParameters.userId, userId),
        eq(pricingParameters.isActive, true)
      )
    )
    .orderBy(desc(pricingParameters.effectiveDate))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getPricingParametersById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(pricingParameters)
    .where(
      and(
        eq(pricingParameters.id, id),
        eq(pricingParameters.userId, userId)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updatePricingParameters(
  id: number,
  userId: number,
  data: Partial<typeof pricingParameters.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(pricingParameters)
    .set(data)
    .where(
      and(
        eq(pricingParameters.id, id),
        eq(pricingParameters.userId, userId)
      )
    );
}

// ============================================================================
// PROPOSALS
// ============================================================================

export async function createProposal(
  userId: number,
  data: Omit<typeof proposals.$inferInsert, "id" | "createdAt" | "updatedAt" | "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(proposals).values({ ...data, userId });
}

export async function getProposals(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(proposals)
    .where(eq(proposals.userId, userId))
    .orderBy(desc(proposals.createdAt));
}

export async function getProposalById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(proposals)
    .where(and(eq(proposals.id, id), eq(proposals.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateProposal(
  id: number,
  userId: number,
  data: Partial<typeof proposals.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(proposals)
    .set(data)
    .where(and(eq(proposals.id, id), eq(proposals.userId, userId)));
}

export async function deleteProposal(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .delete(proposals)
    .where(and(eq(proposals.id, id), eq(proposals.userId, userId)));
}

// ============================================================================
// PROPOSAL ITEMS
// ============================================================================

export async function createProposalItem(
  data: Omit<typeof proposalItems.$inferInsert, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(proposalItems).values(data);
}

export async function getProposalItems(proposalId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(proposalItems)
    .where(eq(proposalItems.proposalId, proposalId));
}

export async function getProposalItemById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(proposalItems)
    .where(eq(proposalItems.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateProposalItem(
  id: number,
  data: Partial<typeof proposalItems.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(proposalItems)
    .set(data)
    .where(eq(proposalItems.id, id));
}

export async function deleteProposalItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(proposalItems).where(eq(proposalItems.id, id));
}

export async function deleteProposalItemsByProposalId(proposalId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .delete(proposalItems)
    .where(eq(proposalItems.proposalId, proposalId));
}
