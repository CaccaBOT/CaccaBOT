import { CollectibleRarity } from "./CollectibleRarity";

export type CollectibleResponse = {
    id: number;        
    name: string;      
    description: string | undefined;
    rarity: CollectibleRarity;      
    assetUrl: string | undefined;    
  };
  