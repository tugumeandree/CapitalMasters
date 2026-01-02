/**
 * Check specific user data
 * Run with: node scripts/checkUser.js tkosbert93@gmail.com
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb+srv://capitalmasters_db_user:HZzoSGVgfGaNeR3y@cluster0.l6ftqyh.mongodb.net/?appName=Cluster0';

async function checkUser(email) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db('capitalmasters');

    // Get user
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }

    console.log('✅ User found:');
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   User ID:', user._id.toString());
    console.log('');

    // Get portfolio
    const portfoliosCollection = db.collection('portfolios');
    const portfolio = await portfoliosCollection.findOne({ userId: user._id });
    
    console.log('📊 Portfolio:');
    if (portfolio) {
      console.log('   Portfolio ID:', portfolio._id.toString());
      console.log('   User ID in Portfolio:', portfolio.userId.toString());
      console.log('   Total Value:', portfolio.totalValue);
      console.log('   Total Gain:', portfolio.totalGain);
      console.log('   Holdings:', portfolio.holdings?.length || 0);
    } else {
      console.log('   ❌ No portfolio found');
    }
    console.log('');

    // Get transactions
    const transactionsCollection = db.collection('transactions');
    const transactions = await transactionsCollection.find({ userId: user._id }).toArray();
    
    console.log('💰 Transactions:', transactions.length);
    transactions.forEach(t => {
      console.log(`   - ${t.date.toISOString().split('T')[0]} | ${t.type} | UGX ${t.amount.toLocaleString()} | ${t.description}`);
      if (t.investmentType) console.log(`     Investment Type: ${t.investmentType}`);
      if (t.commodityCompany) console.log(`     Commodity: ${t.commodityCompany}`);
    });
    console.log('');

    // Calculate totals
    const contributions = transactions.filter(t => ['deposit', 'investment', 'loan_given'].includes(t.type));
    const payouts = transactions.filter(t => ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type));
    const totalContributions = contributions.reduce((sum, t) => sum + t.amount, 0);
    const totalPayouts = payouts.reduce((sum, t) => sum + t.amount, 0);

    console.log('📈 Calculated Totals:');
    console.log('   Total Contributions:', totalContributions.toLocaleString());
    console.log('   Total Payouts:', totalPayouts.toLocaleString());
    console.log('   Net Invested:', (totalContributions - totalPayouts).toLocaleString());
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

const email = process.argv[2] || 'tkosbert93@gmail.com';
checkUser(email);
