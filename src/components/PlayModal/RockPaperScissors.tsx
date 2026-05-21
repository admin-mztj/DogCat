import { ArrowLeft, Home } from 'lucide-react';
import { useState, useMemo } from 'react';
import { usePet } from '../../context/PetContext';
import { PET_CONFIGS } from '../../data/products';

const WIN_COINS = 5;
const MAX_PLAY_COUNT = 10;

interface RockPaperScissorsProps {
  onBack: () => void;
  onClose: () => void;
}

type Choice = 'rock' | 'paper' | 'scissors' | null;
type GameState = 'idle' | 'playing' | 'result' | 'tired';

const CHOICES = [
  { id: 'rock' as const, emoji: '✊', name: '石头' },
  { id: 'paper' as const, emoji: '🖐️', name: '布' },
  { id: 'scissors' as const, emoji: '✌️', name: '剪刀' }
];

const WINNING_COMBOS: Record<string, string> = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock'
};

export const RockPaperScissors = ({ onBack, onClose }: RockPaperScissorsProps) => {
  const { state, setState, playWithPet, addCoins } = usePet();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [userChoice, setUserChoice] = useState<Choice>(null);
  const [petChoice, setPetChoice] = useState<Choice>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [score, setScore] = useState({ user: 0, pet: 0 });
  const [round, setRound] = useState(1);

  const petConfig = PET_CONFIGS[state.pet.type];

  const isToday = useMemo(() => {
    const today = new Date().toDateString();
    return state.lastPlayDate === today;
  }, [state.lastPlayDate]);

  const getResult = (user: Choice, pet: Choice): 'win' | 'lose' | 'draw' => {
    if (!user || !pet) return 'draw';
    if (user === pet) return 'draw';
    if (WINNING_COMBOS[user] === pet) return 'win';
    return 'lose';
  };

  const handleChoice = (choice: Choice) => {
    if (gameState !== 'idle') return;
    
    setUserChoice(choice);
    setGameState('playing');
    
    setTimeout(() => {
      const petChoice = CHOICES[Math.floor(Math.random() * 3)].id;
      setPetChoice(petChoice);
      
      setTimeout(() => {
        const gameResult = getResult(choice, petChoice);
        setResult(gameResult);
        setGameState('result');
        
        if (gameResult === 'win') {
          setScore(prev => ({ ...prev, user: prev.user + 1 }));
          addCoins(WIN_COINS);
        } else if (gameResult === 'lose') {
          setScore(prev => ({ ...prev, pet: prev.pet + 1 }));
          playWithPet();
          playWithPet();
        }
      }, 500);
    }, 1000);
  };

  const nextRound = () => {
    if (round >= 5) {
      setGameState('idle');
      setScore({ user: 0, pet: 0 });
      setRound(1);
    } else {
      setRound(prev => prev + 1);
      setUserChoice(null);
      setPetChoice(null);
      setResult(null);
      setGameState('idle');
    }
  };

  const handlePlayAgain = () => {
    const today = new Date().toDateString();
    const newCount = isToday ? state.playCount + 1 : 1;
    
    setState(prev => ({
      ...prev,
      playCount: newCount,
      lastPlayDate: today
    }));

    if (newCount >= MAX_PLAY_COUNT) {
      setGameState('tired');
    } else {
      setScore({ user: 0, pet: 0 });
      setRound(1);
      setUserChoice(null);
      setPetChoice(null);
      setResult(null);
      setGameState('idle');
    }
  };

  const getUserChoice = () => CHOICES.find(c => c.id === userChoice);
  const getPetChoiceData = () => CHOICES.find(c => c.id === petChoice);

  return (
    <div className="p-6">
      {gameState !== 'tired' && (
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="font-heading font-bold text-xl text-gray-800">✊ 猜拳游戏</h2>
        </div>
      )}

      {gameState === 'tired' ? (
        <div className="text-center">
          <div className="text-6xl mb-4">😴</div>
          <h2 className="font-heading font-bold text-xl text-gray-800 mb-2">
            {petConfig.name}累了
          </h2>
          <p className="text-gray-600 mb-6">
            今天已经玩耍{MAX_PLAY_COUNT}次啦，{petConfig.name}需要休息了~
          </p>
          <p className="text-sm text-gray-500 mb-6">
            明天再来找{petConfig.name}玩吧！
          </p>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <Home className="w-5 h-5" />
            返回主页
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">你的得分</p>
              <p className="text-3xl font-bold text-blue-500">{score.user}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">第 {round}/5 回合</p>
              <p className="text-2xl">⚔️</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">{petConfig.name}得分</p>
              <p className="text-3xl font-bold text-purple-500">{score.pet}</p>
            </div>
          </div>

          {gameState === 'idle' && (
            <div className="text-center">
              <div className="text-6xl mb-4">
                {petConfig.imageUrl ? (
                  <img 
                    src={petConfig.imageUrl} 
                    alt={petConfig.name}
                    className="w-24 h-24 object-contain mx-auto"
                  />
                ) : (
                  <span>{petConfig.emoji}</span>
                )}
              </div>
              <p className="text-gray-600 mb-6">{petConfig.name}准备好了！选择你的出拳：</p>
              
              <div className="grid grid-cols-3 gap-4">
                {CHOICES.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id)}
                    className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl border-2 border-transparent hover:border-purple-300 transition-all duration-200"
                  >
                    <span className="text-4xl mb-2">{choice.emoji}</span>
                    <span className="font-medium text-gray-700">{choice.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="text-center">
              <div className="text-6xl mb-4">
                {petConfig.imageUrl ? (
                  <img 
                    src={petConfig.imageUrl} 
                    alt={petConfig.name}
                    className="w-24 h-24 object-contain mx-auto animate-pulse"
                  />
                ) : (
                  <span className="animate-pulse">{petConfig.emoji}</span>
                )}
              </div>
              <p className="text-gray-600 text-xl">🤔 {petConfig.name}正在思考...</p>
            </div>
          )}

          {gameState === 'result' && (
            <div className="text-center">
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">你的选择</p>
                  <div className="text-5xl">
                    {getUserChoice()?.emoji}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{getUserChoice()?.name}</p>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className={`text-5xl mb-2 ${
                    result === 'win' ? 'text-green-500' : 
                    result === 'lose' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {result === 'win' ? '🎉' : result === 'lose' ? '😢' : '🤝'}
                  </div>
                  <p className={`font-bold text-lg ${
                    result === 'win' ? 'text-green-600' : 
                    result === 'lose' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {result === 'win' ? '你赢了！' : result === 'lose' ? `${petConfig.name}赢了！` : '平局！'}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">{petConfig.name}的选择</p>
                  <div className="text-5xl">
                    {getPetChoiceData()?.emoji}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{getPetChoiceData()?.name}</p>
                </div>
              </div>

              {result === 'win' && (
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-6">
                  <p className="text-yellow-600 font-bold">🪙 获得 {WIN_COINS} 金币</p>
                </div>
              )}
              {result === 'lose' && (
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 mb-6">
                  <p className="text-green-600 font-bold">💚 {petConfig.name}心情 +20</p>
                </div>
              )}

              {round >= 5 ? (
                <button
                  onClick={handlePlayAgain}
                  className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
                >
                  再来一局
                </button>
              ) : (
                <button
                  onClick={nextRound}
                  className="px-8 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
                >
                  下一回合
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};