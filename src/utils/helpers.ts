import { GameState, PetState, StoredData } from '../types';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function validatePetState(state: PetState): PetState {
  return {
    ...state,
    hunger: clamp(state.hunger, 0, 100),
    mood: clamp(state.mood, 0, 100),
    coins: Math.max(0, state.coins)
  };
}

export function validateStoredData(data: unknown): data is StoredData {
  if (typeof data !== 'object' || data === null) return false;
  
  const d = data as StoredData;
  return (
    typeof d.petType === 'string' && ['cat', 'dog'].includes(d.petType) &&
    typeof d.hunger === 'number' && d.hunger >= 0 && d.hunger <= 100 &&
    typeof d.mood === 'number' && d.mood >= 0 && d.mood <= 100 &&
    typeof d.coins === 'number' && d.coins >= 0 &&
    typeof d.position === 'object' && d.position !== null &&
    typeof d.position.x === 'number' &&
    typeof d.position.y === 'number'
  );
}

export function getStatusColor(value: number): string {
  if (value > 70) return 'bg-green-400';
  if (value > 30) return 'bg-yellow-400';
  return 'bg-red-400';
}

export function getStatusTextColor(value: number): string {
  if (value > 70) return 'text-green-600';
  if (value > 30) return 'text-yellow-600';
  return 'text-red-600';
}

export function getPetEmotion(hunger: number, mood: number): string {
  if (hunger > 70 && mood > 70) return '😊';
  if (hunger > 30 && mood > 30) return '😐';
  if (hunger < 30 && mood < 30) return '😢';
  if (hunger > 70 && mood < 30) return '😕';
  if (hunger < 30 && mood > 70) return '🤤';
  return '😐';
}

export function getInitialState(): GameState {
  return {
    pet: {
      type: 'cat',
      hunger: 70,
      mood: 80,
      coins: 100,
      position: { x: 50, y: 50 }
    },
    backpack: [],
    lastFeedTime: Date.now(),
    lastPlayTime: Date.now(),
    playCount: 0,
    lastPlayDate: ''
  };
}
