/**
 * Seed script to populate MongoDB with initial data
 * Run with: node scripts/seed.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb+srv://capitalmasters_db_user:HZzoSGVgfGaNeR3y@cluster0.l6ftqyh.mongodb.net/?appName=Cluster0';

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('capitalmasters');

    // Create demo user
    const usersCollection = db.collection('users');
    
    // Check if demo user exists
    const existingUser = await usersCollection.findOne({ email: 'demo@capitalmasters.com' });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      
      const demoUser = {
        email: 'demo@capitalmasters.com',
        password: hashedPassword,
        name: 'Demo User',
        accountType: 'individual',
        riskTolerance: 'moderate',
        memberSince: new Date('2020-01-15'),
        phone: '+1 (555) 123-4567',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCollection.insertOne(demoUser);
      console.log('✅ Demo user created: demo@capitalmasters.com / demo123');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    // Create demo portfolio (empty/zero for production use)
    const portfoliosCollection = db.collection('portfolios');
    const user = await usersCollection.findOne({ email: 'demo@capitalmasters.com' });
    
    const existingPortfolio = await portfoliosCollection.findOne({ userId: user._id });
    
    if (!existingPortfolio) {
      const demoPortfolio = {
        userId: user._id,
        totalValue: 0,
        totalGain: 0,
        totalGainPercent: 0,
        holdings: [],
        updatedAt: new Date(),
      };

      await portfoliosCollection.insertOne(demoPortfolio);
      console.log('✅ Demo portfolio created (0 values for production)');
    } else {
      console.log('ℹ️  Demo portfolio already exists');
    }

    // No transactions for demo user (production mode)
    console.log('ℹ️  Demo user has no initial transactions (production mode)');

    // No documents for demo user (production mode)
    console.log('ℹ️  Demo user has no initial documents (production mode)');
    } else {
      console.log('ℹ️  Demo documents already exist');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nYou can now login with:');
    console.log('  Email: demo@capitalmasters.com');
    console.log('  Password: demo123');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
