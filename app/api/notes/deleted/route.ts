import { NextRequest, NextResponse } from "next/server";
import { handleRequest } from "../utils";


export async function GET(request: NextRequest) {
  try {
    return await handleRequest(request, 'GET', '/api/notes/deleted')
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to backend' },
      { status: 502 }
    );
  }
}