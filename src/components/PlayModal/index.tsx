import { X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { PettingGame } from './PettingGame';
import { RockPaperScissors } from './RockPaperScissors';
import { usePet } from '../../context/PetContext';
import { PET_CONFIGS } from '../../data/products';

interface PlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameType = 'select' | 'petting' | 'rps';

const MAX_PLAY_COUNT = 10;

export const PlayModal = ({ isOpen, onClose }: PlayModalProps) => {
  const [currentGame, setCurrentGame] = useState<GameType>('select');
  const { state, setState } = usePet();
  
  const petConfig = PET_CONFIGS[state.pet.type];

  const isToday = useMemo(() => {
    const today = new Date().toDateString();
    return state.lastPlayDate === today;
  }, [state.lastPlayDate]);

  const remainingPlays = useMemo(() => {
    if (!isToday) return MAX_PLAY_COUNT;
    return Math.max(0, MAX_PLAY_COUNT - state.playCount);
  }, [isToday, state.playCount]);

  const canPlay = remainingPlays > 0;

  const handleGameStart = () => {
    if (!canPlay) return;
    
    setState(prev => {
      const today = new Date().toDateString();
      const isNewDay = prev.lastPlayDate !== today;
      return {
        ...prev,
        playCount: isNewDay ? 1 : prev.playCount + 1,
        lastPlayDate: today
      };
    });
  };

  const handleBack = () => {
    setCurrentGame('select');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
        {!canPlay ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">😴</div>
            <h2 className="font-heading font-bold text-xl text-gray-800 mb-2">
              {petConfig.name}累了
            </h2>
            <p className="text-gray-600 mb-6">
              {petConfig.name}体力耗尽了，需要休息恢复~
            </p>
            <p className="text-sm text-gray-500 mb-6">
              明天再和{petConfig.name}玩耍吧！
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
            >
              好的
            </button>
          </div>
        ) : currentGame === 'select' ? (
          <>
            <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between border-b">
              <h2 className="font-heading font-bold text-xl text-gray-800">🎮 玩耍小游戏</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">六花体力</span>
                <div className="flex gap-1">
                  {Array.from({ length: MAX_PLAY_COUNT }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${i < remainingPlays ? 'opacity-100' : 'opacity-30'}`}
                    >
                      ⚡
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    handleGameStart();
                    setCurrentGame('petting');
                  }}
                  className="flex flex-col items-center p-6 bg-orange-50 hover:bg-orange-100 rounded-2xl border-2 border-transparent hover:border-orange-300 transition-all duration-200"
                >
                  <span className="text-5xl mb-3">🐾</span>
                  <span className="font-heading font-bold text-gray-800">快速抚摸</span>
                  <span className="text-sm text-gray-500 mt-1">快速点击互动</span>
                </button>
                
                <button
                  onClick={() => {
                    handleGameStart();
                    setCurrentGame('rps');
                  }}
                  className="flex flex-col items-center p-6 bg-purple-50 hover:bg-purple-100 rounded-2xl border-2 border-transparent hover:border-purple-300 transition-all duration-200"
                >
                  <span className="text-5xl mb-3">✊</span>
                  <span className="font-heading font-bold text-gray-800">猜拳游戏</span>
                  <span className="text-sm text-gray-500 mt-1">石头剪刀布</span>
                </button>
              </div>
            </div>
          </>
        ) : currentGame === 'petting' ? (
          <PettingGame onBack={handleBack} />
        ) : (
          <RockPaperScissors onBack={handleBack} onClose={onClose} />
        )}
      </div>
    </div>
  );
};