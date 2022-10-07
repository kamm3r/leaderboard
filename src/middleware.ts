import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.cookies.getWithOptions('result-token')) return;

  const random = nanoid();

  // Redirect (to apply cookie)
  const res = NextResponse.redirect(req.nextUrl);

  res.cookies.set('result-token', random, { sameSite: 'strict' });

  return res;
}
