import { v4 as uuid } from 'uuid';
import { WeatherTool } from './tools/weather';
import { Message } from './core/types';
import { OpenAIModel } from './models/openai';
import { Agent } from './core/agent';

async function main() {
    const openaiModel = new OpenAIModel();
    const tools = [new WeatherTool()];
    const systemPrompt = 'You are a helpful assistant.';
    const initialMessages: Message[] = [
        { id: uuid(), role: 'user', content: 'Hello!' },
        { id: uuid(), role: 'assistant', content: 'Hi! How can I assist you?' },
    ];

    const agent = new Agent({ 
        model: openaiModel, 
        tools, 
        systemPrompt, 
        messages: initialMessages,
        verbose: true
    });
    
    const response = await agent.chat('What is the weather like in New York?');
    console.log(response);
}

main().catch(console.error);