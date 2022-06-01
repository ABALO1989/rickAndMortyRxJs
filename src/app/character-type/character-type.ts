
export interface CharacterType {
  name: string;
  type: string;
  dimension: string;
  
}
 

export interface apiType{
  info: object;
  results: CharacterType[];
}
  
