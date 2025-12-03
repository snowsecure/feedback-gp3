# Feedback Training App

A browser-based training app for managers to practice giving feedback to employees using realistic, simulated conversations.

## Features

- **Realistic Scenarios**: Practice with various employee personas and difficulty levels.
- **Interactive Chat**: Converse with an AI employee that reacts in-character.
- **AI Coaching**: Receive structured feedback on your performance after each session.
- **Export**: Save your conversation and coaching feedback.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS (CSS Modules / Global Styles)
- **AI**: OpenAI API (GPT-5.x mini)
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Node.js 18+ (for local dev)
- Docker (for containerized run)
- OpenAI API Key

### Local Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file with your OpenAI API key:
    ```bash
    OPENAI_API_KEY=your_key_here
    OPENAI_MODEL=gpt-4o-mini # Optional, defaults to gpt-4o-mini
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000).

### Docker Deployment

1.  **Build the image**:
    ```bash
    docker build -t feedback-trainer .
    ```

2.  **Run the container**:
    ```bash
    docker run -p 3000:3000 -e OPENAI_API_KEY=your_key_here feedback-trainer
    ```

3.  Open [http://localhost:3000](http://localhost:3000).

## Configuration

- `OPENAI_API_KEY`: Required. Your OpenAI API key.
- `OPENAI_MODEL`: Optional. The model to use (e.g., `gpt-4o-mini`, `gpt-4`). Defaults to `gpt-4o-mini`.
- `PORT`: Optional. The port to run the server on inside the container. Defaults to 3000.
