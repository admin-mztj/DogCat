import { ArrowLeft } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePet } from '../../context/PetContext';
import { PET_CONFIGS } from '../../data/products';

interface PettingGameProps {
  onBack: () => void;
}

const GAME_DURATION = 10000;
const TARGET_PETS = 50;
const PERFECT_THRESHOLD = 80;

export const PettingGame = ({ onBack }: PettingGameProps) => {
  const { state, playWithPet } = usePet();
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isPerfect, setIsPerfect] = useState(false);
  const [combo, setCombo] = useState(0);
  const [lastPetTime, setLastPetTime] = useState(0);
  
  const petRef = useRef<HTMLDivElement>(null);
  const gameLoop = useRef<number | null>(null);

  const petConfig = PET_CONFIGS[state.pet.type];

  const handlePet = useCallback(() => {
    if (!isPlaying || showResult) return;
    
    const now = Date.now();
    const timeSinceLastPet = now - lastPetTime;
    
    if (timeSinceLastPet < 50) {
      setCombo(prev => prev + 1);
    } else {
      setCombo(1);
    }
    
    setLastPetTime(now);
    setCount(prev => Math.min(prev + 1, TARGET_PETS));
    
    if (count >= PERFECT_THRESHOLD) {
      setIsPerfect(true);
    }

    if (petRef.current) {
      petRef.current.classList.add('pet-pet-effect');
      setTimeout(() => {
        petRef.current?.classList.remove('pet-pet-effect');
      }, 150);
    }
  }, [isPlaying, showResult, count, lastPetTime]);

  useEffect(() => {
    if (isPlaying && !showResult) {
      gameLoop.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 100) {
            setShowResult(true);
            return 0;
          }
          return prev - 100;
        });
      }, 100);
    }

    return () => {
      if (gameLoop.current) {
        clearInterval(gameLoop.current);
      }
    };
  }, [isPlaying, showResult]);

  useEffect(() => {
    if (count >= TARGET_PETS) {
      setShowResult(true);
      if (gameLoop.current) {
        clearInterval(gameLoop.current);
      }
    }
  }, [count]);

  useEffect(() => {
    if (showResult) {
      const moodBonus = isPerfect ? 30 : Math.floor((count / TARGET_PETS) * 25);
      for (let i = 0; i < moodBonus; i += 5) {
        setTimeout(() => playWithPet(), i * 100);
      }
    }
  }, [showResult, isPerfect, count, playWithPet]);

  const startGame = () => {
    setCount(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    setShowResult(false);
    setIsPerfect(false);
    setCombo(0);
    setLastPetTime(0);
  };

  const progress = (count / TARGET_PETS) * 100;
  const timePercent = (timeLeft / GAME_DURATION) * 100;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="font-heading font-bold text-xl text-gray-800">🐾 快速抚摸</h2>
      </div>

      {!isPlaying && !showResult ? (
        <div className="text-center">
          <div 
            ref={petRef}
            className="text-7xl mb-4 cursor-pointer transition-transform hover:scale-110"
            onClick={startGame}
          >
            {petConfig.imageUrl ? (
              <img 
                src={petConfig.imageUrl} 
                alt={petConfig.name}
                className="w-32 h-32 object-contain mx-auto"
              />
            ) : (
              <span>{petConfig.emoji}</span>
            )}
          </div>
          <p className="text-gray-600 mb-4">快速点击宠物进行抚摸！</p>
          <p className="text-sm text-gray-500 mb-6">目标：{TARGET_PETS}次抚摸</p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            开始游戏
          </button>
        </div>
      ) : showResult ? (
        <div className="text-center">
          <div className="text-6xl mb-4">
            {isPerfect ? '🎉' : count >= TARGET_PETS * 0.6 ? '😊' : '💪'}
          </div>
          <h3 className="font-heading font-bold text-xl text-gray-800 mb-2">
            {isPerfect ? '完美！' : count >= TARGET_PETS * 0.6 ? '做得好！' : '继续加油！'}
          </h3>
          <p className="text-gray-600 mb-6">
            抚摸次数: <span className="font-bold text-orange-500">{count}</span> / {TARGET_PETS}
          </p>
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 mb-6">
            <p className="text-green-600 font-bold">
              💚 心情 +{isPerfect ? 30 : Math.floor((count / TARGET_PETS) * 25)}
            </p>
          </div>
          <button
            onClick={() => {
              setShowResult(false);
              setIsPlaying(false);
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            再玩一次
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm text-gray-500">时间</span>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-100 ${timeLeft < 3000 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${timePercent}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">进度</span>
              <p className="font-bold text-xl text-orange-500">{count} / {TARGET_PETS}</p>
            </div>
          </div>

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full transition-all duration-100 ${progress >= 80 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-orange-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div 
            ref={petRef}
            onClick={handlePet}
            className="text-center cursor-pointer select-none"
          >
            <div className={`inline-block transition-transform ${combo >= 5 ? 'scale-110' : ''}`}>
              {petConfig.imageUrl ? (
                <img 
                  src={petConfig.imageUrl} 
                  alt={petConfig.name}
                  className="w-40 h-40 object-contain"
                />
              ) : (
                <span className="text-8xl">{petConfig.emoji}</span>
              )}
            </div>
            <p className="text-gray-600 mt-2">点击抚摸我！</p>
            {combo >= 3 && (
              <p className="text-orange-500 font-bold animate-pulse">🔥 {combo}连击！</p>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsPlaying(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-colors"
            >
              退出游戏
            </button>
          </div>
        </div>
      )}
    </div>
  );
};