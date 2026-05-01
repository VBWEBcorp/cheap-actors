import { MongoClient, type Db } from "mongodb";

const DB_NAME = "cheap-actors";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Lazy-initialize the MongoDB client. We DON'T throw at module-load
 * because the build (and certain pages in DEMO_MODE) must succeed
 * even when MONGODB_URI isn't configured. Callers should be wrapped
 * in try/catch — see getAllPersonViews / getPersonViewBySlug.
 */
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI is not configured"));
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}
