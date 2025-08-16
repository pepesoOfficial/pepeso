import { BaseTool, ToolSchema } from "../base";

export class WeatherTool extends BaseTool {
    name = 'get_weather';
    description = 'Get the current weather for a location';
    
    parameters: ToolSchema = {
        type: 'object',
        properties: {
            location: { 
                type: 'string', 
                description: 'The city and state, e.g., San Francisco, CA' 
            },
            unit: {
                type: 'string',
                tags: ['celsius', 'fahrenheit'],
                description: 'The unit of temperature to return',
            }
        },
        required: ['location'],
        additionalProperties: false,
    };

    async _run(input: { location: string; unit?: 'celsius' | 'fahrenheit' }): Promise<string> {
        const { location, unit = 'celsius' } = input;
        const temp = unit === 'celsius' ? '24°C' : '75°F';
        return `The weather in ${location} is ${temp} and sunny (simulated).`;
    }
}

export const weatherTool = new WeatherTool();
export default weatherTool;