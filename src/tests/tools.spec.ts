import { 
    getAvailableTools, 
    getToolsMetadata, 
    getToolsSchema,
    toolRegistry
} from '../tools';

async function developerExample() {
    console.log('\n=== Developer Example ===');
    
    const tools = getAvailableTools();
    console.log('Available tools:', tools.map(t => t.name));
    
    const weatherTool = tools.find(t => t.name === 'get_weather');
    if (weatherTool) {
        const result = await weatherTool.run({ 
            location: 'New York',
            unit: 'fahrenheit' 
        });
        console.log('Weather result:', result);
    }
}

// Example 2: For AI agents - getting tool metadata
function aiAgentExample() {
    console.log('\n=== AI Agent Example ===');
    
    // Get all tool metadata
    const toolsMetadata = getToolsMetadata();
    console.log('Available tools metadata:', JSON.stringify(toolsMetadata, null, 2));
    
    // Get tools schema for function calling
    const toolsSchema = getToolsSchema();
    console.log('\nTools schema for function calling:');
    console.log(JSON.stringify(toolsSchema, null, 2));
}

// Example 3: Dynamic tool execution (how an AI agent might use it)
async function dynamicToolExecution(toolName: string, args: any) {
    console.log('\n=== Dynamic Tool Execution ===');
    const tool = toolRegistry.getTool(toolName);
    if (!tool) {
        throw new Error(`Tool '${toolName}' not found`);
    }
    
    console.log(`Executing ${toolName} with args:`, args);
    const result = await tool.run(args);
    console.log('Execution result:', result);
    return result;
}

// Run all examples
async function runExamples() {
    try {
        await developerExample();
        aiAgentExample();
        await dynamicToolExecution('get_weather', { 
            location: 'London',
            unit: 'celsius' 
        });
    } catch (error) {
        console.error('Error in examples:', error);
    }
}

runExamples().catch(console.error);