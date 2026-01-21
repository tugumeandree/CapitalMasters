import { MongoClient, Db } from 'mongodb';

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }

  if (clientPromise) {
    return clientPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

// Export a function that returns the client promise (deferred initialization)
export default getClientPromise();

/**
 * Get the database instance
 */
export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise();
  return client.db('capitalmasters');
}

/**
 * Database collections
 */
export const collections = {
  users: 'users',
  contacts: 'contacts',
  newsletters: 'newsletters',
  portfolios: 'portfolios',
  transactions: 'transactions',
  documents: 'documents',
  admin_logs: 'admin_logs',
} as const;
