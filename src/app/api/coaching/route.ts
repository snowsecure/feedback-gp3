import { NextResponse } from 'next/server';
import { generateCoachingFeedback } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { scenario, history, difficulty } = body;

        if (!scenario || !history || !difficulty) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const feedback = await generateCoachingFeedback(scenario, history, difficulty);
        return NextResponse.json(feedback);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
