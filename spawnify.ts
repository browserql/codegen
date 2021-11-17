import { spawn } from 'child_process';
import { join } from 'path';

export async function spawnify(
  executable: string,
  args: string[]
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const out: string[] = [];
    const all: string[] = [];

    const ps = spawn(executable, args);

    ps.on('error', reject);

    ps.on('close', (status) => {
      if (status === 0) {
        out.shift();
        resolve(out.join('\n'));
      } else {
        reject(new Error(`Got unexpected status ${status}: ${all.join('\n')}`));
      }
    });

    ps.stdout.on('data', (data) => {
      out.push(data.toString());
      all.push(data.toString());
    });

    ps.stderr.on('data', (data) => {
      all.push(data.toString());
    });
  });
}
