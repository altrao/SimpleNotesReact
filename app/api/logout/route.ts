import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const res = await fetch(`${process.env.HOST_ADDRESS}/api/logout`, {
            headers: {
                'Authorization': authHeader
            }
        })

        return NextResponse.json(await res.json(), { status: res.status })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to backend' }, { status: 401 })
    }
}