// tools direct export

export { WeatherTool } from './weather'
export { SearchTool } from './search'

// registry based export

import { toolRegistry, createTools } from './registry';
import { SearchTool } from './search';
import { WeatherTool } from './weather';


const allTools = createTools(
    new WeatherTool(),
    new SearchTool()
);

export { toolRegistry, createTools };

export function getAvailableTools() {
    return allTools;
}

export function getToolsMetadata() {
    return toolRegistry.getAllToolMetadata();
}

export function getToolsSchema() {
    return toolRegistry.getToolsSchema();
}
