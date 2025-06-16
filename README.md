# Pepeso AI Framework

Pepeso AI Framework is a simple, modern, flexible, and extensible AI framework for building AI-powered applications.

## Features

- Simple, modern, flexible, and extensible AI framework
- Supports multiple models (GPT-3.5, GPT-4)
- Supports multiple tools (Weather, News, Calculator, custom Tools)

## Installation

```bash
npm install pepeso
```

## Usage

```typescript
import { Agent } from 'pepeso';
import { OpenAIModel } from 'pepeso/models';
import { v4 as uuid } from 'uuid';

const initialMessages: Message[] = [
    { id: uuid(), role: 'user', content: 'Hello!' },
    { id: uuid(), role: 'assistant', content: 'Hi! How can I assist you?' },
];

const agent = new Agent({ 
    model: new OpenAIModel(), 
    tools: [new WeatherTool(), new NewsTool(), new CalculatorTool()], 
    systemPrompt: 'You are a helpful assistant.', 
    messages: initialMessages 
});

const response = await agent.chat('What is the weather like in Mumbai?');
console.log(response);
```
