import { DocumentNode, GraphQLSchema } from 'graphql';

interface Schema {
  source: string;
  document: DocumentNode;
  schema: GraphQLSchema;
}

export async function handler({ source }: Schema) {
  return `import { gql } from '@apollo/client';

export const SCHEMA = gql\`
${source}
\`;
`;
}
