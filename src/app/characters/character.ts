
export interface Character{
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  location: {name: string, url: string}
  typeLocation?: string;
  supplierIds?: number[];
  
}

export interface Iapi{
  info: object;
  results: Character[];
}
  



