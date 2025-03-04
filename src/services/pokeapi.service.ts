import axios from "axios";
import { ApiError } from "../middlewares/error.middleware";

export interface PokemonData {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  sprites: {
    front_default: string;
    [key: string]: any;
  };
}

class PokeApiService {
  private baseUrl = "https://pokeapi.co/api/v2";

  async getPokemonByNameOrId(nameOrId: string | number): Promise<PokemonData> {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/pokemon/${nameOrId.toString().toLowerCase()}`
      );

      return {
        id: data.id,
        name: data.name,
        types: data.types.map((t: any) => t.type.name),
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map((a: any) => a.ability.name),
        sprites: data.sprites,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new ApiError(404, `Pokemon "${nameOrId}" not found in PokeAPI`);
      }
      console.error(
        `Error fetching pokemon "${nameOrId}" from PokeAPI:`,
        error
      );
      throw new ApiError(500, "Failed to fetch data from PokeAPI");
    }
  }
}

export default new PokeApiService();
