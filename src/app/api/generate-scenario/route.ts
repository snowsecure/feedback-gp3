import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CustomScenarioDetails } from '@/lib/customScenario';

export const runtime = 'nodejs';

// Initialize OpenAI client
const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not set");
    }
    return new OpenAI({ apiKey });
};

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const partial: Partial<CustomScenarioDetails> = body.partialScenario || {};

        const systemPrompt = `
You are an expert at creating realistic workplace roleplay scenarios for leadership coaching.
The user has provided some details for a scenario, but left others blank.
Your task is to fill in the MISSING fields to create a coherent, realistic, and challenging scenario.

The existing fields are:
${JSON.stringify(partial, null, 2)}

Requirements:
- Fill in any missing fields from this list: title, employeeName, employeeRole, context, issue, personaTraits.
- If 'employeeName' is missing, pick a realistic name.
- If 'issue' is missing, create a realistic management issue (e.g., performance, behavior, attitude).
- Ensure the 'context' explains the setting (e.g., "Weekly 1:1 meeting").
- The 'personaTraits' should describe how the employee acts (e.g., "Defensive but polite", "Quiet and withdrawn").
- Keep it professional and realistic.

Return ONLY a valid JSON object matching the following structure:
{
  "title": "string",
  "employeeName": "string",
  "employeeRole": "string",
  "context": "string",
  "issue": "string",
  "personaTraits": "string"
}
`;

        const openai = getOpenAIClient();
        const completion = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: "Generate the complete scenario details." }
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error("No content generated");
        }

        const generatedData = JSON.parse(content);
        return NextResponse.json(generatedData);

    } catch (error) {
        console.error("Error generating scenario:", error);
        return NextResponse.json(
            { error: "Failed to generate scenario" },
            { status: 500 }
        );
    }
}
