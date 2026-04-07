import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getDatabase, collections } from '@/lib/mongodb';
import { Portfolio, Transaction, Document } from '@/lib/models';
import { ObjectId } from 'mongodb';

async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  try {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-min-32-characters'
    );
    
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Dashboard API] Fetching data for user:', userId);

    const db = await getDatabase();

    // Resolve user record first so we can support legacy records keyed by email or string IDs.
    const usersCollection = db.collection(collections.users);
    const userQuery: Record<string, unknown>[] = [{ _id: userId }];
    if (ObjectId.isValid(userId)) {
      userQuery.push({ _id: new ObjectId(userId) });
    }

    const currentUser = await usersCollection.findOne({ $or: userQuery });
    const normalizedEmail = typeof currentUser?.email === 'string'
      ? currentUser.email.toLowerCase()
      : null;

    // Support both ObjectId, string-stored userId, and legacy email-keyed records.
    const userMatchConditions: Array<Record<string, unknown>> = [{ userId }];
    if (ObjectId.isValid(userId)) {
      userMatchConditions.push({ userId: new ObjectId(userId) });
    }
    if (normalizedEmail) {
      userMatchConditions.push({ userId: normalizedEmail });
      userMatchConditions.push({ userEmail: normalizedEmail });
      userMatchConditions.push({ email: normalizedEmail });
    }
    const userMatch = { $or: userMatchConditions };
    
    // Fetch portfolio
    const portfoliosCollection = db.collection<Portfolio>(collections.portfolios);
    const portfolio = await portfoliosCollection.findOne(userMatch);

    console.log('[Dashboard API] Portfolio found:', !!portfolio, portfolio ? {
      totalValue: portfolio.totalValue,
      totalGain: portfolio.totalGain,
      holdingsCount: portfolio.holdings?.length
    } : null);

    // Fetch ALL transactions (no limit for accurate calculations)
    const transactionsCollection = db.collection<Transaction>(collections.transactions);
    const transactions = await transactionsCollection
      .find(userMatch)
      .sort({ date: -1 })
      .toArray();

    console.log('[Dashboard API] Transactions found:', transactions.length);

    // Fetch ALL documents (no limit)
    const documentsCollection = db.collection<Document>(collections.documents);
    const documents = await documentsCollection
      .find(userMatch)
      .sort({ uploadedAt: -1 })
      .toArray();

    console.log('[Dashboard API] Documents found:', documents.length);

    const portfolioFromDb = portfolio ? {
      totalValue: portfolio.totalValue,
      totalGain: portfolio.totalGain,
      totalGainPercent: portfolio.totalGainPercent,
      holdings: portfolio.holdings || [],
    } : null;

    const derivedPortfolio = (() => {
      if (portfolioFromDb) return portfolioFromDb;

      const contributionTypes = new Set(['deposit', 'investment', 'loan_given']);
      const payoutTypes = new Set(['withdrawal', 'fee']);
      const gainTypes = new Set(['interest', 'dividend', 'loan_repayment']);

      const validTransactions = transactions.filter(t => t.status !== 'failed');

      const totalContributions = validTransactions
        .filter(t => contributionTypes.has(t.type))
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const totalPayouts = validTransactions
        .filter(t => payoutTypes.has(t.type))
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const totalGains = validTransactions
        .filter(t => gainTypes.has(t.type))
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const netInvested = Math.max(totalContributions - totalPayouts, 0);

      const bucketMap = new Map<string, number>();
      validTransactions
        .filter(t => contributionTypes.has(t.type))
        .forEach((t) => {
          const key = t.investmentType || 'other';
          bucketMap.set(key, (bucketMap.get(key) || 0) + (t.amount || 0));
        });

      const totalBucketValue = Array.from(bucketMap.values()).reduce((sum, value) => sum + value, 0);

      const holdings = Array.from(bucketMap.entries()).map(([bucket, value]) => {
        const allocation = totalBucketValue > 0 ? (value / totalBucketValue) * 100 : 0;
        return {
          name: bucket.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          type: bucket,
          value,
          allocation,
          change: 0,
        };
      });

      if (holdings.length === 0 && netInvested > 0) {
        holdings.push({
          name: 'Managed Portfolio',
          type: 'other',
          value: netInvested,
          allocation: 100,
          change: 0,
        });
      }

      const totalGainPercent = totalContributions > 0 ? (totalGains / totalContributions) * 100 : 0;

      return {
        totalValue: netInvested,
        totalGain: totalGains,
        totalGainPercent,
        holdings,
      };
    })();

    const responseData = {
      portfolio: derivedPortfolio,
      transactions: transactions.map(t => {
        try {
          let dateStr: string;
          if (!t.date) {
            dateStr = new Date().toISOString();
          } else if (t.date instanceof Date) {
            dateStr = t.date.toISOString();
          } else if (typeof t.date === 'string') {
            dateStr = new Date(t.date).toISOString();
          } else {
            dateStr = new Date().toISOString();
          }

          let maturityDateStr: string | undefined;
          if (t.maturityDate) {
            if (t.maturityDate instanceof Date) {
              maturityDateStr = t.maturityDate.toISOString();
            } else if (typeof t.maturityDate === 'string') {
              maturityDateStr = new Date(t.maturityDate).toISOString();
            }
          }

          return {
            id: t._id?.toString(),
            type: t.type,
            amount: t.amount,
            description: t.description,
            status: t.status,
            date: dateStr,
            investmentType: t.investmentType,
            commodityCompany: t.commodityCompany,
            returnRate: t.returnRate,
            maturityDate: maturityDateStr,
          };
        } catch (err) {
          console.error('Error processing transaction:', t, err);
          return {
            id: t._id?.toString(),
            type: t.type,
            amount: t.amount,
            description: t.description,
            status: t.status,
            date: new Date().toISOString(),
            investmentType: t.investmentType,
            commodityCompany: t.commodityCompany,
            returnRate: t.returnRate,
            maturityDate: undefined,
          };
        }
      }),
      documents: documents.map(d => {
        try {
          let dateStr: string;
          if (!d.uploadedAt) {
            dateStr = new Date().toISOString();
          } else if (d.uploadedAt instanceof Date) {
            dateStr = d.uploadedAt.toISOString();
          } else if (typeof d.uploadedAt === 'string') {
            dateStr = new Date(d.uploadedAt).toISOString();
          } else {
            dateStr = new Date().toISOString();
          }

          return {
            id: d._id?.toString(),
            name: d.name,
            type: d.type,
            url: d.url,
            size: d.size,
            date: dateStr,
          };
        } catch (err) {
          console.error('Error processing document:', d, err);
          return {
            id: d._id?.toString(),
            name: d.name,
            type: d.type,
            url: d.url,
            size: d.size,
            date: new Date().toISOString(),
          };
        }
      }),
    };

    console.log('[Dashboard API] Sending response:', {
      hasPortfolio: !!responseData.portfolio,
      usingDerivedPortfolio: !portfolioFromDb,
      transactionsCount: responseData.transactions.length,
      documentsCount: responseData.documents.length,
      matchedByEmailFallback: !!normalizedEmail,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
