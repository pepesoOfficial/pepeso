import { Model } from "../models/base";
import { Message } from "../core/types";
import { BaseTool } from "../tools/base";
import { v4 as uuid } from 'uuid';

export class Agent {
    private model: Model;
    private tools: BaseTool[];
    private history: Message[] = [];
    private verbose: boolean;

    constructor({ model, tools, systemPrompt, messages = [], verbose = false }: { model: Model, tools: BaseTool[], systemPrompt: string, messages?: Message[], verbose?: boolean }) {
        this.model = model;
        this.tools = tools as BaseTool[];
        this.history.push({ id: uuid(), role: 'system', content: systemPrompt });
        this.history.push(...messages);
        this.verbose = verbose;
    }

    private logToolUsage(toolName: string, input: any, output: any) {
        if (!this.verbose) return;
        
        console.log('\n=== Tool Usage ===');
        console.log(`Tool: ${toolName}`);
        console.log('Input:', JSON.stringify(input, null, 2));
        console.log('Output:', JSON.stringify(output, null, 2));
        console.log('==================\n');
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
                this.logToolUsage(tool.name, toolCall.args, result);
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