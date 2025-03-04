import { Request, Response, RequestHandler } from "express";
import { ApiError } from "../middlewares/error.middleware";
import pokemonService from "../services/pokemon.service";

const getAll: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pokemons = await pokemonService.getAll();
    res.status(200).json({
      status: "success",
      data: pokemons,
    });
  } catch (error) {
    console.error("Error fetching all pokemons:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch pokemons",
    });
  }
};
const getById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({
      status: "error",
      message: "Invalid ID format",
    });
    return;
  }

  try {
    const pokemon = await pokemonService.getById(id);
    res.status(200).json({
      status: "success",
      data: pokemon,
    });
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      res.status(404).json({
        status: "error",
        message: error.message,
      });
    } else {
      console.error(`Error fetching pokemon with ID ${id}:`, error);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch pokemon",
      });
    }
  }
};
const create: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, types, height, weight, abilities, imageUrl } = req.body;

  if (!name) {
    res.status(400).json({
      status: "error",
      message: "Name is required",
    });
    return;
  }

  try {
    const pokemon = await pokemonService.create({
      name,
      types,
      height,
      weight,
      abilities,
      imageUrl,
    });

    res.status(201).json({
      status: "success",
      data: pokemon,
    });
  } catch (error) {
    console.error("Error creating pokemon:", error);

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to create pokemon",
      });
    }
  }
};

const update: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, types, height, weight, abilities, imageUrl } = req.body;

  if (isNaN(id)) {
    res.status(400).json({
      status: "error",
      message: "Invalid ID format",
    });
    return;
  }

  try {
    const pokemon = await pokemonService.update(id, {
      name,
      types,
      height,
      weight,
      abilities,
      imageUrl,
    });

    res.status(200).json({
      status: "success",
      data: pokemon,
    });
  } catch (error) {
    console.error(`Error updating pokemon with ID ${id}:`, error);

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to update pokemon",
      });
    }
  }
};
const deleteById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({
      status: "error",
      message: "Invalid ID format",
    });
    return;
  }

  try {
    await pokemonService.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting pokemon with ID ${id}:`, error);

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to delete pokemon",
      });
    }
  }
};
export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteById,
};
