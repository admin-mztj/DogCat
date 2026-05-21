import { useState } from 'react';
import { Pet } from '../components/Pet';
import { StatusBar } from '../components/StatusBar';
import { ActionBar } from '../components/ActionBar';
import { FeedModal } from '../components/FeedModal';
import { BackpackModal } from '../components/BackpackModal';
import { PetSelect } from '../components/PetSelect';
import { usePet } from '../context/PetContext';
import { Settings } from 'lucide-react';

export const Home = ({ onGoToShop }: { onGoToShop: () => void }) => {
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [isBackpackModalOpen, setIsBackpackModalOpen] = useState(false);
  const [isPetSelectOpen, setIsPetSelectOpen] = useState(false);
  const { playWithPet } = usePet();

  return (
    <div className="min-h-screen pt-24 pb-28">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsPetSelectOpen(true)}
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      <StatusBar />
      <Pet onInteraction={playWithPet} />
      <ActionBar
        onFeed={() => setIsFeedModalOpen(true)}
        onPlay={playWithPet}
        onShop={onGoToShop}
        onBackpack={() => setIsBackpackModalOpen(true)}
      />
      
      <FeedModal
        isOpen={isFeedModalOpen}
        onClose={() => setIsFeedModalOpen(false)}
      />
      <BackpackModal
        isOpen={isBackpackModalOpen}
        onClose={() => setIsBackpackModalOpen(false)}
      />
      <PetSelect
        isOpen={isPetSelectOpen}
        onClose={() => setIsPetSelectOpen(false)}
      />
    </div>
  );
};
