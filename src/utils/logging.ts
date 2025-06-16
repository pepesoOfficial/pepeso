import winston from 'winston';
import { format } from 'winston';
import chalk from 'chalk';
import { ChalkInstance } from 'chalk';

// Define log levels and their colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
  tool: 7,
  agent: 8,
};

// Define log level keys as a type
type LogLevelKey = keyof typeof logLevels;

// Define colors for each log level with proper typing
const logColors: { [key in LogLevelKey]: ChalkInstance } = {
  error: chalk.red.bold,
  warn: chalk.yellow.bold,
  info: chalk.blue,
  http: chalk.magenta,
  verbose: chalk.cyan,
  debug: chalk.green,
  silly: chalk.grey,
  tool: chalk.cyan.bold,
  agent: chalk.greenBright.bold,
};

// Custom formatter for pretty printing
const customFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  const levelOutput = logColors[level as LogLevelKey] ? logColors[level as LogLevelKey](level.toUpperCase().padEnd(7)) : level;
  const timestampOutput = chalk.gray(`[${timestamp}]`);
  
  let metaOutput = '';
  if (Object.keys(metadata).length > 0 && metadata.constructor === Object) {
    metaOutput = chalk.gray(` ${JSON.stringify(metadata, null, 2)}`);
  }
  
  return `${timestampOutput} ${levelOutput} ${message}${metaOutput}`;
});

// Create the logger
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  exitOnError: false,
});

// Add winston to global types
declare module 'winston' {
  interface Logger {
    tool(message: string, metadata?: any): this;
    agent(message: string, metadata?: any): this;
  }
}

// Tool execution logging
export const logToolExecution = (toolName: string, input: any) => {
  logger.tool(`🔧 Executing tool: ${toolName}`, { input });
};

export const logToolResult = (toolName: string, result: any) => {
  logger.tool(`✅ Tool result: ${toolName}`, { result });
};

// Agent action logging
export const logAgentThinking = (agentId: string, thought: string) => {
  logger.agent(`🤔 Agent thinking: ${agentId}`, { thought });
};

export const logAgentAction = (agentId: string, action: string, details?: any) => {
  logger.agent(`🚀 Agent action: ${agentId}`, { action, ...details });
};

export const logAgentObservation = (agentId: string, observation: string) => {
  logger.agent(`👁️ Agent observation: ${agentId}`, { observation });
};

// Create a step tracking system
export class StepTracker {
  private steps: Array<{
    step: number;
    timestamp: Date;
    type: string;
    description: string;
    details?: any;
  }> = [];

  private currentStep = 0;

  constructor(private name: string) {}

  addStep(type: string, description: string, details?: any) {
    this.currentStep++;
    const step = {
      step: this.currentStep,
      timestamp: new Date(),
      type,
      description,
      details,
    };
    this.steps.push(step);
    
    const emoji = this.getEmojiForType(type);
    logger.info(`${emoji} [Step ${this.currentStep}] ${this.name}: ${description}`);
    return this.currentStep;
  }

  getSteps() {
    return this.steps;
  }

  private getEmojiForType(type: string): string {
    switch (type.toLowerCase()) {
      case 'tool':
        return '🔧';
      case 'thinking':
        return '🤔';
      case 'decision':
        return '🧠';
      case 'action':
        return '🚀';
      case 'result':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '➡️';
    }
  }

  summarize(): string {
    const summary = this.steps.map((step) => {
      const emoji = this.getEmojiForType(step.type);
      return `${emoji} Step ${step.step}: ${step.description}`;
    }).join('\n');
    
    logger.info(`📋 Execution summary for ${this.name}:\n${summary}`);
    return summary;
  }
}

// Export the logger to be used throughout the application
export default logger;