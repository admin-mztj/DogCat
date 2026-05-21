export type SceneId = 'home' | 'shop' | 'school' | 'basketball';

export interface SceneArea {
  id: SceneId;
  name: string;
  emoji: string;
}

export const SCENES: SceneArea[] = [
  { id: 'home', name: '家', emoji: '🏠' },
  { id: 'shop', name: '杂货店', emoji: '🏪' },
  { id: 'school', name: '学校', emoji: '🏫' },
  { id: 'basketball', name: '篮球场', emoji: '🏀' }
];

export interface Position {
  x: number;
  y: number;
}

export interface SceneBounds {
  id: SceneId;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function detectScene(petCenter: Position, sceneBounds: SceneBounds[]): SceneId | null {
  for (const scene of sceneBounds) {
    if (
      petCenter.x >= scene.x &&
      petCenter.x <= scene.x + scene.width &&
      petCenter.y >= scene.y &&
      petCenter.y <= scene.y + scene.height
    ) {
      return scene.id;
    }
  }
  return null;
}

export function calculateSceneBounds(windowWidth: number): SceneBounds[] {
  const padding = 12;
  const gap = 12;
  const sceneWidth = (windowWidth - padding * 2 - gap) / 2;
  const sceneHeight = sceneWidth;
  const startY = 140;

  return [
    {
      id: 'home',
      x: padding,
      y: startY,
      width: sceneWidth,
      height: sceneHeight
    },
    {
      id: 'shop',
      x: padding + sceneWidth + gap,
      y: startY,
      width: sceneWidth,
      height: sceneHeight
    },
    {
      id: 'school',
      x: padding,
      y: startY + sceneHeight + gap,
      width: sceneWidth,
      height: sceneHeight
    },
    {
      id: 'basketball',
      x: padding + sceneWidth + gap,
      y: startY + sceneHeight + gap,
      width: sceneWidth,
      height: sceneHeight
    }
  ];
}