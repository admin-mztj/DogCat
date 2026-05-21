import { useState, useEffect, useCallback, useRef } from 'react';
import { usePet } from '../../context/PetContext';
import { useDraggable } from '../../hooks/useDraggable';
import { PET_CONFIGS } from '../../data/products';
import { getPetEmotion, getStatusColor } from '../../utils/helpers';
import type { SceneId } from '../../utils/sceneDetector';

interface PetProps {
  onInteraction?: () => void;
}

export const Pet = ({ onInteraction }: PetProps) => {
  const { state, updatePosition, setState, playWithPet, addCoins } = usePet();
  const [, setIsBlinking] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [actionText, setActionText] = useState('');
  const petRef = useRef<HTMLDivElement>(null);

  const {
    isDragging,
    position,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    wasDragging
  } = useDraggable(state.pet.position);

  useEffect(() => {
    updatePosition(position.x, position.y);
  }, [position, updatePosition]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7 && !isDragging) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, [isDragging]);

  const performSceneAction = useCallback((sceneId: SceneId) => {
    const actions: Record<SceneId, { text: string; action: () => void }> = {
      home: {
        text: '💤 睡觉中...',
        action: () => {
          setState(prev => ({
            ...prev,
            pet: {
              ...prev.pet,
              mood: Math.min(100, prev.pet.mood + 15),
              hunger: Math.max(0, prev.pet.hunger - 5)
            }
          }));
        }
      },
      shop: {
        text: '💰 打工赚钱中...',
        action: () => {
          addCoins(20);
          setState(prev => ({
            ...prev,
            pet: {
              ...prev.pet,
              mood: Math.max(0, prev.pet.mood - 10),
              hunger: Math.max(0, prev.pet.hunger - 10)
            }
          }));
        }
      },
      school: {
        text: '📚 学习中...',
        action: () => {
          setState(prev => ({
            ...prev,
            pet: {
              ...prev.pet,
              mood: Math.max(0, prev.pet.mood - 5),
              hunger: Math.max(0, prev.pet.hunger - 8)
            }
          }));
        }
      },
      basketball: {
        text: '🏀 打篮球中...',
        action: () => {
          playWithPet();
          playWithPet();
          setState(prev => ({
            ...prev,
            pet: {
              ...prev.pet,
              hunger: Math.max(0, prev.pet.hunger - 15)
            }
          }));
        }
      }
    };

    const action = actions[sceneId];
    if (action) {
      setCurrentAction(sceneId);
      setActionText(action.text);
      action.action();
    }
  }, [setState, addCoins, playWithPet]);

  useEffect(() => {
    if (!currentAction || isDragging) return;

    const sceneActionInterval = setInterval(() => {
      performSceneAction(currentAction as SceneId);
    }, 3000);

    return () => clearInterval(sceneActionInterval);
  }, [currentAction, isDragging, performSceneAction]);

  const handleRelease = useCallback(() => {
    if (!wasDragging()) {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 500);
      onInteraction?.();
    } else {
      const statusBarHeight = 100;
      const padding = 8;
      const gap = 8;
      const sceneWidth = (window.innerWidth - padding * 2 - gap) / 2;
      const sceneHeight = (window.innerHeight - statusBarHeight - 140) / 2;
      
      const sceneBounds = [
        { id: 'home', x: padding, y: statusBarHeight, width: sceneWidth, height: sceneHeight },
        { id: 'shop', x: padding + sceneWidth + gap, y: statusBarHeight, width: sceneWidth, height: sceneHeight },
        { id: 'school', x: padding, y: statusBarHeight + sceneHeight + gap, width: sceneWidth, height: sceneHeight },
        { id: 'basketball', x: padding + sceneWidth + gap, y: statusBarHeight + sceneHeight + gap, width: sceneWidth, height: sceneHeight }
      ] as { id: SceneId; x: number; y: number; width: number; height: number }[];
      
      const petCenter = {
        x: position.x + 80,
        y: position.y + 60
      };
      
      const detectedScene = sceneBounds.find(scene => 
        petCenter.x >= scene.x &&
        petCenter.x <= scene.x + scene.width &&
        petCenter.y >= scene.y &&
        petCenter.y <= scene.y + scene.height
      )?.id;
      
      if (detectedScene) {
        performSceneAction(detectedScene);
      } else {
        setCurrentAction(null);
        setActionText('');
      }
    }
  }, [onInteraction, wasDragging, position, performSceneAction]);

  const petConfig = PET_CONFIGS[state.pet.type];
  const emotion = getPetEmotion(state.pet.hunger, state.pet.mood);
  const isHungry = state.pet.hunger < 30;
  
  let petClass = 'pet';
  if (!isDragging && !currentAction) petClass += ' pet-float';
  if (isBouncing) petClass += ' pet-bounce';
  if (isHungry && !isDragging) petClass += ' pet-shake';

  return (
    <div
      ref={petRef}
      className={`${petClass} fixed cursor-move z-50 select-none`}
      style={{
        left: position.x,
        top: position.y + 40,
        width: 160,
        height: 200
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={() => { onTouchEnd(); handleRelease(); }}
      onMouseDown={onMouseDown}
      onMouseUp={() => { onMouseUp(); handleRelease(); }}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative w-full h-full flex flex-col items-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-2 w-full mb-2 border border-gray-100">
          <div className="text-xs font-heading font-bold text-gray-700 text-center mb-1.5">
            {petConfig.emoji} {petConfig.name}
          </div>
          
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-gray-600">饥饿</span>
                <span className="text-gray-700 font-bold">{state.pet.hunger}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStatusColor(state.pet.hunger)} transition-all duration-300`}
                  style={{ width: `${state.pet.hunger}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-gray-600">心情</span>
                <span className="text-gray-700 font-bold">{state.pet.mood}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStatusColor(state.pet.mood)} transition-all duration-300`}
                  style={{ width: `${state.pet.mood}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {petConfig.imageUrl ? (
            <img
              src={petConfig.imageUrl}
              alt={petConfig.name}
              className={`w-28 h-28 object-contain transition-transform duration-300 ${isDragging ? 'scale-110' : 'scale-100'}`}
            />
          ) : (
            <span className={`text-7xl transition-transform duration-300 ${isDragging ? 'scale-110' : 'scale-100'}`}>
              {emotion}
            </span>
          )}
          
          {currentAction && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap animate-pulse">
              {actionText}
            </div>
          )}
        </div>
        
        <div className="w-20 h-5 bg-gray-300/50 rounded-full mt-2 blur-sm" />
      </div>
    </div>
  );
};