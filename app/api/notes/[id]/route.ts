import { NextRequest, NextResponse } from "next/server";
import { mapNoteFields } from "../route";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params

        const res = await fetch(`http://localhost:8080/api/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': authHeader
            }
        })

        if (!res.ok) {
            return NextResponse.json(await res.json(), { status: res.status })
        }

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Connection error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to backend' },
            { status: 502 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const { ...updates } = await request.json()

        const res = await fetch(`http://localhost:8080/api/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify({
                ...updates,
                creationDate: updates.createdAt,
                expirationDate: updates.updatedAt
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