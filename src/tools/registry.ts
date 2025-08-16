import { BaseTool, ToolSchema } from './base';

export interface ToolMetadata {
    name: string;
    description: string;
    parameters: ToolSchema;
}

export class ToolRegistry {
    private static instance: ToolRegistry;
    private tools: Map<string, BaseTool> = new Map();
    private toolMetadata: Map<string, ToolMetadata> = new Map();

    private constructor() {}

    public static getInstance(): ToolRegistry {
        if (!ToolRegistry.instance) {
            ToolRegistry.instance = new ToolRegistry();
        }
        return ToolRegistry.instance;
    }

    public registerTool(tool: BaseTool): void {
        if (this.tools.has(tool.name)) {
            throw new Error(`Tool with name '${tool.name}' is already registered`);
        }
        
        this.tools.set(tool.name, tool);
        
        this.toolMetadata.set(tool.name, {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters
        });
    }

    public getTool(name: string): BaseTool | undefined {
        return this.tools.get(name);
    }

    public getAllTools(): BaseTool[] {
        return Array.from(this.tools.values());
    }

    public getToolMetadata(name: string): ToolMetadata | undefined {
        return this.toolMetadata.get(name);
    }

    public getAllToolMetadata(): ToolMetadata[] {
        return Array.from(this.toolMetadata.values());
    }

    public getToolsSchema(): Record<string, ToolMetadata> {
        return Object.fromEntries(this.toolMetadata.entries());
    }

    public clear(): void {
        this.tools.clear();
        this.toolMetadata.clear();
    }
}

export const toolRegistry = ToolRegistry.getInstance();

export function createTools<T extends BaseTool[]>(...tools: T): T {
    for (const tool of tools) {
        toolRegistry.registerTool(tool);
    }
    return tools;
}
