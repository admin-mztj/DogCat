import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GameState, PetType } from '../types';
import { PRODUCTS } from '../data/products';
import { loadState, saveState } from '../hooks/useStorage';

const HUNGER_DECREASE_RATE = 1 / 60;
const MOOD_AFFECT_HUNGRY = 0.5;
const MOOD_RECOVER_RATE = 0.1;

interface PetContextType {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  switchPet: (type: PetType) => void;
  feedPet: (productId: string) => void;
  playWithPet: () => void;
  purchaseProduct: (productId: string) => void;
  updatePosition: (x: number, y: number) => void;
  addCoins: (amount: number) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => updateState(prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateState = (prev: GameState): GameState => {
    const now = Date.now();
    const timeDelta = (now - prev.lastFeedTime) / 1000;
    
    let newHunger = Math.max(0, prev.pet.hunger - HUNGER_DECREASE_RATE * timeDelta);
    let newMood = prev.pet.mood;
    
    if (newHunger < 30) {
      newMood = Math.max(0, newMood - MOOD_AFFECT_HUNGRY * timeDelta);
    } else if (newHunger > 70) {
      newMood = Math.min(100, newMood + MOOD_RECOVER_RATE * timeDelta);
    }
    
    return {
      ...prev,
      pet: {
        ...prev.pet,
        hunger: Math.round(newHunger),
        mood: Math.round(newMood)
      },
      lastFeedTime: now
    };
  };

  const switchPet = useCallback((type: PetType) => {
    setState(prev => ({
      ...prev,
      pet: {
        ...prev.pet,
        type
      }
    }));
  }, []);

  const feedPet = useCallback((productId: string) => {
    setState(prev => {
      const item = prev.backpack.find(i => i.productId === productId);
      if (!item || item.quantity <= 0) return prev;
      
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return prev;
      
      const newHunger = Math.min(100, prev.pet.hunger + (product.effect.hunger || 0));
      const newMood = Math.min(100, prev.pet.mood + (product.effect.mood || 0));
      
      const newBackpack = prev.backpack.map(i => 
        i.productId === productId 
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ).filter(i => i.quantity > 0);
      
      return {
        ...prev,
        pet: {
          ...prev.pet,
          hunger: newHunger,
          mood: newMood
        },
        backpack: newBackpack,
        lastFeedTime: Date.now()
      };
    });
  }, []);

  const playWithPet = useCallback(() => {
    setState(prev => ({
      ...prev,
      pet: {
        ...prev.pet,
        mood: Math.min(100, prev.pet.mood + 20)
      },
      lastPlayTime: Date.now()
    }));
  }, []);

  const purchaseProduct = useCallback((productId: string) => {
    setState(prev => {
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product || prev.pet.coins < product.price) return prev;
      
      if (!product.applicablePets.includes(prev.pet.type)) return prev;
      
      const newCoins = prev.pet.coins - product.price;
      
      const existingItem = prev.backpack.find(i => i.productId === productId);
      let newBackpack;
      
      if (existingItem) {
        newBackpack = prev.backpack.map(i => 
          i.productId === productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newBackpack = [...prev.backpack, { productId, quantity: 1 }];
      }
      
      return {
        ...prev,
        pet: {
          ...prev.pet,
          coins: newCoins
        },
        backpack: newBackpack
      };
    });
  }, []);

  const updatePosition = useCallback((x: number, y: number) => {
    setState(prev => {
      if (prev.pet.position.x === x && prev.pet.position.y === y) {
        return prev;
      }
      return {
        ...prev,
        pet: {
          ...prev.pet,
          position: { x, y }
        }
      };
    });
  }, []);

  const addCoins = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      pet: {
        ...prev.pet,
        coins: prev.pet.coins + amount
      }
    }));
  }, []);

  return (
    <PetContext.Provider value={{
      state,
      setState,
      switchPet,
      feedPet,
      playWithPet,
      purchaseProduct,
      updatePosition,
      addCoins
    }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePet() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
}
