import { writeFile } from 'fs/promises';
import { join } from 'path';

const logFile = join(process.cwd(), 'codegen.log');

export async function log(level: Log, ...messages: string[]) {
  if (level === Log.VERBOSE) {
    console.log(...messages);
  }

  await writeFile(
    logFile,
    `
  =========================
  ${new Date()}
  =========================
  ${level}

  ${messages.join('\n')}



  
  `,
    { flag: 'a+' }
  );
}

export enum Log {
  VERBOSE = 'VERBOSE',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export async function resetLog() {
  try {
    await writeFile(logFile, '');
  } catch (error) {
    log(
      Log.WARNING,
      'Can not reset log file',
      JSON.stringify({
        message: (error as Error).message,
      })
    );
  }
}
