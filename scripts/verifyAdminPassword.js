require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in environment or .env.local');
  process.exit(1);
}

const ADMIN_EMAIL = process.argv[2] || 'qraftcapital@gmail.com';
const PLAINTEXT = process.argv[3] || 'capitalmasters';

async function main() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('capitalmasters');
    const users = db.collection('users');

    const user = await users.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (!user) {
      console.error('Admin user not found for email:', ADMIN_EMAIL.toLowerCase());
      process.exit(2);
    }

    console.log('Admin user found:');
    console.log('  _id:', user._id);
    console.log('  email:', user.email);
    console.log('  role:', user.role);
    console.log('  createdAt:', user.createdAt);
    console.log('  updatedAt:', user.updatedAt);

    if (!user.password || typeof user.password !== 'string') {
      console.error('No password hash stored for this user.');
      process.exit(3);
    }

    console.log('Stored password hash:', user.password);

    const matches = await bcrypt.compare(PLAINTEXT, user.password);
    console.log('Password match for provided plaintext:', matches);

    process.exit(matches ? 0 : 4);
  } catch (err) {
    console.error('Error verifying admin password:', err.message || err);
    process.exit(1);
  } finally {
    try { await client.close(); } catch (e) {}
  }
}

main();
