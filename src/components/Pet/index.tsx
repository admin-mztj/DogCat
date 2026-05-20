import { useState, useEffect, useCallback } from 'react';
import { usePetState } from '../../hooks/usePetState';
import { useDraggable } from '../../hooks/useDraggable';
import { PET_CONFIGS } from '../../data/products';
import { getPetEmotion, getStatusColor } from '../../utils/helpers';

interface PetProps {
  onInteraction?: () => void;
}

export const Pet = ({ onInteraction }: PetProps) => {
  const { state, updatePosition } = usePetState();
  const [isBlinking, setIsBlinking] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  
  const {
    isDragging,
    position,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown
  } = useDraggable(state.pet.position);

  useEffect(() => {
    updatePosition(position.x, position.y);
  }, [position, updatePosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && !isDragging) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isDragging]);

  const handleClick = useCallback(() => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);
    onInteraction?.();
  }, [onInteraction]);

  const petConfig = PET_CONFIGS[state.pet.type];
  const emotion = getPetEmotion(state.pet.hunger, state.pet.mood);
  const isHungry = state.pet.hunger < 30;
  
  let petClass = 'pet pet-float';
  if (isBouncing) petClass += ' pet-bounce';
  if (isHungry) petClass += ' pet-shake';

  return (
    <div
      className={`${petClass} fixed cursor-move z-50`}
      style={{
        left: position.x,
        top: position.y + 40,
        width: 120,
        height: 140,
        transition: isDragging ? 'none' : 'all 0.1s ease-out'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onClick={handleClick}
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
        
        <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
          <div className="absolute bottom-0 w-16 h-4 bg-black/10 rounded-full blur-sm" />
          <div 
            className={`relative text-7xl transition-transform ${isBlinking ? 'scale-y-10' : ''}`}
            style={{ transformOrigin: 'center bottom' }}
          >
            {petConfig.emoji}
          </div>
          <div className="absolute -top-2 text-xl animate-pulse">
            {emotion}
          </div>
        </div>
      </div>
    </div>
  );
};
