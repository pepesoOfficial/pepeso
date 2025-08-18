import { BaseTool, ToolSchema } from '../base';

export class SearchTool extends BaseTool {
    name = 'web_search';
    description = 'Perform a web search to find information on any topic';
    
    parameters: ToolSchema = {
        type: 'object',
        properties: {
            query: {
                type: 'string',
                description: 'The search query',
            },
            max_results: {
                type: 'number',
                description: 'Maximum number of results to return (1-10)',
            },
            search_type: {
                type: 'string',
                description: 'Type of search to perform',
            }
        },
        required: ['query']
    };

    async _run({ query, max_results = 5, search_type = 'web' }: { 
        query: string; 
        max_results?: number;
        search_type?: string;
    }) {
        // Simulate search results
        const results = [];
        for (let i = 1; i <= max_results; i++) {
            results.push({
                title: `Result ${i} for "${query}"`,
                url: `https://pepeso.com/${search_type}/${encodeURIComponent(query)}/result-${i}`,
                snippet: `This is a sample ${search_type} search result for "${query}". The search returned relevant information about the topic.`,
                type: search_type,
                position: i
            });
        }

        return {
            query,
            search_type,
            results_count: results.length,
            results
        };
    }
}

// Create and export a singleton instance
const searchTool = new SearchTool();
export { searchTool };