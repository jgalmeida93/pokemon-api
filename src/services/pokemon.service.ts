import { PrismaClient } from "@prisma/client";
import { ApiError } from "../middlewares/error.middleware";
import pokeApiService, { PokemonData } from "./pokeapi.service";

interface CreatePokemonDto {
  name: string;
  types?: string[];
  height?: number;
  weight?: number;
  abilities?: string[];
  imageUrl?: string;
}

interface UpdatePokemonDto {
  name?: string;
  types?: string[];
  height?: number;
  weight?: number;
  abilities?: string[];
  imageUrl?: string;
}

const prisma = new PrismaClient();

class PokemonService {
  async getAll() {
    try {
      return await prisma.pokemon.findMany({
        orderBy: { id: "desc" },
      });
    } catch (error) {
      console.error("Error in getAll:", error);
      throw new ApiError(500, "Database error while fetching pokemons");
    }
  }
  async getById(id: number) {
    try {
      const pokemon = await prisma.pokemon.findUnique({
        where: { id },
      });

      if (!pokemon) {
        throw new ApiError(404, `Pokemon with ID ${id} not found`);
      }

      return pokemon;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error(`Error in getById for ID ${id}:`, error);
      throw new ApiError(500, "Database error while fetching pokemon");
    }
  }

  async create(data: CreatePokemonDto) {
    try {
      const pokeApiData = await pokeApiService.getPokemonByNameOrId(data.name);

      const existingPokemon = await prisma.pokemon.findFirst({
        where: { pokeApiId: pokeApiData.id },
      });

      if (existingPokemon) {
        throw new ApiError(
          409,
          `Pokemon with PokeAPI ID ${pokeApiData.id} already exists in the database`
        );
      }

      const type = data.types
        ? data.types.join(",")
        : pokeApiData.types.join(",");

      const abilities = data.abilities
        ? data.abilities.join(",")
        : pokeApiData.abilities.join(",");

      return await prisma.pokemon.create({
        data: {
          name: data.name,
          pokeApiId: pokeApiData.id,
          types: type,
          height: data.height !== undefined ? data.height : pokeApiData.height,
          weight: data.weight !== undefined ? data.weight : pokeApiData.weight,
          abilities: abilities,
          imageUrl: data.imageUrl || pokeApiData.sprites.front_default,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error("Error in create:", error);
      throw new ApiError(500, "Failed to create Pokemon");
    }
  }
  async update(id: number, data: UpdatePokemonDto) {
    try {
      const existingPokemon = await this.getById(id);
      const updateData: any = {};

      const type = Array.isArray(data.types)
        ? data.types.join(",")
        : data.types;

      const abilities = Array.isArray(data.abilities)
        ? data.abilities.join(",")
        : data.abilities;

      let pokeApiData: PokemonData | null = null;
      if (data.name && data.name !== existingPokemon.name) {
        try {
          pokeApiData = await pokeApiService.getPokemonByNameOrId(data.name);
          updateData.name = data.name;
          updateData.pokeApiId = pokeApiData.id;
        } catch (error) {
          console.warn(`Pokemon "${data.name}" not found in PokeAPI`);
          throw new ApiError(
            404,
            `Pokemon "${data.name}" not found in PokeAPI`
          );
        }
      } else if (data.name) {
        updateData.name = data.name;
      }

      if (data.types) {
        updateData.types = type;
      }

      if (data.height !== undefined) {
        updateData.height = data.height;
      } else if (pokeApiData?.height) {
        updateData.height = pokeApiData.height;
      }

      if (data.weight !== undefined) {
        updateData.weight = data.weight;
      } else if (pokeApiData?.weight) {
        updateData.weight = pokeApiData.weight;
      }

      if (data.abilities) {
        updateData.abilities = abilities;
      }

      if (data.imageUrl) {
        updateData.imageUrl = data.imageUrl;
      } else if (pokeApiData?.sprites?.front_default) {
        updateData.imageUrl = pokeApiData.sprites.front_default;
      }

      if (Object.keys(updateData).length === 0) {
        return existingPokemon;
      }

      return await prisma.pokemon.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error(`Error in update for ID ${id}:`, error);
      throw new ApiError(500, "Failed to update Pokemon");
    }
  }
  async delete(id: number) {
    try {
      await this.getById(id);

      await prisma.pokemon.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error(`Error in delete for ID ${id}:`, error);
      throw new ApiError(500, "Failed to delete Pokemon");
    }
  }
}

export default new PokemonService();
