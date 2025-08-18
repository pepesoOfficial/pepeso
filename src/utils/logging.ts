import chalk from 'chalk';

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'tool' | 'agent';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  tool: 4,
  agent: 5,
};

let currentLogLevel: LogLevel = 'info';

function getSimpleTimestamp() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const log = (level: LogLevel, emoji: string, message: string, data?: any) => {
  if (LOG_LEVELS[level] > LOG_LEVELS[currentLogLevel]) return;
  
  const timestamp = chalk.gray(`[${getSimpleTimestamp()}]`);
  const levelStr = `${emoji} ${level.toUpperCase()}`.padEnd(10);
  const formattedMessage = `${timestamp} ${levelStr} ${message}`;
  
  console.log(formattedMessage);
  if (data) {
    console.log(chalk.gray(JSON.stringify(data, null, 2)), '\n\n');
  }
};

export const setLogLevel = (level: LogLevel) => {
  currentLogLevel = level;
};

// Public logging methods
export const error = (message: string, data?: any) => 
  log('error', '❌', chalk.red(message), data);

export const warn = (message: string, data?: any) => 
  log('warn', '⚠️', chalk.yellow(message), data);

export const info = (message: string, data?: any) => 
  log('info', 'ℹ️', chalk.blue(message), data);

export const debug = (message: string, data?: any) => 
  log('debug', '�', chalk.green(message), data);

export const toolLogger = (action: 'start' | 'end' | 'error', toolName: string, data?: any) => {
  const emojiMap = {
    start: '🚀',
    end: '✅',
    error: '❌'

  };
  const message = `${toolName} ${action === 'start' ? 'Started' : action === 'end' ? 'Completed' : 'Failed'}`;
  log('tool', emojiMap[action], chalk.cyan(message), data);
};

export const agent = (action: 'think' | 'act' | 'observe', message: string, data?: any) => {
  const emojiMap = {
    think: '🤔',
    act: '🚀',
    observe: '👁️'
  };
  log('agent', emojiMap[action], chalk.magenta(`[Agent] ${message}`), data);
};

// Step tracker
export class StepTracker {
  private steps: Array<{
    step: number;
    timestamp: Date;
    type: 'start' | 'info' | 'success' | 'warning' | 'error' | 'complete';
    message: string;
    data?: any;
  }> = [];
  
  private currentStep = 0;
  private startTime: Date;

  constructor(private name: string) {
    this.startTime = new Date();
    this.addStep('start', `Starting ${name}`);
  }

  addStep(type: 'start' | 'info' | 'success' | 'warning' | 'error' | 'complete', message: string, data?: any) {
    this.currentStep++;
    const step = {
      step: this.currentStep,
      timestamp: new Date(),
      type,
      message,
      data
    };
    this.steps.push(step);
    
    const emojiMap = {
      start: '🚀',
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      complete: '🏁'
    };
    
    const colorMap = {
      start: chalk.blue,
      info: chalk.cyan,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
      complete: chalk.greenBright
    };
    
    const timestamp = chalk.gray(`[${step.timestamp.toISOString()}]`);
    const stepInfo = chalk.gray(`[Step ${step.step}]`);
    const formattedMessage = colorMap[type](`${emojiMap[type]} ${message}`);
    
    console.log(`${timestamp} ${stepInfo} ${formattedMessage}`);
    if (data) {
      console.log(chalk.gray(JSON.stringify(data, null, 2)));
    }
    
    return step;
  }
  
  complete(message = 'Completed successfully') {
    const endTime = new Date();
    const duration = endTime.getTime() - this.startTime.getTime();
    this.addStep('complete', `${message} (took ${duration}ms)`);
  }
  
  error(message: string, error?: Error) {
    this.addStep('error', message, error ? error.message : undefined);
  }
}