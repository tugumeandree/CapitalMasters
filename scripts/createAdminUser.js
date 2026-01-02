require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Load MONGODB_URI from environment or .env.local
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Set MONGODB_URI in environment or add it to .env.local');

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('capitalmasters');
  const users = db.collection('users');

  // Default admin credentials (used when no args provided)
  const DEFAULT_EMAIL = 'qraftcapital@gmail.com';
  const DEFAULT_PASSWORD = 'capitalmasters';

  const email = (process.argv[2] || DEFAULT_EMAIL).toLowerCase();
  const password = process.argv[3] || DEFAULT_PASSWORD;

  const hashed = await bcrypt.hash(password, 10);

  // Upsert: if user exists, update password/role; otherwise insert new admin user
  const res = await users.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        password: hashed,
        name: 'Admin User',
        role: 'admin',
        accountType: 'individual',
        riskTolerance: 'moderate',
        memberSince: new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true, returnDocument: 'after' }
  );

  // Older driver versions or certain server responses may not return the updated
  // document in `res.value`. If so, fetch the user explicitly.
  let user = res && res.value ? res.value : null;
  if (!user) {
    user = await users.findOne({ email });
  }

  console.log('Admin user created/updated:');
  console.log('  email:', user?.email);
  console.log('  id:', user?._id);

  await client.close();
}

main().catch(err => { console.error(err); process.exit(1); });
