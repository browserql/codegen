#! /usr/bin/env node
import { exec, spawn } from 'child_process';
import { readdir, readFile, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';

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

async function getSchema(sources: string[]) {
  const strings = await Promise.all(
    sources.map(async (source) => {
      const fileName = join(process.cwd(), source);
      const stats = await stat(fileName);
      if (stats.isDirectory()) {
        const files = await findGraphqlFiles(fileName);
        const sources = await Promise.all(
          files.map(async (file) => {
            console.log();
            console.log('Reading GraphQL file', file);
            console.log();
            const src = await readFile(file);
            return src.toString();
          })
        );
        return sources.join('\n');
      }
      console.log();
      console.log('Reading GraphQL file', fileName);
      console.log();
      const string = await readFile(join(process.cwd(), source));
      return string.toString();
    })
  );
  return strings.join('\n');
}

async function codegen(
  configFile: string = join(process.cwd(), 'codegen.json')
) {
  const config = await getConfigFile(configFile);
  const { schema, generates, afterAll } = config;
  const schemas = Array.isArray(schema) ? schema : [schema];
  const graphqlSchema = await getSchema(schemas);

  for (const generate of generates) {
    const { file, handler, executable = 'node' } = generate;

    console.log();
    console.log('Generating', file);
    console.log();

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

    const [, contents] = output.split('======= codegen =======');

    await writeFile(join(process.cwd(), file), contents);

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
}

const [, , _configFile] = process.argv;

codegen(_configFile);

// codegen configFile=codegen.json
