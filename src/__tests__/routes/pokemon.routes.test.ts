import request from "supertest";
import express from "express";
import pokemonRoutes from "../../routes/pokemon.routes";
import pokemonService from "../../services/pokemon.service";
import { ApiError } from "../../middlewares/error.middleware";

jest.mock("../../services/pokemon.service");
const mockedPokemonService = pokemonService as jest.Mocked<
  typeof pokemonService
>;

const app = express();
app.use(express.json());
app.use("/api/pokemon", pokemonRoutes);

describe("Pokemon Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/pokemon", () => {
    test("should return all pokemon", async () => {
      const date1 = new Date("2025-03-02T22:05:39.976Z");
      const date2 = new Date("2025-03-02T21:32:25.850Z");
      const mockPokemonList = [
        {
          id: 1,
          name: "Bulbasaur",
          pokeApiId: null,
          types: null,
          height: null,
          weight: null,
          abilities: null,
          imageUrl: null,
          createdAt: date1,
          updatedAt: date1,
        },
        {
          id: 2,
          name: "Ivysaur",
          pokeApiId: null,
          types: null,
          height: null,
          weight: null,
          abilities: null,
          imageUrl: null,
          createdAt: date2,
          updatedAt: date2,
        },
      ];

      mockedPokemonService.getAll.mockResolvedValue(mockPokemonList);

      const response = await request(app).get("/api/pokemon");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "success",
        data: [
          {
            ...mockPokemonList[0],
            createdAt: date1.toISOString(),
            updatedAt: date1.toISOString(),
          },
          {
            ...mockPokemonList[1],
            createdAt: date2.toISOString(),
            updatedAt: date2.toISOString(),
          },
        ],
      });
      expect(mockedPokemonService.getAll).toHaveBeenCalledTimes(1);
    });
    test("should handle errors", async () => {
      mockedPokemonService.getAll.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).get("/api/pokemon");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: "error",
        message: "Failed to fetch pokemons",
      });
    });
  });

  describe("GET /api/pokemon/:id", () => {
    test("should return a pokemon by id", async () => {
      const dateStr = "2025-03-02T21:32:25.850Z";
      const mockDate = new Date(dateStr);

      const mockPokemon = {
        id: 1,
        name: "Bulbasaur",
        pokeApiId: null,
        types: null,
        height: null,
        weight: null,
        abilities: null,
        imageUrl: null,
        createdAt: mockDate,
        updatedAt: mockDate,
      };
      mockedPokemonService.getById.mockResolvedValue(mockPokemon);

      const response = await request(app).get("/api/pokemon/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "success",
        data: {
          ...mockPokemon,
          createdAt: mockDate.toISOString(),
          updatedAt: mockDate.toISOString(),
        },
      });
      expect(mockedPokemonService.getById).toHaveBeenCalledWith(1);
    });
    test("should return 404 if pokemon not found", async () => {
      mockedPokemonService.getById.mockRejectedValue(
        new ApiError(404, "Pokemon not found")
      );

      const response = await request(app).get("/api/pokemon/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: "error",
        message: "Pokemon not found",
      });
    });
  });

  describe("POST /api/pokemon", () => {
    test("should create a new pokemon", async () => {
      const newPokemon = { name: "Bulbasaur" };
      const mockDate = new Date("2025-03-02T22:01:22.717Z");

      const createdPokemon = {
        id: 1,
        name: "Bulbasaur",
        pokeApiId: null,
        types: null,
        height: null,
        weight: null,
        abilities: null,
        imageUrl: null,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      mockedPokemonService.create.mockResolvedValue(createdPokemon);

      const response = await request(app).post("/api/pokemon").send(newPokemon);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.id).toBe(createdPokemon.id);
      expect(response.body.data.name).toBe(createdPokemon.name);
      expect(mockedPokemonService.create).toHaveBeenCalledWith(newPokemon);
    });
    test("should return 400 if name is missing", async () => {
      const response = await request(app).post("/api/pokemon").send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: "error",
        message: "Name is required",
      });
      expect(mockedPokemonService.create).not.toHaveBeenCalled();
    });
  });
});
