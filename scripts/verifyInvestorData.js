/**
 * Verify investor data matches the CSV
 * Run with: node scripts/verifyInvestorData.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function verifyData() {
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
    const transactionsCollection = db.collection('transactions');

    // Expected investors from CSV
    const expectedInvestors = [
      { name: 'Osbert Tukamuhabwa', email: 'tkosbert93@gmail.com', contact: '0740842914', principal: 7300000 },
      { name: 'Shamis Kyozeire', email: 'shamiskyozeire5@gmail.com', contact: '0700343646', principal: 3000000 },
      { name: 'Shiba Tushemerirwe Rweishaka', email: 'shebarweishaka@gmail.com', contact: '0778280731', principal: 1400000 },
      { name: 'Recheal T Ainembabazi', email: 'ainerachel50@gmail.com', contact: '0758709980', principal: 10200000 },
      { name: 'Andrew Tugume', email: 'andrewtugume2@gmail.com', contact: '0755017384', principal: 4000000 },
      { name: 'Okwir Andrew Brian Blaze', email: 'blaizepro23@gmail.com', contact: '0703901128', principal: 4000000 },
      { name: 'Napoleon Mastiko', email: 'matsikonapoleon2@gmail.com', contact: '0777973507', principal: 4000000 },
      { name: 'Sarah Mbabazi Gunn', email: 'sarahnyijukire@gmail.com', contact: '0773265892', principal: 1000000 },
      { name: 'Ronald Opakrwoth', email: 'ronaldopa323@gmail.com', contact: '0778219524', principal: 10000000 }
    ];

    console.log('📊 INVESTOR DATA VERIFICATION\n');
    console.log('=' .repeat(80));

    let totalSystemPrincipal = 0;
    let totalExpectedPayout = 0;
    let matches = 0;
    let mismatches = 0;

    for (const expected of expectedInvestors) {
      const user = await usersCollection.findOne({ email: expected.email });
      
      if (!user) {
        console.log(`❌ ${expected.name} (${expected.email}) - NOT FOUND IN SYSTEM`);
        mismatches++;
        continue;
      }

      // Get user transactions
      const transactions = await transactionsCollection.find({ userId: user._id.toString() }).toArray();
      
      const contributions = transactions.filter(t => ['deposit', 'investment', 'loan_given'].includes(t.type));
      const payouts = transactions.filter(t => ['withdrawal', 'dividend', 'interest', 'loan_repayment'].includes(t.type));
      
      const totalContribs = contributions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalPayouts = payouts.reduce((sum, t) => sum + (t.amount || 0), 0);
      const netInvested = totalContribs - totalPayouts;
      const expectedPayout = netInvested * 0.32;

      totalSystemPrincipal += netInvested;
      totalExpectedPayout += expectedPayout;

      const principalMatch = netInvested === expected.principal;
      const contactMatch = user.contact === expected.contact || user.contact === expected.contact.replace(/\s/g, '');
      
      if (principalMatch && contactMatch) {
        console.log(`✅ ${expected.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Contact: ${user.contact} ${contactMatch ? '✓' : '✗ (Expected: ' + expected.contact + ')'}`);
        console.log(`   Principal: UGX ${netInvested.toLocaleString()} ${principalMatch ? '✓' : '✗ (Expected: UGX ' + expected.principal.toLocaleString() + ')'}`);
        console.log(`   Expected Payout (32%): UGX ${expectedPayout.toLocaleString()}`);
        console.log(`   CSV Expected Payout: UGX ${(expected.principal * 0.32).toLocaleString()}`);
        matches++;
      } else {
        console.log(`⚠️  ${expected.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Contact: ${user.contact} ${contactMatch ? '✓' : '✗ Expected: ' + expected.contact}`);
        console.log(`   Principal: UGX ${netInvested.toLocaleString()} ${principalMatch ? '✓' : '✗ Expected: UGX ' + expected.principal.toLocaleString()}`);
        console.log(`   Difference: UGX ${(netInvested - expected.principal).toLocaleString()}`);
        console.log(`   Expected Payout (32%): UGX ${expectedPayout.toLocaleString()}`);
        mismatches++;
      }
      console.log('');
    }

    console.log('=' .repeat(80));
    console.log('\n📈 SUMMARY\n');
    console.log(`Total Investors: ${expectedInvestors.length}`);
    console.log(`Matches: ${matches} ✅`);
    console.log(`Mismatches: ${mismatches} ${mismatches > 0 ? '⚠️' : ''}`);
    console.log(`\nTotal System Principal: UGX ${totalSystemPrincipal.toLocaleString()}`);
    console.log(`Total CSV Principal: UGX 44,900,000`);
    console.log(`Difference: UGX ${(totalSystemPrincipal - 44900000).toLocaleString()}`);
    console.log(`\nTotal Expected Payout (32%): UGX ${totalExpectedPayout.toLocaleString()}`);
    console.log(`Total CSV Expected Payout: UGX 14,368,000`);
    console.log(`Difference: UGX ${(totalExpectedPayout - 14368000).toLocaleString()}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

verifyData();
