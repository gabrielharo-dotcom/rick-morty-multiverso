export interface ResourceReference {
  name: string;
  url: string;
}
export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: ResourceReference;
  location: ResourceReference;
  image: string;
  episode: string[];
  url: string;
  created: string;
}
export interface CharacterResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}
