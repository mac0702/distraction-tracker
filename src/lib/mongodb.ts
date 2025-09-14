import mongoose from "mongoose";
import { MongoClient } from "mongodb";

interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedMongoose;
  var mongoClientPromise: Promise<MongoClient> | null;
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/distraction-tracker";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Create a MongoDB client promise for NextAuth
if (!global.mongoClientPromise) {
  const client = new MongoClient(MONGODB_URI);
  global.mongoClientPromise = client.connect();
}

const clientPromise = global.mongoClientPromise;
export default clientPromise;
