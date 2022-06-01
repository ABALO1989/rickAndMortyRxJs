/* Defines the supplier entity */
export interface Supplier {
  id: number;
  name: string;
  cost: number;
  minQuantity: number;
}

export interface Episode {
  id: number,
  name: string,
  episode: string,

}

export interface ApiEpisode{
  info: object;
  results: Episode[];
}
