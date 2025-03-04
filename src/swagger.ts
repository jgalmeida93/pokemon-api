import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import fs from "fs";

const useJsFiles =
  process.env.NODE_ENV === "production" ||
  !fs.existsSync(path.resolve(__dirname, "../src/routes"));
const routesPath = useJsFiles ? "./routes/*.js" : "../src/routes/*.ts";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pokemon API",
      version: "1.0.0",
      description: "API for Pokemon information - Escale test",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: [path.join(__dirname, routesPath)],
};

const specs = swaggerJsdoc(options);
export default specs;
