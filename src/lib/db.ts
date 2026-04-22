import mongoose from "mongoose";

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const globalCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

function hasMongoUriPlaceholder(value: string) {
  return value.includes("<db_password>");
}

if (!global.mongooseCache) {
  global.mongooseCache = globalCache;
}

export function isMongoConfigured() {
  const mongodbUri = process.env.MONGODB_URI?.trim();

  if (!mongodbUri) {
    return false;
  }

  return !hasMongoUriPlaceholder(mongodbUri);
}

export async function connectToDatabase() {
  const mongodbUri = process.env.MONGODB_URI?.trim();

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (hasMongoUriPlaceholder(mongodbUri)) {
    throw new Error("MONGODB_URI still contains <db_password> placeholder.");
  }

  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(mongodbUri, {
      dbName: process.env.MONGODB_DB ?? "portfolio_app",
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
