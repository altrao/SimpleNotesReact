import { NextRequest, NextResponse } from "next/server";


const host = 'http://localhost:8080'

export const mapNoteFields = (note: any) => ({
  ...note,
  createdAt: note.creationDate,
  updatedAt: note.expirationDate
});

export async function handleRequest(request: NextRequest, method: string, path: string, body?: any) {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const requestOptions: any = {
    method,
    headers: {
      'Authorization': authHeader
    }
  }

  if (body) {
    requestOptions.body = JSON.stringify(body)
    requestOptions.headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${host}${path}`, requestOptions);

  if (!response.ok) {
    return NextResponse.json(await response.json(), { status: response.status })
  }

  return NextResponse.json((await response.json()).map(mapNoteFields));
}