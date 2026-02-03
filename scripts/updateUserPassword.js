require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in environment or .env.local');
  process.exit(1);
}

const USER_EMAIL = process.argv[2];
const NEW_PASSWORD = process.argv[3];

if (!USER_EMAIL || !NEW_PASSWORD) {
  console.error('Usage: node updateUserPassword.js <email> <new_password>');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('capitalmasters');
    const users = db.collection('users');

    const user = await users.findOne({ email: USER_EMAIL.toLowerCase() });
    if (!user) {
      console.error('User not found for email:', USER_EMAIL.toLowerCase());
      process.exit(2);
    }

    console.log('User found:');
    console.log('  _id:', user._id);
    console.log('  email:', user.email);
    console.log('  role:', user.role);
    console.log('  name:', user.name);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    // Update the user's password
    const result = await users.updateOne(
      { email: USER_EMAIL.toLowerCase() },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 1) {
      console.log('\n✓ Password updated successfully!');
      
      // Verify the new password works
      const matches = await bcrypt.compare(NEW_PASSWORD, hashedPassword);
      console.log('✓ Password verification:', matches ? 'PASSED' : 'FAILED');
    } else {
      console.error('Failed to update password');
      process.exit(3);
    }

  } catch (err) {
    console.error('Error updating password:', err.message || err);
    process.exit(1);
  } finally {
    try { await client.close(); } catch (e) {}
  }
}

main();
