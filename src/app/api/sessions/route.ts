import { NextResponse } from 'next/server';
import { getSessions, saveSession, Session } from '@/lib/storage';

export async function GET() {
    const sessions = getSessions();
    return NextResponse.json(sessions);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const session: Session = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            ...body
        };

        saveSession(session);
        return NextResponse.json({ success: true, session });
    } catch (error) {
        console.error('Error saving session:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
