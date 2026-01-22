/**
 * Check portfolios collection
 * Run with: node scripts/checkPortfolios.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkPortfolios() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    return;
  }
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('capitalmasters');
    const usersCollection = db.collection('users');
    const portfoliosCollection = db.collection('portfolios');

    const portfolios = await portfoliosCollection.find({}).toArray();
    const users = await usersCollection.find({}).toArray();
    
    console.log('📊 PORTFOLIOS COLLECTION ANALYSIS\n');
    console.log('=' .repeat(100));
    console.log(`\nTotal Portfolios: ${portfolios.length}`);
    console.log(`Total Users: ${users.length}\n`);
    console.log('=' .repeat(100));

    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    portfolios.forEach((p, index) => {
      const user = userMap[p.userId];
      console.log(`\n${index + 1}. Portfolio ID: ${p._id}`);
      console.log(`   User ID: ${p.userId}`);
      console.log(`   User: ${user ? `${user.name} (${user.email})` : '❌ USER NOT FOUND'}`);
      console.log(`   Total Value: UGX ${(p.totalValue || 0).toLocaleString()}`);
      console.log(`   Total Gain: UGX ${(p.totalGain || 0).toLocaleString()}`);
      console.log(`   Total Gain %: ${(p.totalGainPercent || 0).toFixed(2)}%`);
      console.log(`   Holdings: ${p.holdings?.length || 0} items`);
      if (p.holdings && p.holdings.length > 0) {
        p.holdings.forEach((h, i) => {
          console.log(`      ${i + 1}. ${h.name || 'Unnamed'} - ${h.type || 'N/A'} - UGX ${(h.value || 0).toLocaleString()}`);
        });
      }
    });

    console.log('\n' + '=' .repeat(100));
    console.log('\n📈 SUMMARY\n');

    // Check for duplicates
    const userPortfolioCounts = {};
    portfolios.forEach(p => {
      userPortfolioCounts[p.userId] = (userPortfolioCounts[p.userId] || 0) + 1;
    });

    const usersWithMultiplePortfolios = Object.entries(userPortfolioCounts).filter(([_, count]) => count > 1);
    
    if (usersWithMultiplePortfolios.length > 0) {
      console.log('⚠️  USERS WITH MULTIPLE PORTFOLIOS:');
      usersWithMultiplePortfolios.forEach(([userId, count]) => {
        const user = userMap[userId];
        console.log(`   ${user ? user.email : userId}: ${count} portfolios`);
      });
    } else {
      console.log('✅ No duplicate portfolios found');
    }

    // Check for orphaned portfolios
    const orphanedPortfolios = portfolios.filter(p => !userMap[p.userId]);
    if (orphanedPortfolios.length > 0) {
      console.log(`\n⚠️  ORPHANED PORTFOLIOS (user deleted): ${orphanedPortfolios.length}`);
      orphanedPortfolios.forEach(p => {
        console.log(`   Portfolio ID: ${p._id} - User ID: ${p.userId}`);
      });
    }

    // Check for users without portfolios
    const usersWithPortfolios = new Set(portfolios.map(p => p.userId));
    const usersWithoutPortfolios = users.filter(u => !usersWithPortfolios.has(u._id.toString()));
    if (usersWithoutPortfolios.length > 0) {
      console.log(`\n📝 USERS WITHOUT PORTFOLIOS: ${usersWithoutPortfolios.length}`);
      usersWithoutPortfolios.forEach(u => {
        console.log(`   ${u.email} (${u.role})`);
      });
    }

    console.log('\n' + '=' .repeat(100));
    console.log('\n💡 EXPLANATION:\n');
    console.log('The "Portfolios" tab shows portfolio records from the database.');
    console.log('Each portfolio contains:');
    console.log('  - Total Value: The calculated portfolio worth');
    console.log('  - Holdings: Individual investments/assets');
    console.log('  - Gains: Profit/loss information');
    console.log('\nNote: This is DIFFERENT from the Users tab which shows:');
    console.log('  - Portfolio Principle: Net invested amount from transactions');
    console.log('  - Expected Payout: Calculated 32% returns');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

checkPortfolios();
