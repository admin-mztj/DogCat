import { usePet } from '../../context/PetContext';
import { PET_CONFIGS } from '../../data/products';
import { getStatusColor } from '../../utils/helpers';
import { Coins } from 'lucide-react';

interface StatusBarProps {
  className?: string;
}

export const StatusBar = ({ className = '' }: StatusBarProps) => {
  const { state } = usePet();
  const petConfig = PET_CONFIGS[state.pet.type];

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md shadow-lg ${className}`}>
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{petConfig.emoji}</span>
            <span className="font-heading font-bold text-xl text-gray-800">
              {petConfig.name}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-700">{state.pet.coins}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-600">饥饿值</span>
              <span className="font-bold text-gray-800">{state.pet.hunger}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatusColor(state.pet.hunger)} transition-all duration-500`}
                style={{ width: `${state.pet.hunger}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-600">心情值</span>
              <span className="font-bold text-gray-800">{state.pet.mood}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStatusColor(state.pet.mood)} transition-all duration-500`}
                style={{ width: `${state.pet.mood}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
