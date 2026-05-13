import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://aihot.virxact.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: '缺少 path 参数' }, { status: 400 });
  }

  const targetUrl = new URL(path, API_BASE);
  // 透传所有 query 参数（除 path 外）
  request.nextUrl.searchParams.forEach((v, k) => {
    if (k !== 'path') targetUrl.searchParams.set(k, v);
  });

  try {
    const res = await fetch(targetUrl.toString(), {
      headers: { 'User-Agent': UA },
    });
    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300',
      },
    });
  } catch {
    return NextResponse.json({ error: '代理请求失败' }, { status: 502 });
  }
}
