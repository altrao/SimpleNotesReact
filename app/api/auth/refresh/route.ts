import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        const res = await fetch(`${process.env.HOST_ADDRESS}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json(error, { status: res.status });
        }

        return NextResponse.json(await res.json());
    } catch (error) {
        console.log('unexpected refresh error', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}