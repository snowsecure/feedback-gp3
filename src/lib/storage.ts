import fs from 'fs';
import path from 'path';
import { Message, CoachingResult } from './openai';
import { Scenario } from './scenarios';

export interface Session {
    id: string;
    timestamp: string;
    scenario: Scenario;
    messages: Message[];
    coaching: CoachingResult;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Ensure sessions file exists
if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
}

export function getSessions(): Session[] {
    try {
        const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading sessions:', error);
        return [];
    }
}

export function saveSession(session: Session): void {
    try {
        const sessions = getSessions();
        // Add new session to the beginning of the array
        sessions.unshift(session);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    } catch (error) {
        console.error('Error saving session:', error);
    }
}
