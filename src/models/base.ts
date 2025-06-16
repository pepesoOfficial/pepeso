import { Message } from '../core/types';
import { BaseTool } from '../tools/base';

export interface ModelResponse {
    content: string;
    tool_calls?: { id: string; tool: string; args: any }[];
}

export interface Model {
    generate(history: Message[], tools: BaseTool[]): Promise<ModelResponse>;
}