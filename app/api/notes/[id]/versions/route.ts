import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "../../utils";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params

    if (!id) {
        return NextResponse.json({ error: 'Missing note ID' }, { status: 400 })
    }

    try {
        return await handleRequest(request, 'GET', `/api/notes/${id}/versions`)
    } catch (error) {
        console.error('Connection error:', error);
        return NextResponse.json(
            { error: 'Failed to connect to backend' },
            { status: 502 }
        );
    }
}