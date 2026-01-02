const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not set. Add it to .env.local or the environment.');
  process.exit(1);
}

const ADMIN_EMAIL = 'qraftcapital@gmail.com';
const ADMIN_PASSWORD = 'capitalmasters';

async function main() {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    // Ensure we use the same database name as the app
    const db = client.db('capitalmasters');
    const users = db.collection('users');

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const now = new Date();

    const res = await users.findOneAndUpdate(
      { email: ADMIN_EMAIL.toLowerCase() },
      {
        $set: {
          email: ADMIN_EMAIL.toLowerCase(),
          password: hashed,
          role: 'admin',
          updatedAt: now
        },
        $setOnInsert: {
          createdAt: now
        }
      },
      { upsert: true, returnDocument: 'after' }
    );

    const user = res.value;
    console.log('Admin user created/updated:');
    console.log('  email:', user.email);
    console.log('  id:', user._id);
    console.log('  role:', user.role);

    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    try { await client.close(); } catch (e) {}
    process.exit(1);
  }
}

main();
