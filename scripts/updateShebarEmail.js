const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function updateShebarEmail() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('capitalmasters');
    const usersCollection = db.collection('users');

    const oldEmail = 'shebarweishaka@gmail.com';
    const newEmail = 'sheebarweishakaa@gmail.com';

    // Find the user first
    const user = await usersCollection.findOne({ email: oldEmail });
    
    if (!user) {
      console.log(`User with email ${oldEmail} not found`);
      return;
    }

    console.log('Found user:', user.name || user.email);

    // Update the email
    const result = await usersCollection.updateOne(
      { email: oldEmail },
      { $set: { email: newEmail } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✓ Successfully updated email from ${oldEmail} to ${newEmail}`);
      console.log('Password remains unchanged');
    } else {
      console.log('No changes made');
    }

    // Verify the update
    const updatedUser = await usersCollection.findOne({ email: newEmail });
    if (updatedUser) {
      console.log('✓ Verified: User now has email:', updatedUser.email);
    }

  } catch (error) {
    console.error('Error updating email:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

updateShebarEmail();
