import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function requireAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return { ok: false, response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jwtVerify(token, secret);

    if ((payload as any).role !== 'admin') {
      return { ok: false, response: NextResponse.json({ message: 'Forbidden' }, { status: 403 }) };
    }

    return { ok: true, payload };
  } catch (error) {
    return { ok: false, response: NextResponse.json({ message: 'Invalid token' }, { status: 401 }) };
  }
}
