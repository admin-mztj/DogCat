import { useState } from 'react';
import { Pet } from '../components/Pet';
import { StatusBar } from '../components/StatusBar';
import { ActionBar } from '../components/ActionBar';
import { FeedModal } from '../components/FeedModal';
import { BackpackModal } from '../components/BackpackModal';
import { PetSelect } from '../components/PetSelect';
import { PlayModal } from '../components/PlayModal';
import { SceneArea, SCENES } from '../components/Scene/SceneArea';
import { usePet } from '../context/PetContext';
import { Settings } from 'lucide-react';

export const Home = ({ onGoToShop }: { onGoToShop: () => void }) => {
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [isBackpackModalOpen, setIsBackpackModalOpen] = useState(false);
  const [isPetSelectOpen, setIsPetSelectOpen] = useState(false);
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);
  const [activeScene, setActiveScene] = useState('home');
  const { playWithPet } = usePet();

  const handleSceneClick = (sceneId: string) => {
    setActiveScene(sceneId);
    if (sceneId === 'shop') {
      onGoToShop();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsPetSelectOpen(true)}
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      
      <div className="h-full flex flex-col">
        <StatusBar className="flex-shrink-0" />
        
        <div className="flex-1 grid grid-cols-2 gap-2 p-2 min-h-0">
          {SCENES.map((scene) => (
            <SceneArea
              key={scene.id}
              scene={scene}
              onClick={() => handleSceneClick(scene.id)}
              isActive={activeScene === scene.id}
            />
          ))}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <ActionBar
          onFeed={() => setIsFeedModalOpen(true)}
          onPlay={() => setIsPlayModalOpen(true)}
          onShop={onGoToShop}
          onBackpack={() => setIsBackpackModalOpen(true)}
        />
      </div>
      
      <Pet onInteraction={playWithPet} />
      
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
      <PlayModal
        isOpen={isPlayModalOpen}
        onClose={() => setIsPlayModalOpen(false)}
      />
    </div>
  );
};