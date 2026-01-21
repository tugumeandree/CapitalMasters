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
    console.log('Connected to MongoDB');
    
    const db = client.db('capitalmasters');
    const users = db.collection('users');
    const transactions = db.collection('transactions');
    const portfolios = db.collection('portfolios');
    
    // Step 1: Delete all transactions
    console.log('\n--- Deleting all transactions ---');
    const deleteResult = await transactions.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} transactions`);
    
    // Step 2: Reset all portfolios to 0
    console.log('\n--- Resetting all portfolios to 0 ---');
    const allUsers = await users.find({}).toArray();
    
    for (const user of allUsers) {
      const result = await portfolios.updateOne(
        { userId: user._id.toString() },
        {
          $set: {
            totalValue: 0,
            totalGain: 0,
            totalGainPercent: 0,
            holdings: [],
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
      
      if (result.modifiedCount > 0 || result.upsertedCount > 0) {
        console.log(`Reset portfolio for ${user.name || user.email}`);
      }
    }
    
    console.log('\n=== SUMMARY ===');
    console.log(`✓ All transactions deleted`);
    console.log(`✓ All portfolios reset to 0`);
    console.log(`✓ Total users: ${allUsers.length}`);
    console.log('\nYou can now add fresh transactions using the admin portal.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
