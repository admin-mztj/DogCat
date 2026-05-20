import { GameState, StoredData } from '../types';
import { getInitialState, validateStoredData } from '../utils/helpers';

const STORAGE_KEY = 'pet_desktop_pet_data';

export function loadState(): GameState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (validateStoredData(data)) {
        return transformStoredData(data);
      }
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return getInitialState();
}

export function saveState(state: GameState): void {
  try {
    const data = transformToStoredData(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function transformStoredData(data: StoredData): GameState {
  return {
    pet: {
      type: data.petType || 'cat',
      hunger: data.hunger || 70,
      mood: data.mood || 80,
      coins: data.coins || 100,
      position: data.position || { x: 50, y: 50 }
    },
    backpack: data.backpack || [],
    lastFeedTime: data.lastUpdateTime || Date.now(),
    lastPlayTime: data.lastUpdateTime || Date.now()
  };
}

function transformToStoredData(state: GameState): StoredData {
  return {
    petType: state.pet.type,
    hunger: state.pet.hunger,
    mood: state.pet.mood,
    coins: state.pet.coins,
    position: state.pet.position,
    backpack: state.backpack,
    lastUpdateTime: Date.now()
  };
}
