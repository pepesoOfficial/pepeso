import { Model } from "../models/base";
import { Message } from "../core/types";
import { BaseTool } from "../tools/base";
import { v4 as uuid } from 'uuid';

export class Agent {
    private model: Model;
    private tools: BaseTool[];
    private history: Message[] = [];

    constructor({ model, tools, systemPrompt, messages = [] }: { model: Model, tools: BaseTool[], systemPrompt: string, messages?: Message[] }) {
        this.model = model;
        this.tools = tools as BaseTool[];
        this.history.push({ id: uuid(), role: 'system', content: systemPrompt });
        this.history.push(...messages);
    }

    async chat(input: string): Promise<string> {
        const userMessage: Message = { id: uuid(), role: 'user', content: input };
        this.history.push(userMessage);

        while (true) {
            const modelResponse = await this.model.generate(this.history, this.tools);
            const assistantMessage: Message = {
                id: uuid(),
                role: 'assistant',
                content: modelResponse.content,
                tool_calls: modelResponse.tool_calls,
            };
            this.history.push(assistantMessage);

            if (!modelResponse.tool_calls || modelResponse.tool_calls.length === 0) {
                return modelResponse.content;
            }

            for (const toolCall of modelResponse.tool_calls) {
                const tool = this.tools.find((t) => t.name === toolCall.tool);
                if (!tool) {
                    throw new Error(`Tool ${toolCall.tool} not found`);
                }
                const result = await tool.run(toolCall.args);
                const resultMessage: Message = {
                    id: uuid(),
                    role: 'result',
                    tool_call_id: toolCall.id,
                    result,
                };
                this.history.push(resultMessage);
            }
        }
    }
}