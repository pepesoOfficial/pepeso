import { BaseTool, ToolSchema } from "../base";

export class WeatherTool extends BaseTool {
    readonly name = 'get_weather';
    readonly description = 'Get the current weather for a location';
    readonly parameters: ToolSchema = {
        type: 'object' as const,
        properties: {
            location: { type: 'string', description: 'The location to get weather for' },
        },
        required: ['location'],
        additionalProperties: false,
    };

    async _run(input: { location: string }): Promise<string> {
        return `The weather in ${input.location} is 75°F and sunny (simulated).`;
    }
}
