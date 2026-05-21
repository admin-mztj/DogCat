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
const CLICK_THRESHOLD = 5;

export function useDraggable(initialPosition: { x: number; y: number }) {
  const [state, setState] = useState<DraggableState>({
    isDragging: false,
    position: initialPosition
  });

  const offset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    setState(prev => {
      if (prev.position.x === initialPosition.x && prev.position.y === initialPosition.y) {
        return prev;
      }
      return {
        ...prev,
        position: initialPosition
      };
    });
  }, [initialPosition]);

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
    startPos.current = { x: clientX, y: clientY };
    hasMoved.current = false;
    setState(prev => ({ ...prev, isDragging: true }));
  }, [state.position]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!state.isDragging) return;
    
    const dx = Math.abs(clientX - startPos.current.x);
    const dy = Math.abs(clientY - startPos.current.y);
    if (dx > CLICK_THRESHOLD || dy > CLICK_THRESHOLD) {
      hasMoved.current = true;
    }
    
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
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const onMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const onMouseLeave = useCallback(() => {
    if (state.isDragging) {
      handleEnd();
    }
  }, [state.isDragging, handleEnd]);

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
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    wasDragging: () => hasMoved.current
  };
}