import { GraphQLServer } from "graphql-yoga";
import { importSchema } from "graphql-import";
import { resolvers } from "./resolvers";
import * as path from "path";
import { createTypeormConnection } from "./utils/createTypeormConnection";

const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));

export const startServer = async () => {
  const server = new GraphQLServer({ typeDefs, resolvers });
  const connection = await createTypeormConnection();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000,
  });
  console.log("Server is running on http://localhost:4000");
  return { app, connection };
};
