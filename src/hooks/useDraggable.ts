import { useState, useRef, useCallback, useEffect } from 'react';
import { clamp } from '../utils/helpers';

interface DraggableState {
  isDragging: boolean;
  position: { x: number; y: number };
}

const PET_WIDTH = 100;
const PET_HEIGHT = 100;
const STATUS_BAR_HEIGHT = 60;
const ACTION_BAR_HEIGHT = 80;

export function useDraggable(initialPosition: { x: number; y: number }) {
  const [state, setState] = useState<DraggableState>({
    isDragging: false,
    position: initialPosition
  });

  const offset = useRef({ x: 0, y: 0 });

  const getValidPosition = useCallback((x: number, y: number) => {
    const maxX = window.innerWidth - PET_WIDTH;
    const maxY = window.innerHeight - PET_HEIGHT - ACTION_BAR_HEIGHT;
    
    return {
      x: clamp(x, 0, maxX),
      y: clamp(y, STATUS_BAR_HEIGHT, maxY)
    };
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    offset.current = {
      x: clientX - state.position.x,
      y: clientY - state.position.y
    };
    setState(prev => ({ ...prev, isDragging: true }));
  }, [state.position]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!state.isDragging) return;
    
    const newX = clientX - offset.current.x;
    const newY = clientY - offset.current.y;
    
    setState(prev => ({
      ...prev,
      position: getValidPosition(newX, newY)
    }));
  }, [state.isDragging, getValidPosition]);

  const handleEnd = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const onMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener('mousemove', onMouseMove as any);
      window.addEventListener('mouseup', onMouseUp);
      return () => {
        window.removeEventListener('mousemove', onMouseMove as any);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [state.isDragging, onMouseMove, onMouseUp]);

  return {
    isDragging: state.isDragging,
    position: state.position,
    onTouchStart,
    onTouchMove,
    onTouchEnd: handleEnd,
    onMouseDown
  };
}
