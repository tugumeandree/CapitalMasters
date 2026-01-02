/**
 * Reset demo user data to 0
 * Run with: node scripts/resetDemoUser.js
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://capitalmasters_db_user:HZzoSGVgfGaNeR3y@cluster0.l6ftqyh.mongodb.net/?appName=Cluster0';

async function resetDemoUser() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('capitalmasters');

    // Find demo user
    const usersCollection = db.collection('users');
    const demoUser = await usersCollection.findOne({ email: 'demo@capitalmasters.com' });
    
    if (!demoUser) {
      console.log('❌ Demo user not found');
      return;
    }

    console.log('Found demo user:', demoUser.email);

    // Reset portfolio to 0
    const portfoliosCollection = db.collection('portfolios');
    const portfolioResult = await portfoliosCollection.updateOne(
      { userId: demoUser._id },
      {
        $set: {
          totalValue: 0,
          totalGain: 0,
          totalGainPercent: 0,
          holdings: [],
          updatedAt: new Date(),
        }
      },
      { upsert: true }
    );
    console.log('✅ Portfolio reset to 0:', portfolioResult.modifiedCount > 0 ? 'updated' : 'created');

    // Delete all transactions
    const transactionsCollection = db.collection('transactions');
    const transactionResult = await transactionsCollection.deleteMany({ userId: demoUser._id });
    console.log(`✅ Deleted ${transactionResult.deletedCount} transactions`);

    // Delete all documents
    const documentsCollection = db.collection('documents');
    const documentResult = await documentsCollection.deleteMany({ userId: demoUser._id });
    console.log(`✅ Deleted ${documentResult.deletedCount} documents`);

    console.log('\n🎉 Demo user data reset successfully!');
    console.log('Demo user now has:');
    console.log('  - Portfolio: 0 UGX');
    console.log('  - Transactions: 0');
    console.log('  - Documents: 0');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

resetDemoUser();
