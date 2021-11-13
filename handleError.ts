import { red, yellow } from 'colors';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function handleError(error: Error) {
  console.log(red(error.message));
  console.log(yellow(error.stack || ''));

  await writeFile(
    join(process.cwd(), 'codegen-error.txt'),
    `Error: ${error.message}\n\nStack: ${error.stack}\n`
  );
}
