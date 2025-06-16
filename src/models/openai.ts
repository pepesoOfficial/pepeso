import OpenAI from "openai";
import { Model, ModelResponse } from "./base";
import { Message } from "../core/types";
import { BaseTool } from "../tools/base";
import * as dotenv from 'dotenv';

dotenv.config();

// OpenAI Model Implementation
export class OpenAIModel implements Model {
    private client: OpenAI;

    constructor(apiKey?: string) {
        if (!apiKey && !process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key not provided');
        }
        this.client = new OpenAI({ apiKey: apiKey ? apiKey : process.env.OPENAI_API_KEY });
    }

    async generate(history: Message[], tools: BaseTool[]): Promise<ModelResponse> {
        const openaiHistory = history
            .map((message) => {
                if (message.role === 'system') {
                    return { role: 'system', content: message.content };
                } else if (message.role === 'user') {
                    return { role: 'user', content: message.content };
                } else if (message.role === 'assistant') {
                    const msg: any = { role: 'assistant', content: message.content };
                    if (message.tool_calls) {
                        msg.tool_calls = message.tool_calls.map((tc) => ({
                            id: tc.id,
                            type: 'function',
                            function: { name: tc.tool, arguments: JSON.stringify(tc.args) },
                        }));
                    }
                    return msg;
                } else if (message.role === 'result') {
                    return { role: 'tool', tool_call_id: message.tool_call_id, content: JSON.stringify(message.result) };
                } else {
                    return null; // Ignore 'function' role here as it's handled by assistant
                }
            })
            .filter((msg) => msg !== null);

        const openaiTools = tools.map((tool) => ({
            type: 'function' as const,
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters,
            },
        }));

        const response = await this.client.chat.completions.create({
            model: 'gpt-4o',
            messages: openaiHistory,
            tools: openaiTools,
            tool_choice: 'auto',
        });

        const choice = response.choices[0];
        const message = choice.message;

        const modelResponse: ModelResponse = {
            content: message.content || '',
        };

        if (message.tool_calls) {
            modelResponse.tool_calls = message.tool_calls.map((tc) => ({
                id: tc.id,
                tool: tc.function.name,
                args: JSON.parse(tc.function.arguments),
            }));
        }

        return modelResponse;
    }
}