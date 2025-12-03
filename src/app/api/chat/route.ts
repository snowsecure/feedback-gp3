import { NextResponse } from 'next/server';
import { generateEmployeeReply } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { scenario, history, difficulty } = body;

        if (!scenario || !history || !difficulty) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const reply = await generateEmployeeReply(scenario, history, difficulty);
        return NextResponse.json({ reply });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
