#! /usr/bin/env node
import { exec, spawn } from 'child_process';
import { grey, magenta, yellow } from 'colors';
import { readdir, readFile, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';
import { handleError } from './handleError';
import { Log, log, resetLog } from './log';

interface Config {
  schema: string | string[];
  afterAll?: string | string[];
  generates: {
    file: string;
    handler: string;
    executable?: string;
  }[];
}

async function getConfigFile(configFile: string) {
  try {
    const stats = await stat(configFile);
    if (!stats.isFile()) {
      throw new Error(`Config file "${configFile}" is not a file`);
    }
    const source = await readFile(configFile);
    let json: Config;
    try {
      json = JSON.parse(source.toString());
    } catch (error) {
      throw new Error(`Config file "${configFile}" is not a valid JSON file`);
    }
    return json;
  } catch (error) {
    throw new Error('Can not find config file');
  }
}

async function findGraphqlFiles(dir: string) {
  const files = await readdir(dir);
  const graphqlFiles: string[] = [];
  await Promise.all(
    files.map(async (file) => {
      if (/\.graphql$/.test(file)) {
        graphqlFiles.push(join(dir, file));
      } else {
        const stats = await stat(join(dir, file));
        if (stats.isDirectory()) {
          const results = await findGraphqlFiles(join(dir, file));
          graphqlFiles.push(...results);
        }
      }
    })
  );
  return graphqlFiles;
}

async function getSchema(sources: string[]): Promise<string> {
  const strings: string[] = [];

  await Promise.all(
    sources.map(async (source) => {
      const files = await readdir(source);
      await Promise.all(
        files.map(async (file) => {
          const stats = await stat(join(source, file));
          if (stats.isDirectory()) {
            strings.push(await getSchema([join(source, file)]));
          } else if (/\.g(raph)?ql$/.test(file)) {
            log(Log.INFO, `- ${join(source, file)}`);
            const src = await readFile(join(source, file));
            strings.push(src.toString());
          }
        })
      );
    })
  );

  return strings.join('\n');
}

async function codegen(
  configFile: string = join(process.cwd(), 'codegen.json')
) {
  try {
    await resetLog();
    const config = await getConfigFile(configFile);
    const { schema, generates, afterAll } = config;
    const schemas = Array.isArray(schema) ? schema : [schema];

    log(
      Log.VERBOSE,
      `Scanning for GraphQL files ${JSON.stringify(
        schemas.map((s) => join(process.cwd(), s))
      )}`
    );

    log(Log.INFO, '# GraphQL files\n');

    const graphqlSchema = await getSchema(
      schemas.map((s) => join(process.cwd(), s))
    );

    log(
      Log.INFO,
      `## Schema

\`\`\`graphql
${graphqlSchema}
\`\`\``
    );

    if (!graphqlSchema) {
      throw new Error('Schema is empty!');
    }

    for (const generate of generates) {
      const { file, handler, executable = 'node' } = generate;

      log(
        Log.VERBOSE,
        `## Generating file ${file} with handler ${handler} (executable: ${executable})`
      );

      const output: string = await new Promise(async (resolve, reject) => {
        const out: string[] = [];
        const err: string[] = [];

        const [exec, ...execs] = executable.split(/\s+/);

        const ps = spawn(exec, [
          ...execs,
          join(process.cwd(), './node_modules/@browserql/codegen/handler.js'),
          handler,
          graphqlSchema,
        ]);

        ps.on('error', reject);

        ps.on('close', (status) => {
          if (status === 0) {
            out.shift();
            resolve(out.join('\n'));
          } else {
            reject(
              new Error(`Got unexpected status ${status}: ${err.join('\n')}`)
            );
          }
        });

        ps.stdout.on('data', (data) => {
          out.push(data.toString());
        });

        ps.stderr.on('data', (data) => {
          err.push(data.toString());
        });
      });

      log(
        Log.INFO,
        `### Output\n\n\`\`\`\n${output.slice(0, 255)} ...\n\`\`\`\n`
      );

      if (output) {
        const [, contents] = output.split('======= codegen =======');

        await writeFile(join(process.cwd(), file), contents);
      } else {
        log(Log.WARNING, '## Output is empty!');
        await writeFile(join(process.cwd(), file), '');
      }

      if (afterAll) {
        const posts = Array.isArray(afterAll) ? afterAll : [afterAll];

        await Promise.all(
          posts.map(async (post) => {
            await promisify(exec)(
              `${join(process.cwd(), post)} ${join(process.cwd(), file)}`
            );
          })
        );
      }
    }
  } catch (error) {
    handleError(error as Error);
    log(
      Log.ERROR,
      `${(error as Error).message}\n\n${(error as Error).stack || ''}`
    );
  }
}

const [, , _configFile] = process.argv;

codegen(_configFile);

// codegen configFile=codegen.json
