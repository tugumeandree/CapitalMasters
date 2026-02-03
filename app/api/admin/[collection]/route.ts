import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, collections } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/admin';
import { ObjectId } from 'mongodb';

function mapCollection(name: string) {
  // Allow only known collections
  const allowed: Record<string, string> = {
    users: collections.users,
    portfolios: collections.portfolios,
    transactions: collections.transactions,
    documents: collections.documents,
    newsletters: collections.newsletters,
    contacts: collections.contacts,
    admin_logs: collections.admin_logs,
  };
  return allowed[name];
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const parts = request.nextUrl.pathname.split('/');
  const collectionKey = parts[parts.length - 1];
  const collName = mapCollection(collectionKey);
  if (!collName) return NextResponse.json({ message: 'Invalid collection' }, { status: 400 });

  const db = await getDatabase();
  const coll = db.collection(collName as string);

  const id = request.nextUrl.searchParams.get('id');
  if (id) {
    try {
      const doc = await coll.findOne({ _id: new ObjectId(id) });
      return NextResponse.json(doc);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }
  }

  const items = await coll.find({}).limit(500).toArray();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const adminUserId = (auth.payload as any)?.userId;

  const parts = request.nextUrl.pathname.split('/');
  const collectionKey = parts[parts.length - 1];
  const collName = mapCollection(collectionKey);
  if (!collName) return NextResponse.json({ message: 'Invalid collection' }, { status: 400 });

  const db = await getDatabase();
  const coll = db.collection(collName as string);

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });

  // Prevent client from specifying _id
  if (body._id) delete body._id;

  // Convert userId string to ObjectId for portfolios, transactions, documents
  if ((collName === collections.portfolios || collName === collections.transactions || collName === collections.documents) && body.userId) {
    try {
      body.userId = new ObjectId(body.userId);
    } catch (error) {
      console.error('Invalid userId format:', body.userId);
      return NextResponse.json({ message: 'Invalid userId format' }, { status: 400 });
    }
  }

  // If creating a user, hash password if provided
  if (collName === collections.users && body.password) {
    body.password = await bcrypt.hash(body.password, 10);
  }

  // Convert date fields to Date objects
  if (body.date && typeof body.date === 'string') {
    body.date = new Date(body.date);
  }
  if (body.maturityDate && typeof body.maturityDate === 'string') {
    body.maturityDate = new Date(body.maturityDate);
  }
  if (body.investmentStartDate && typeof body.investmentStartDate === 'string') {
    body.investmentStartDate = new Date(body.investmentStartDate);
  }
  if (body.payoutStartDate && typeof body.payoutStartDate === 'string') {
    body.payoutStartDate = new Date(body.payoutStartDate);
  }
  if (body.payoutEndDate && typeof body.payoutEndDate === 'string') {
    body.payoutEndDate = new Date(body.payoutEndDate);
  }
  if (body.memberSince && typeof body.memberSince === 'string') {
    body.memberSince = new Date(body.memberSince);
  }

  const insertDoc = { ...body, createdAt: new Date(), updatedAt: new Date() };
  console.log('[Admin API] Creating document:', { collection: collName, insertDoc });
  const result = await coll.insertOne(insertDoc);

  // Audit log
  try {
    const db = await getDatabase();
    await db.collection(collections.admin_logs).insertOne({
      adminUserId,
      action: 'create',
      collection: collName,
      targetId: result.insertedId,
      before: null,
      after: insertDoc,
      timestamp: new Date(),
    });
  } catch (err) {
    console.warn('Failed to write admin log', err);
  }

  return NextResponse.json({ insertedId: result.insertedId.toString() }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const adminUserId = (auth.payload as any)?.userId;

  const parts = request.nextUrl.pathname.split('/');
  const collectionKey = parts[parts.length - 1];
  const collName = mapCollection(collectionKey);
  if (!collName) return NextResponse.json({ message: 'Invalid collection' }, { status: 400 });

  const db = await getDatabase();
  const coll = db.collection(collName as string);

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });

  delete body._id;

  // Convert userId string to ObjectId for portfolios, transactions, documents
  if ((collName === collections.portfolios || collName === collections.transactions || collName === collections.documents) && body.userId) {
    try {
      body.userId = new ObjectId(body.userId);
    } catch (error) {
      console.error('Invalid userId format:', body.userId);
      return NextResponse.json({ message: 'Invalid userId format' }, { status: 400 });
    }
  }

  // Convert date fields to Date objects
  if (body.date && typeof body.date === 'string') {
    body.date = new Date(body.date);
  }
  if (body.maturityDate && typeof body.maturityDate === 'string') {
    body.maturityDate = new Date(body.maturityDate);
  }
  if (body.investmentStartDate && typeof body.investmentStartDate === 'string') {
    body.investmentStartDate = new Date(body.investmentStartDate);
  }
  if (body.payoutStartDate && typeof body.payoutStartDate === 'string') {
    body.payoutStartDate = new Date(body.payoutStartDate);
  }
  if (body.payoutEndDate && typeof body.payoutEndDate === 'string') {
    body.payoutEndDate = new Date(body.payoutEndDate);
  }
  if (body.memberSince && typeof body.memberSince === 'string') {
    body.memberSince = new Date(body.memberSince);
  }

  try {
    // fetch before
    const before = await coll.findOne({ _id: new ObjectId(id) });
    console.log('[Admin API] Updating document:', { collection: collName, id, updates: body });
    await coll.updateOne({ _id: new ObjectId(id) }, { $set: { ...body, updatedAt: new Date() } });
    const after = await coll.findOne({ _id: new ObjectId(id) });

    // Audit log
    try {
      const db = await getDatabase();
      await db.collection(collections.admin_logs).insertOne({
        adminUserId,
        action: 'update',
        collection: collName,
        targetId: new ObjectId(id),
        before,
        after,
        timestamp: new Date(),
      });
    } catch (err) {
      console.warn('Failed to write admin log', err);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const adminUserId = (auth.payload as any)?.userId;

  const parts = request.nextUrl.pathname.split('/');
  const collectionKey = parts[parts.length - 1];
  const collName = mapCollection(collectionKey);
  if (!collName) return NextResponse.json({ message: 'Invalid collection' }, { status: 400 });

  const db = await getDatabase();
  const coll = db.collection(collName as string);

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });

  try {
    const before = await coll.findOne({ _id: new ObjectId(id) });
    await coll.deleteOne({ _id: new ObjectId(id) });

    try {
      const db = await getDatabase();
      await db.collection(collections.admin_logs).insertOne({
        adminUserId,
        action: 'delete',
        collection: collName,
        targetId: new ObjectId(id),
        before,
        after: null,
        timestamp: new Date(),
      });
    } catch (err) {
      console.warn('Failed to write admin log', err);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }
}
