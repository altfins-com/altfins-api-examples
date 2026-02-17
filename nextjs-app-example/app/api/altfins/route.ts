/**
 * API Route - Altfins API call from the server
 * This bypasses CORS issues and safely hides the API key
 */

import { NextRequest, NextResponse } from 'next/server';
import { altfinsService, ScreenerPayload } from '@/lib/services/altfins';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    console.log(`[API Route] GET /${endpoint || 'default'}`);

    // For simplicity, we currently support only getSignalKeys via this endpoint
    // If we wanted more, we would need to extend the service with a general method or switch
    if (!endpoint || endpoint === 'signals-feed/signal-keys') {
      const result = await altfinsService.getSignalKeys();

      if (!result.success) {
        return NextResponse.json(
          { error: result.error, details: result.details },
          { status: 500 } // Or another status code if we have it in details
        );
      }
      return NextResponse.json(result.data);
    }

    return NextResponse.json({ error: 'Unknown endpoint' }, { status: 400 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[API Route] Error:`, error);
    return NextResponse.json(
      { error: `Error calling API: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    console.log(`[API Route] POST /${endpoint || 'unknown'}`);

    if (endpoint === 'screener-data/search-requests') {
      const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
      const size = searchParams.get('size') ? Number(searchParams.get('size')) : undefined;
      const sort = searchParams.get('sort') || undefined;

      const body = await request.json();
      const result = await altfinsService.searchScreenerData(body as ScreenerPayload, page, size, sort);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error, details: result.details },
          { status: 500 }
        );
      }
      return NextResponse.json(result.data);
    }

    if (endpoint === 'signals-feed/search-requests') {
      const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined;
      const size = searchParams.get('size') ? Number(searchParams.get('size')) : undefined;
      const sort = searchParams.get('sort') || undefined;

      const body = await request.json();
      console.log(`[API Route] searchSignals payload:`, JSON.stringify(body));

      // Assume body is safely castable to SignalSearchPayload for now
      // Dynamically imported or defined in service, but we are in route.ts, 
      // so we use 'any' or just pass body. Ideally we import SignalSearchPayload.
      const result = await altfinsService.searchSignals(body as any, page, size, sort);
      console.log(`[API Route] searchSignals result success:`, result.success);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error, details: result.details },
          { status: 500 }
        );
      }
      return NextResponse.json(result.data);
    }

    return NextResponse.json({ error: 'Unknown endpoint for POST' }, { status: 400 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[API Route] Error:`, error);
    return NextResponse.json(
      { error: `Error calling API: ${errorMessage}` },
      { status: 500 }
    );
  }
}
