/**
 * Clean up portfolios collection - remove duplicates and orphaned records
 * Run with: node scripts/cleanupPortfolios.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function cleanupPortfolios() {
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
    
    console.log('🧹 CLEANING UP PORTFOLIOS COLLECTION\n');
    console.log('=' .repeat(80));
    console.log(`\nInitial state:`);
    console.log(`  Total Portfolios: ${portfolios.length}`);
    console.log(`  Total Users: ${users.length}\n`);

    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    let orphanedCount = 0;
    let duplicateCount = 0;
    const toDelete = [];

    // Step 1: Find and mark orphaned portfolios (user doesn't exist)
    console.log('Step 1: Finding orphaned portfolios...\n');
    for (const p of portfolios) {
      if (!userMap[p.userId]) {
        console.log(`  ❌ Orphaned: Portfolio ${p._id} (User ${p.userId} not found)`);
        toDelete.push(p._id);
        orphanedCount++;
      }
    }

    // Step 2: Find and mark duplicate portfolios (keep newest for each user)
    console.log('\nStep 2: Finding duplicate portfolios...\n');
    const userPortfolios = {};
    
    portfolios.forEach(p => {
      if (!toDelete.includes(p._id)) { // Skip already marked orphaned ones
        if (!userPortfolios[p.userId]) {
          userPortfolios[p.userId] = [];
        }
        userPortfolios[p.userId].push(p);
      }
    });

    // For each user with multiple portfolios, keep the newest one
    for (const [userId, userPorts] of Object.entries(userPortfolios)) {
      if (userPorts.length > 1) {
        const user = userMap[userId];
        console.log(`  ⚠️  User ${user ? user.email : userId} has ${userPorts.length} portfolios`);
        
        // Sort by _id (newer IDs are larger in MongoDB ObjectId)
        userPorts.sort((a, b) => a._id.toString().localeCompare(b._id.toString()));
        
        // Keep the newest (last one), delete the rest
        const toKeep = userPorts[userPorts.length - 1];
        const toRemove = userPorts.slice(0, -1);
        
        console.log(`     ✅ Keeping: ${toKeep._id} (newest)`);
        toRemove.forEach(p => {
          console.log(`     ❌ Removing: ${p._id} (duplicate)`);
          toDelete.push(p._id);
          duplicateCount++;
        });
      }
    }

    // Step 3: Delete all marked portfolios
    console.log('\n' + '=' .repeat(80));
    console.log('\nStep 3: Deleting marked portfolios...\n');
    
    if (toDelete.length > 0) {
      const result = await portfoliosCollection.deleteMany({
        _id: { $in: toDelete }
      });
      console.log(`✅ Deleted ${result.deletedCount} portfolios`);
    } else {
      console.log('✅ No portfolios to delete');
    }

    // Step 4: Verify final state
    const finalPortfolios = await portfoliosCollection.find({}).toArray();
    
    console.log('\n' + '=' .repeat(80));
    console.log('\n📊 CLEANUP SUMMARY\n');
    console.log(`Initial portfolios: ${portfolios.length}`);
    console.log(`Orphaned portfolios removed: ${orphanedCount}`);
    console.log(`Duplicate portfolios removed: ${duplicateCount}`);
    console.log(`Final portfolios: ${finalPortfolios.length}`);
    console.log('\n' + '=' .repeat(80));
    
    console.log('\n📋 REMAINING PORTFOLIOS:\n');
    finalPortfolios.forEach((p, index) => {
      const user = userMap[p.userId];
      console.log(`${index + 1}. ${user ? user.email : 'Unknown'}`);
      console.log(`   Portfolio ID: ${p._id}`);
      console.log(`   Total Value: UGX ${(p.totalValue || 0).toLocaleString()}`);
      console.log(`   Holdings: ${p.holdings?.length || 0}\n`);
    });

    console.log('=' .repeat(80));
    console.log('\n✅ CLEANUP COMPLETE!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

cleanupPortfolios();
