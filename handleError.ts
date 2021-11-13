import { red, yellow } from 'colors';
import { unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { Log, log } from './log';

const errorFile = join(process.cwd(), 'codegen-error.txt');

export async function handleError(error: Error) {
  console.log(red(error.message));
  console.log(yellow(error.stack || ''));

  await writeFile(
    errorFile,
    `Error: ${error.message}\n\nStack: ${error.stack}\n`
  );
}

export async function resetErrorFile() {
  try {
    await unlink(errorFile);
  } catch (error) {
    log(
      Log.WARNING,
      `Can not unlink error file ${JSON.stringify({
        message: (error as Error).message,
      })}`
    );
  }
}
