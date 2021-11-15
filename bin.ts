#! /usr/bin/env node
import { exec, spawn } from 'child_process';
import { readdir, readFile, stat, writeFile } from 'fs/promises';
import { buildSchema, parse, DefinitionNode, Kind, print } from 'graphql';
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
    after?: string | string[];
    arguments?: Record<string, any>;
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

const extendError = /"There can be only one type named "(.+)"\.$/;

function sanitizeSchema(source: string): string {
  console.log(source);
  try {
    buildSchema(source);
    return source;
  } catch (error) {
    if (error instanceof Error) {
      if (extendError.test(error.message)) {
        const type = error.message.replace(extendError, '$1');
        const { definitions, ...doc } = parse(source);
        const nextDefs: DefinitionNode[] = definitions.map((def) => {
          if (def.kind === 'ObjectTypeDefinition' && def.name.value === type) {
            return {
              ...def,
              kind: 'ObjectTypeExtensionDefinition' as Kind.INTERFACE_TYPE_DEFINITION,
            };
          }
          return def;
        });
        return sanitizeSchema(
          print({
            ...doc,
            definitions: nextDefs,
          })
        );
      }
    }
    throw error;
  }
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

    const all = await getSchema(schemas.map((s) => join(process.cwd(), s)));

    const sanitized = sanitizeSchema(all);

    const graphqlSchema = `# My\n\n${sanitized}`;

    log(
      Log.INFO,
      `## Schema

\`\`\`graphql
HELLO
\`\`\``
    );

    if (!graphqlSchema) {
      throw new Error('Schema is empty!');
    }

    for (const generate of generates) {
      const {
        file,
        handler,
        executable = 'node',
        after,
        arguments: args = {},
      } = generate;

      log(
        Log.VERBOSE,
        `## Generating file ${file} with handler ${handler} (arguments: ${JSON.stringify(
          args
        )}, executable: ${executable})`
      );

      log(
        Log.VERBOSE,
        `  -- (arguments: ${JSON.stringify(args)}, executable: ${executable})`
      );

      const output: string = await new Promise(async (resolve, reject) => {
        const out: string[] = [];
        const all: string[] = [];

        const [exec, ...execs] = executable.split(/\s+/);

        const ps = spawn(exec, [
          ...execs,
          join(process.cwd(), './node_modules/@browserql/codegen/handler.js'),
          handler,
          graphqlSchema,
          JSON.stringify(args),
        ]);

        ps.on('error', reject);

        ps.on('close', (status) => {
          if (status === 0) {
            out.shift();
            resolve(out.join('\n'));
          } else {
            reject(
              new Error(`Got unexpected status ${status}: ${all.join('\n')}`)
            );
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

      const posts: string[] = [];

      if (after) {
        posts.push(...(Array.isArray(after) ? after : [after]));
      }

      if (afterAll) {
        posts.push(...(Array.isArray(afterAll) ? afterAll : [afterAll]));
      }

      await Promise.all(
        posts.map(async (post) => {
          await promisify(exec)(
            `${join(process.cwd(), post)} ${join(process.cwd(), file)}`
          );
        })
      );
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
