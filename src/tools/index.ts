import { toolRegistry, createTools } from './registry';
import { weatherTool } from './weather';

const allTools = createTools(
    weatherTool
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

