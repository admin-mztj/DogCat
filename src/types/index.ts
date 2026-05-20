export type PetType = 'cat' | 'dog';

export interface PetConfig {
  id: PetType;
  name: string;
  emoji: string;
  color: string;
  favoriteFood: string;
}

export interface PetState {
  type: PetType;
  hunger: number;
  mood: number;
  coins: number;
  position: { x: number; y: number };
}

export interface Product {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: 'food' | 'toy' | 'decoration';
  effect: {
    hunger?: number;
    mood?: number;
  };
  applicablePets: PetType[];
}

export interface BackpackItem {
  productId: string;
  quantity: number;
}

export interface GameState {
  pet: PetState;
  backpack: BackpackItem[];
  lastFeedTime: number;
  lastPlayTime: number;
}

export interface StoredData {
  petType: PetType;
  hunger: number;
  mood: number;
  coins: number;
  position: { x: number; y: number };
  backpack: BackpackItem[];
  lastUpdateTime: number;
}
