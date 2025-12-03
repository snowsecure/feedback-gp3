export type Difficulty = 'Basic' | 'Moderate' | 'Advanced';

export interface Scenario {
    id: string;
    title: string;
    difficulty: Difficulty;
    context: string;
    employeeName: string;
    employeeRole: string;
    issue: string;
    personaTraits: string;
}

export const SCENARIOS: Scenario[] = [
    {
        id: '1',
        title: 'Missed Deadlines',
        difficulty: 'Basic',
        context: 'You are the engineering manager. The project is two weeks behind schedule.',
        employeeName: 'Jordan',
        employeeRole: 'Software Engineer',
        issue: 'Jordan has missed the last two sprint deadlines without communicating beforehand.',
        personaTraits: 'Generally reliable but currently overwhelmed. Avoids conflict. Will apologize readily.',
    },
    {
        id: '2',
        title: 'Code Quality Issues',
        difficulty: 'Basic',
        context: 'You are the tech lead. The team is complaining about bugs in recent features.',
        employeeName: 'Alex',
        employeeRole: 'Junior Developer',
        issue: 'Alex is merging code without sufficient testing, causing regressions.',
        personaTraits: 'Eager to please but lacks attention to detail. Needs clear, specific guidance.',
    },
    {
        id: '3',
        title: 'Resistance to New Process',
        difficulty: 'Moderate',
        context: 'You are the team lead. The company has adopted a new project management tool.',
        employeeName: 'Casey',
        employeeRole: 'Senior Designer',
        issue: 'Casey refuses to use the new tool, claiming it slows them down, and is tracking work in a spreadsheet instead.',
        personaTraits: 'Opinionated, values efficiency. Skeptical of "management fads". Needs to understand the "why".',
    },
    {
        id: '4',
        title: 'Interpersonal Conflict',
        difficulty: 'Moderate',
        context: 'You are the department head. Two of your direct reports are not getting along.',
        employeeName: 'Taylor',
        employeeRole: 'Product Manager',
        issue: 'Taylor was rude to a developer in the standup meeting, calling their idea "stupid".',
        personaTraits: 'High performer but abrasive. Thinks they are just being "honest". Defensiveness is likely.',
    },
    {
        id: '5',
        title: 'Scope Creep',
        difficulty: 'Advanced',
        context: 'You are the project manager. The client is asking for more features.',
        employeeName: 'Morgan',
        employeeRole: 'Account Manager',
        issue: 'Morgan keeps promising new features to the client without consulting the dev team, causing burnout.',
        personaTraits: 'Charming, sales-focused. Feels the dev team is "too slow" and "blockers". Will try to charm their way out of it or blame the client.',
    },
    {
        id: '6',
        title: 'Chronic Lateness',
        difficulty: 'Advanced',
        context: 'You are the operations manager. Shift start times are critical.',
        employeeName: 'Riley',
        employeeRole: 'Support Specialist',
        issue: 'Riley has been late 3 times this week. They have a valid personal reason but it is impacting the team.',
        personaTraits: 'Stressed, defensive about personal life. Feels the policy is too rigid. May cry or get angry if pushed too hard.',
    },
];

export function getRandomScenario(difficulty: Difficulty | 'Random'): Scenario {
    let pool = SCENARIOS;
    if (difficulty !== 'Random') {
        pool = SCENARIOS.filter((s) => s.difficulty === difficulty);
    }

    // Fallback if pool is empty (shouldn't happen with default data)
    if (pool.length === 0) pool = SCENARIOS;

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
}
