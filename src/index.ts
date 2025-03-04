import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pokemonRoutes from "./routes/pokemon.routes";
import errorMiddleware from "./middlewares/error.middleware";
import swaggerUI from "swagger-ui-express";
import swaggerDocs from "./swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/api/pokemon", pokemonRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
