import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "../utils";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json({ error: 'Missing note ID' }, { status: 400 })
        }

        return await handleRequest(request, 'DELETE', `/api/notes/${id}`)
    } catch (error) {
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
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json({ error: 'Missing note ID' }, { status: 400 })
        }

        const { ...updates } = await request.json()

        return await handleRequest(request, 'PUT', `/api/note/${id}`, {
            ...updates,
            creationDate: updates.createdAt,
            expirationDate: updates.updatedAt
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to connect to backend' },
            { status: 502 }
        );
    }
}