require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in environment or .env.local');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('capitalmasters');
    const users = db.collection('users');
    const admins = await users.find({ role: 'admin' }, { projection: { email: 1, name: 1, createdAt: 1 } }).toArray();
    if (admins.length === 0) {
      console.log('No admin users found.');
    } else {
      console.log('Admin users:');
      admins.forEach(a => console.log(`- ${a.email}  (name: ${a.name || 'N/A'})  createdAt: ${a.createdAt}`));
    }
  } catch (err) {
    console.error('Error listing admins:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
