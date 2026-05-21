import { PetType } from '../../types';
import { usePet } from '../../context/PetContext';
import { PET_CONFIGS } from '../../data/products';

interface PetSelectProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PetSelect = ({ isOpen, onClose }: PetSelectProps) => {
  const { state, switchPet } = usePet();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-[90%] max-w-md p-6 shadow-2xl">
        <h2 className="font-heading font-bold text-2xl text-gray-800 text-center mb-6">
          选择你的宠物
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.values(PET_CONFIGS).map((pet) => (
            <button
              key={pet.id}
              onClick={() => {
                switchPet(pet.id as PetType);
                onClose();
              }}
              className={`flex flex-col items-center p-6 rounded-2xl border-3 transition-all duration-200 ${
                state.pet.type === pet.id
                  ? 'border-orange-400 bg-orange-50 scale-105 shadow-lg'
                  : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-6xl mb-3">{pet.emoji}</span>
              <span className="font-heading font-bold text-xl text-gray-800">{pet.name}</span>
              {state.pet.type === pet.id && (
                <span className="mt-2 text-orange-600 text-sm font-medium">当前选择</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
