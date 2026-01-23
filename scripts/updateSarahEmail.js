require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = 'capitalmasters';

async function updateSarahEmail() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const transactionsCollection = db.collection('transactions');
    const portfoliosCollection = db.collection('portfolios');

    // Find the user with old email
    const oldEmail = 'sarahnyijukire@gmail.com';
    const newEmail = 'saraanyijukire@gmail.com';

    const user = await usersCollection.findOne({ email: oldEmail });

    if (!user) {
      console.log(`❌ User with email ${oldEmail} not found`);
      return;
    }

    console.log(`📧 Found user: ${user.name || oldEmail}`);
    console.log(`   User ID: ${user._id}`);
    console.log(`   Current email: ${user.email}`);
    console.log(`   Role: ${user.role || 'user'}`);

    // Update email in users collection
    const userUpdate = await usersCollection.updateOne(
      { _id: user._id },
      { $set: { email: newEmail } }
    );

    console.log(`\n✅ Updated user email: ${userUpdate.modifiedCount} document(s)`);

    // Check and display final state
    const updatedUser = await usersCollection.findOne({ _id: user._id });
    console.log(`\n📋 Updated user details:`);
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Password: [UNCHANGED]`);

    console.log(`\n✅ Email update complete!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

updateSarahEmail();
