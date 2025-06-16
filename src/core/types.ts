export type Message =
    | { id: string; role: 'system'; content: string }
    | { id: string; role: 'user'; content: string }
    | { id: string; role: 'assistant'; content: string; tool_calls?: { id: string; tool: string; args: any }[] }
    | { id: string; role: 'function'; tool: string; args: any }
    | { id: string; role: 'result'; tool_call_id: string; result: any };
