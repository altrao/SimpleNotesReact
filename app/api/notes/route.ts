import { NextRequest, NextResponse } from 'next/server';
import { handleRequest } from './utils';

export async function GET(request: NextRequest) {
  try {
    return await handleRequest(request, 'GET', '/api/notes')
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const note = await request.json()

    return handleRequest(request, 'POST', '/api/notes', {
      ...note,
      creationDate: note.createdAt,
      expirationDate: note.updatedAt,
      ttl: note.ttl
    })
  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 502 }
    );
  }
}
