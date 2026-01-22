/**
 * Delete demo user from database
 * Run with: node scripts/deleteDemoUser.js
 */

const { MongoClient } = require('mongodb');

async function deleteDemoUser() {
  const uri = 'mongodb+srv://tugumeandree:jjR7hFANKm3GU6wV@cluster0.lxwxfjf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('capitalmasters');
    const usersCollection = db.collection('users');
    const portfoliosCollection = db.collection('portfolios');
    const transactionsCollection = db.collection('transactions');

    // Find demo user
    const demoUser = await usersCollection.findOne({ email: 'demo@capitalmasters.com' });

    if (!demoUser) {
      console.log('ℹ️  Demo user not found');
      await client.close();
      return;
    }

    console.log('Found demo user:', demoUser.email, 'ID:', demoUser._id.toString());
    const userId = demoUser._id.toString();

    // Delete all transactions
    const txnResult = await transactionsCollection.deleteMany({ userId: userId });
    console.log(`✅ Deleted ${txnResult.deletedCount} transactions`);

    // Delete all portfolios
    const portResult = await portfoliosCollection.deleteMany({ userId: userId });
    console.log(`✅ Deleted ${portResult.deletedCount} portfolios`);

    // Delete user
    const userResult = await usersCollection.deleteOne({ _id: demoUser._id });
    console.log(`✅ Demo user deleted: ${userResult.deletedCount} user(s)`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  }
}

deleteDemoUser();
