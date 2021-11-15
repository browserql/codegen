# codegen log
===

Using codegen v1.1.2
Scanning for GraphQL files ["/home/pierrot/Dev/perso/browserql/codegen/example/schema"]
# GraphQL files

- /home/pierrot/Dev/perso/browserql/codegen/example/schema/schema.graphql
## Schema

```graphql
type Query {
  hello: String
}

```
## Generating file gen.ts with handler example.ts (arguments: {}, executable: npx ts-node)
  -- (arguments: {}, executable: npx ts-node)
Got unexpected status 1: FAILED

GraphQLError: Syntax Error: Unexpected character: "\".
    at syntaxError (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/error/syntaxError.js:15:10)
    at readNextToken (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:420:40)
    at Lexer.lookahead (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:84:29)
    at Lexer.advance (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:67:38)
    at Parser.expectOptionalToken (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1427:19)
    at Parser.optionalMany (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1505:14)
    at Parser.parseFieldsDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:830:17)
    at Parser.parseObjectTypeDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:802:25)
    at Parser.parseDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:171:23)
    at Parser.many (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1528:26) {
  path: undefined,
  locations: [ { line: 1, column: 13 } ],
  extensions: [Object: null prototype] {}
}

/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/error/syntaxError.js:15
  return new _GraphQLError.GraphQLError(
         ^
GraphQLError: Syntax Error: Unexpected character: "\".
    at syntaxError (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/error/syntaxError.js:15:10)
    at readNextToken (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:420:40)
    at Lexer.lookahead (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:84:29)
    at Lexer.advance (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:67:38)
    at Parser.expectOptionalToken (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1427:19)
    at Parser.optionalMany (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1505:14)
    at Parser.parseFieldsDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:830:17)
    at Parser.parseObjectTypeDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:802:25)
    at Parser.parseDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:171:23)
    at Parser.many (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1528:26) {
  path: undefined,
  locations: [ { line: 1, column: 13 } ],
  extensions: [Object: null prototype] {}
}


Error: Got unexpected status 1: FAILED

GraphQLError: Syntax Error: Unexpected character: "\".
    at syntaxError (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/error/syntaxError.js:15:10)
    at readNextToken (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:420:40)
    at Lexer.lookahead (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:84:29)
    at Lexer.advance (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:67:38)
    at Parser.expectOptionalToken (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1427:19)
    at Parser.optionalMany (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1505:14)
    at Parser.parseFieldsDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:830:17)
    at Parser.parseObjectTypeDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:802:25)
    at Parser.parseDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:171:23)
    at Parser.many (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1528:26) {
  path: undefined,
  locations: [ { line: 1, column: 13 } ],
  extensions: [Object: null prototype] {}
}

/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/error/syntaxError.js:15
  return new _GraphQLError.GraphQLError(
         ^
GraphQLError: Syntax Error: Unexpected character: "\".
    at syntaxError (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/error/syntaxError.js:15:10)
    at readNextToken (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:420:40)
    at Lexer.lookahead (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:84:29)
    at Lexer.advance (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/lexer.js:67:38)
    at Parser.expectOptionalToken (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1427:19)
    at Parser.optionalMany (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1505:14)
    at Parser.parseFieldsDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:830:17)
    at Parser.parseObjectTypeDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:802:25)
    at Parser.parseDefinition (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:171:23)
    at Parser.many (/home/pierrot/Dev/perso/browserql/codegen/node_modules/graphql/language/parser.js:1528:26) {
  path: undefined,
  locations: [ { line: 1, column: 13 } ],
  extensions: [Object: null prototype] {}
}

    at ChildProcess.<anonymous> (/home/pierrot/Dev/perso/browserql/codegen/bin.js:251:64)
    at ChildProcess.emit (node:events:390:28)
    at maybeClose (node:internal/child_process:1064:16)
    at Process.ChildProcess._handle.onexit (node:internal/child_process:301:5)
