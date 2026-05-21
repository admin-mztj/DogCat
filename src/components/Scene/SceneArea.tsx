interface SceneAreaProps {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  icon: string;
}

export const SCENES: SceneAreaProps[] = [
  {
    id: 'home',
    name: '家',
    emoji: '🏠',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: '🏠'
  },
  {
    id: 'shop',
    name: '杂货店',
    emoji: '🏪',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    icon: '🛒'
  },
  {
    id: 'school',
    name: '学校',
    emoji: '🏫',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: '📚'
  },
  {
    id: 'basketball',
    name: '篮球场',
    emoji: '🏀',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: '🏀'
  }
];

export const SceneArea = ({ scene, onClick, isActive }: { 
  scene: SceneAreaProps; 
  onClick: () => void;
  isActive: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        rounded-2xl p-4 cursor-pointer
        transition-all duration-300 transform
        ${scene.bgColor}
        ${isActive ? 'ring-2 ring-offset-2 ring-gray-400 scale-102 shadow-lg' : 'hover:scale-101 hover:shadow-md'}
        flex-1
        min-h-[150px]
      `}
    >
      <span className="text-5xl mb-2">{scene.emoji}</span>
      <span className={`font-heading font-bold ${scene.color}`}>{scene.name}</span>
    </div>
  );
};