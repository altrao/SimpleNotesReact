import { NextRequest, NextResponse } from "next/server";
import { mapNoteFields } from "../../route";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  
    const { id } = await params

    if (!id) {
        return NextResponse.json({ error: 'Missing note ID' }, { status: 400 })
    }

    try {
        const res = await fetch(`http://localhost:8080/api/notes/${id}/versions`, {
            headers: {
                'Authorization': authHeader
            }
        })

        if (!res.ok) {
            return NextResponse.json(await res.json(), { status: res.status })
        }

        const versions = await res.json();
        return NextResponse.json(versions.map(mapNoteFields));
    } catch (error) {
        console.error('Connection error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to backend' },
            { status: 502 }
        );
    }
}