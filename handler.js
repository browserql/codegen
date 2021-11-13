'use strict';

const { parse, buildSchema, buildASTSchema } = require('graphql');
const { join } = require('path');

const [, , file, doc] = process.argv;

const { handler } = require(join(process.cwd(), file));

async function run() {
  return await handler({
    source: doc,
    document: parse(doc),
    schema: buildSchema(doc),
    // ast: buildASTSchema(doc),
  });
}

run()
  .then(
    // (output) => `======= codegen =======\n${output}\n======= codegen =======\n`
    (output) =>
      console.log(
        `======= codegen =======\n${output}\n======= codegen =======\n`
      )
  )
  .catch((error) => {
    console.log('FAILED');
    console.log(error);
    throw error;
  });
