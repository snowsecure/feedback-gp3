import OpenAI from 'openai';
import { Scenario, Difficulty } from './scenarios';

// Initialize OpenAI client lazily or with a check
const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not set");
    }
    return new OpenAI({ apiKey });
};

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'; // Default to a mini model

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface CoachingResult {
    summary: string;
    strengths: string[];
    improvements: string[];
    suggestedPhrases: string[];
}

export async function generateEmployeeReply(
    scenario: Scenario,
    history: Message[],
    difficulty: Difficulty
): Promise<string> {
    const systemPrompt = `
You are roleplaying as an employee named ${scenario.employeeName}, who is a ${scenario.employeeRole}.
Your manager is talking to you about the following issue: "${scenario.issue}".
Context: ${scenario.context}

Your persona traits: ${scenario.personaTraits}

Difficulty Level: ${difficulty}
- Basic: You are a calm and professional employee. You generally handle feedback well, even if it is negative. You are open to constructive criticism and willing to improve. You do not get defensive easily.
- Moderate: You are slightly defensive and irritable. You might question the validity of the feedback or feel unfairly targeted. You are not outright hostile, but you are difficult to get through to. You might make some excuses.
- Advanced: You are a nightmare employee. Start the conversation calmly but with a suspicious undertone. You are prone to escalating to rage. You should threaten legal action, blame others (colleagues, management, the system), and exhibit wild, unpredictable behavior. You can escalate slowly or snap quickly depending on the manager's tone. Do not hold back on the drama.

Current state of conversation:
The user (manager) is chatting with you. Respond naturally as the employee. 
Keep responses concise (1-3 sentences usually). 
Do NOT break character. 
Do NOT act like an AI.
`;

    try {
        const completion = await getOpenAIClient().chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                ...history,
            ],
        });

        return completion.choices[0].message.content || "...";
    } catch (error) {
        console.error("Error generating employee reply:", error);
        throw new Error("Failed to generate response");
    }
}

export async function generateCoachingFeedback(
    scenario: Scenario,
    history: Message[],
    difficulty: Difficulty
): Promise<CoachingResult> {
    const systemPrompt = `
You are an expert leadership coach. 
Review the following conversation between a manager (User) and an employee (Assistant).
The manager was practicing giving feedback.

Scenario: ${scenario.title}
Issue: ${scenario.issue}
Difficulty: ${difficulty}

Provide structured coaching feedback in JSON format with the following fields:
- summary: A brief summary of the conversation (2-3 sentences).
- strengths: A list of 2-3 things the manager did well.
- improvements: A list of 2-3 specific areas for improvement.
- suggestedPhrases: A list of 2-3 better phrases the manager could have used.

Focus on:
- Clarity of expectations.
- Empathy and active listening.
- Balancing praise and critique.
- Moving towards a solution.
`;

    // Convert history to a string for the prompt if needed, or just pass as messages.
    // For coaching, we can just pass the whole transcript as a user message or system context.
    // Let's format the transcript.
    const transcript = history
        .map((m) => `${m.role === 'user' ? 'Manager' : 'Employee'}: ${m.content}`)
        .join('\n');

    try {
        const completion = await getOpenAIClient().chat.completions.create({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Here is the conversation transcript:\n\n${transcript}` },
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content in coaching response");

        const result = JSON.parse(content) as CoachingResult;
        return result;
    } catch (error) {
        console.error("Error generating coaching feedback:", error);
        // Return a fallback if parsing fails
        return {
            summary: "Could not generate coaching feedback at this time.",
            strengths: [],
            improvements: [],
            suggestedPhrases: [],
        };
    }
}
