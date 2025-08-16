export interface ToolSchema {
    type: 'object';
    properties: { [key: string]: { type: string; description?: string, tags?: string[] } };
    required?: string[];
    additionalProperties?: boolean;
    [key: string]: any; // Allow additional fields for flexibility
}

export abstract class BaseTool {
    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly parameters: ToolSchema;
    abstract _run(input: any): Promise<any>;

    async run(input: any): Promise<any> {
        return this._run(input);
    }
}   