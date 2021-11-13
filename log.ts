import { writeFile } from 'fs/promises';
import { join } from 'path';

const logFile = join(process.cwd(), 'codegen-log.md');

export async function log(level: Log, message: string) {
  if (level === Log.VERBOSE) {
    console.log(message);
  }

  await writeFile(logFile, `${message}\n`, { flag: 'a+' });
}

export enum Log {
  VERBOSE = 'VERBOSE',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  LIST = 'LIST',
}

export async function resetLog() {
  try {
    await writeFile(logFile, '# codegen log\n===\n');
  } catch (error) {
    log(
      Log.WARNING,
      `Can not reset log file ${JSON.stringify({
        message: (error as Error).message,
      })}`
    );
  }
}
