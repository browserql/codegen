'use strict';

const { parse, buildSchema, buildASTSchema } = require('graphql');
const { join } = require('path');

const [, , file, doc, _args = '{}'] = process.argv;

const { handler } = require(join(process.cwd(), file));

// function parseDoc(doc) {
//   try {
//     parse(doc)
//     return doc
//   } catch (error) {
//     if (/Unknown type/.test(error.message)) {
//       const type = error.message.replace(/Unknown type "(.+)"\./)
//       return parseDoc(doc.concat(`\nscalar $`))
//     }
//   }
// }

async function run() {
  const args = JSON.parse(_args);
  return await handler({
    source: doc,
    document: parse(doc),
    schema: buildSchema(doc, { assumeValid: true }),
    // ast: buildASTSchema(doc),
    arguments: args,
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
