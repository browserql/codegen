#! /usr/bin/env node
import { sanitizeSchema } from '@browserql/merge-schemas';
import { createWriteStream } from 'fs';
import { readdir, readFile, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import { handleError } from './handleError';
import { Log, log, resetLog } from './log';
import { version } from './package.json';
import { spawnify } from './spawnify';

interface Config {
  schema: string | string[];
  exclude?: string | string[];
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

async function getSchema(
  sources: string[],
  exclude: string[]
): Promise<string> {
  const strings: string[] = [];

  await Promise.all(
    sources.map(async (source) => {
      const files = await readdir(source);
      await Promise.all(
        files.map(async (file) => {
          const stats = await stat(join(source, file));
          if (stats.isDirectory()) {
            strings.push(await getSchema([join(source, file)], exclude));
          } else if (
            /\.g(raph)?ql$/.test(file) &&
            exclude.every((p) => !new RegExp(p).test(file))
          ) {
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

    log(Log.VERBOSE, `Using codegen v${version}`);

    log(
      Log.VERBOSE,
      `Scanning for GraphQL files ${JSON.stringify(
        schemas.map((s) => join(process.cwd(), s))
      )}`
    );

    log(Log.INFO, '# GraphQL files\n');

    const { exclude = [] } = config;

    const excludes = Array.isArray(exclude) ? exclude : [exclude];

    const all = await getSchema(
      schemas.map((s) => join(process.cwd(), s)),
      excludes
    );

    if (!all) {
      throw new Error('Schema is empty!');
    }

    const sanitized = sanitizeSchema(all);

    const graphqlSchema = sanitized;

    log(
      Log.INFO,
      `## Schema

\`\`\`graphql
${graphqlSchema}
\`\`\``
    );

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

      const [exec, ...execs] = executable.split(/\s+/);

      const output = await spawnify(exec, [
        ...execs,
        join(process.cwd(), './node_modules/@browserql/codegen/handler.js'),
        // join(process.cwd(), '../handler.js'),
        handler,
        graphqlSchema,
        JSON.stringify(args),
      ]);

      log(
        Log.INFO,
        `### Output\n\n\`\`\`\n${output.slice(0, 255)} ...\n\`\`\`\n`
      );

      if (output) {
        const [, contents] = output.split('======= codegen =======');

        const writeStream = createWriteStream(join(process.cwd(), file));

        const lines = contents.split('\n');

        while (lines.length) {
          writeStream.write(lines.shift(), 'utf-8');
        }

        writeStream.end();

        // await writeFile(join(process.cwd(), file), contents);
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
          const [afterExecutable, ...afterArgs] = join(
            process.cwd(),
            post
          ).split(/\s+/);
          await spawnify(afterExecutable, [
            ...afterArgs,
            join(process.cwd(), file),
          ]);
        })
      );
    }
  } catch (error) {
    handleError(error as Error);
    log(
      Log.ERROR,
      `${(error as Error).message}\n\n${(error as Error).stack || ''}`
    );
    throw error;
  }
}

const [, , _configFile] = process.argv;

codegen(_configFile);

// codegen configFile=codegen.json
