import { Utensils, Gamepad2, ShoppingBag, Backpack } from 'lucide-react';

interface ActionBarProps {
  onFeed: () => void;
  onPlay: () => void;
  onShop: () => void;
  onBackpack: () => void;
}

export const ActionBar = ({ onFeed, onPlay, onShop, onBackpack }: ActionBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex justify-around gap-2">
          <ActionButton
            icon={<Utensils className="w-6 h-6" />}
            label="喂食"
            onClick={onFeed}
            color="bg-orange-500 hover:bg-orange-600"
          />
          <ActionButton
            icon={<Gamepad2 className="w-6 h-6" />}
            label="玩耍"
            onClick={onPlay}
            color="bg-purple-500 hover:bg-purple-600"
          />
          <ActionButton
            icon={<ShoppingBag className="w-6 h-6" />}
            label="商店"
            onClick={onShop}
            color="bg-blue-500 hover:bg-blue-600"
          />
          <ActionButton
            icon={<Backpack className="w-6 h-6" />}
            label="背包"
            onClick={onBackpack}
            color="bg-green-500 hover:bg-green-600"
          />
        </div>
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

const ActionButton = ({ icon, label, onClick, color }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl ${color} text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 min-h-[72px]`}
  >
    {icon}
    <span className="font-body font-medium text-sm">{label}</span>
  </button>
);
