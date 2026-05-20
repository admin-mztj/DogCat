import { Product } from '../types';

export const PET_CONFIGS = {
  cat: {
    id: 'cat',
    name: '小橘',
    emoji: '🐱',
    color: '#FFB347',
    favoriteFood: '🐟'
  },
  dog: {
    id: 'dog',
    name: '旺财',
    emoji: '🐕',
    color: '#8B4513',
    favoriteFood: '🍖'
  }
};

export const PRODUCTS: Product[] = [
  {
    id: 'fish',
    name: '小鱼干',
    emoji: '🐟',
    price: 10,
    category: 'food',
    effect: { hunger: 20 },
    applicablePets: ['cat']
  },
  {
    id: 'cat-food',
    name: '猫粮',
    emoji: '🍚',
    price: 20,
    category: 'food',
    effect: { hunger: 40 },
    applicablePets: ['cat']
  },
  {
    id: 'cat-can',
    name: '高级罐头',
    emoji: '🥫',
    price: 50,
    category: 'food',
    effect: { hunger: 80 },
    applicablePets: ['cat']
  },
  {
    id: 'bone',
    name: '骨头',
    emoji: '🍖',
    price: 10,
    category: 'food',
    effect: { hunger: 20 },
    applicablePets: ['dog']
  },
  {
    id: 'dog-food',
    name: '狗粮',
    emoji: '🍖',
    price: 20,
    category: 'food',
    effect: { hunger: 40 },
    applicablePets: ['dog']
  },
  {
    id: 'dog-can',
    name: '肉罐头',
    emoji: '🥫',
    price: 50,
    category: 'food',
    effect: { hunger: 80 },
    applicablePets: ['dog']
  },
  {
    id: 'feather',
    name: '逗猫棒',
    emoji: '🪶',
    price: 30,
    category: 'toy',
    effect: { mood: 30 },
    applicablePets: ['cat']
  },
  {
    id: 'ball',
    name: '小球',
    emoji: '⚽',
    price: 30,
    category: 'toy',
    effect: { mood: 30 },
    applicablePets: ['dog']
  },
  {
    id: 'love',
    name: '爱心',
    emoji: '❤️',
    price: 100,
    category: 'toy',
    effect: { hunger: 50, mood: 50 },
    applicablePets: ['cat', 'dog']
  }
];

export const getProductsByCategory = (category: string, petType: string) => {
  return PRODUCTS.filter(p => 
    (category === 'all' || p.category === category) && p.applicablePets.includes(petType as any)
  );
};
