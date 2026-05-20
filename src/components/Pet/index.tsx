import { useState, useEffect, useCallback } from 'react';
import { usePetState } from '../../hooks/usePetState';
import { useDraggable } from '../../hooks/useDraggable';
import { PET_CONFIGS } from '../../data/products';
import { getPetEmotion } from '../../utils/helpers';

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
        top: position.y,
        width: 100,
        height: 100,
        transition: isDragging ? 'none' : 'all 0.1s ease-out'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onClick={handleClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute -bottom-2 w-16 h-4 bg-black/10 rounded-full blur-sm" />
        <div 
          className={`relative text-7xl transition-transform ${isBlinking ? 'scale-y-10' : ''}`}
          style={{ transformOrigin: 'center bottom' }}
        >
          {petConfig.emoji}
        </div>
        <div className="absolute -top-8 text-2xl animate-pulse">
          {emotion}
        </div>
      </div>
    </div>
  );
};
