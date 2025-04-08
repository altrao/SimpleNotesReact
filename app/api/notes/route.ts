import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface Note {
  id: string
  title: string
  content: string
  creationDate: string
  expirationDate: string
}

export const mapNoteFields = (note: any) => ({
  ...note,
  createdAt: note.creationDate,
  updatedAt: note.expirationDate
});

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await fetch('http://localhost:8080/api/notes', {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    })

    if (!res.ok) {
      return NextResponse.json(await res.json(), { status: res.status })
    }

    const notes = await res.json();
    return NextResponse.json(notes.map(mapNoteFields));

  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' }, 
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const note = await request.json()
    const res = await fetch('http://localhost:8080/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        ...note,
        creationDate: note.createdAt,
        expirationDate: note.updatedAt
      })
    })

    if (!res.ok) {
      return NextResponse.json(await res.json(), { status: res.status })
    }

    const result = await res.json();
    return NextResponse.json(mapNoteFields(result));

  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend' }, 
      { status: 502 }
    );
  }
}
