/**
 * List all users and their data
 * Run with: node scripts/listUsers.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://capitalmasters_db_user:HZzoSGVgfGaNeR3y@cluster0.l6ftqyh.mongodb.net/?appName=Cluster0';

async function listUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db('capitalmasters');

    // Get all users
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();

    console.log(`Found ${users.length} users:\n`);

    for (const user of users) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`👤 ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role || 'user'}`);
      console.log(`   Account Type: ${user.accountType}`);
      console.log(`   Risk Tolerance: ${user.riskTolerance}`);
      console.log(`   Member Since: ${user.memberSince ? new Date(user.memberSince).toLocaleDateString() : 'N/A'}`);

      // Get portfolio
      const portfoliosCollection = db.collection('portfolios');
      const portfolio = await portfoliosCollection.findOne({ userId: user._id });
      
      if (portfolio) {
        console.log(`\n   📊 Portfolio:`);
        console.log(`      Total Value: UGX ${portfolio.totalValue.toLocaleString()}`);
        console.log(`      Total Gain: UGX ${portfolio.totalGain.toLocaleString()}`);
        console.log(`      Gain %: ${portfolio.totalGainPercent}%`);
        console.log(`      Holdings: ${portfolio.holdings?.length || 0}`);
      } else {
        console.log(`\n   📊 Portfolio: None`);
      }

      // Get transactions
      const transactionsCollection = db.collection('transactions');
      const transactions = await transactionsCollection.find({ userId: user._id }).toArray();
      console.log(`\n   💰 Transactions: ${transactions.length}`);
      
      if (transactions.length > 0) {
        // Group by type
        const byType = {};
        transactions.forEach(t => {
          byType[t.type] = (byType[t.type] || 0) + 1;
        });
        Object.entries(byType).forEach(([type, count]) => {
          console.log(`      ${type}: ${count}`);
        });
      }

      // Get documents
      const documentsCollection = db.collection('documents');
      const documents = await documentsCollection.find({ userId: user._id }).toArray();
      console.log(`\n   📄 Documents: ${documents.length}`);

      console.log('');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

listUsers();
