import { NextFunction, Request, Response } from "express";
import pokemonController from "../../controllers/pokemon.controller";
import pokemonService from "../../services/pokemon.service";
import { ApiError } from "../../middlewares/error.middleware";

jest.mock("../../services/pokemon.service");
const mockedPokemonService = pokemonService as jest.Mocked<
  typeof pokemonService
>;

describe("Pokemon Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    responseObject = {};

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
      send: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe("getAll", () => {
    test("should return all pokemon with status 200", async () => {
      const mockPokemonList = [
        {
          id: 1,
          name: "Bulbasaur",
          types: "Grass,Poison", // String, not array
          pokeApiId: null,
          height: null,
          weight: null,
          abilities: null,
          imageUrl: null,
          createdAt: new Date("2025-03-02T21:29:13.948Z"),
          updatedAt: new Date("2025-03-02T21:29:13.948Z"),
        },
        {
          id: 2,
          name: "Ivysaur",
          types: null,
          pokeApiId: null,
          height: null,
          weight: null,
          abilities: null,
          imageUrl: null,
          createdAt: new Date("2025-03-02T21:29:13.948Z"),
          updatedAt: new Date("2025-03-02T21:29:13.948Z"),
        },
      ];

      mockedPokemonService.getAll.mockResolvedValue(mockPokemonList);

      const mockNext = jest.fn();

      await pokemonController.getAll(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockedPokemonService.getAll).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        status: "success",
        data: mockPokemonList,
      });
    });
    test("should handle errors and return status 500", async () => {
      const error = new Error("Database error");
      mockedPokemonService.getAll.mockRejectedValue(error);
      const mockNext = jest.fn();

      await pokemonController.getAll(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockedPokemonService.getAll).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toEqual({
        status: "error",
        message: "Failed to fetch pokemons",
      });
    });
  });

  describe("getById", () => {
    test("should return pokemon by id with status 200", async () => {
      const mockPokemon = {
        id: 1,
        name: "Bulbasaur",
        pokeApiId: null,
        types: "Grass",
        height: null,
        weight: null,
        abilities: null,
        imageUrl: null,
        createdAt: new Date("2025-03-02T21:29:13.948Z"),
        updatedAt: new Date("2025-03-02T21:29:13.948Z"),
      };
      mockRequest.params = { id: "1" };

      mockedPokemonService.getById.mockResolvedValue(mockPokemon);
      const mockNext = jest.fn();

      await pokemonController.getById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockedPokemonService.getById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        status: "success",
        data: mockPokemon,
      });
    });

    test("should return 404 when pokemon not found", async () => {
      mockRequest.params = { id: "999" };

      const notFoundError = new ApiError(404, "Pokemon not found");
      mockedPokemonService.getById.mockRejectedValue(notFoundError);
      const mockNext = jest.fn();

      await pokemonController.getById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockedPokemonService.getById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({
        status: "error",
        message: "Pokemon not found",
      });
    });
  });

  describe("create", () => {
    test("should create pokemon and return status 201", async () => {
      const mockPokemon = {
        id: 1,
        name: "Bulbasaur",
        pokeApiId: null,
        types: "Grass,Poison",
        height: null,
        weight: null,
        abilities: null,
        imageUrl: null,
        createdAt: new Date("2025-03-02T21:29:13.948Z"),
        updatedAt: new Date("2025-03-02T21:29:13.948Z"),
      };
      mockRequest.body = { name: "Bulbasaur" };

      mockedPokemonService.create.mockResolvedValue(mockPokemon);
      const mockNext = jest.fn();

      await pokemonController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockedPokemonService.create).toHaveBeenCalledWith({
        name: "Bulbasaur",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toEqual({
        status: "success",
        data: mockPokemon,
      });
    });
    test("should return 400 when name is missing", async () => {
      mockRequest.body = {};
      const mockNext = jest.fn();

      await pokemonController.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockedPokemonService.create).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        status: "error",
        message: "Name is required",
      });
    });
  });

  describe("update", () => {
    test("should update pokemon and return status 200", async () => {
      const mockPokemon = {
        id: 1,
        name: "Bulbasaur Updated",
        types: "Grass,Poison",
        pokeApiId: null,
        height: null,
        weight: null,
        abilities: null,
        imageUrl: null,
        createdAt: new Date("2025-03-02T21:32:25.850Z"),
        updatedAt: new Date("2025-03-02T21:32:25.850Z"),
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = {
        name: "Bulbasaur Updated",
        types: "Grass,Poison",
      };
      const mockNext = jest.fn();

      mockedPokemonService.update.mockResolvedValue(mockPokemon);

      await pokemonController.update(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockedPokemonService.update).toHaveBeenCalledWith(1, {
        name: "Bulbasaur Updated",
        types: "Grass,Poison",
        height: undefined,
        weight: undefined,
        abilities: undefined,
        imageUrl: undefined,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        status: "success",
        data: mockPokemon,
      });
    });
  });

  describe("delete", () => {
    test("should delete pokemon and return status 204", async () => {
      mockRequest.params = { id: "1" };
      const mockNext = jest.fn();

      mockedPokemonService.delete.mockResolvedValue(true);

      await pokemonController.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockedPokemonService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
    test("should return 400 for invalid id format", async () => {
      mockRequest.params = { id: "invalid" };
      const mockNext = jest.fn();

      await pokemonController.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      );

      expect(mockedPokemonService.delete).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        status: "error",
        message: "Invalid ID format",
      });
    });
  });
});
