import { X } from 'lucide-react';
import { usePetState } from '../../hooks/usePetState';
import { PRODUCTS } from '../../data/products';

interface FeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedModal = ({ isOpen, onClose }: FeedModalProps) => {
  const { state, feedPet } = usePetState();
  
  const foodItems = state.backpack.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return { ...product!, ...item };
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[70vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between border-b">
          <h2 className="font-heading font-bold text-xl text-gray-800">选择食物</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {foodItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">背包是空的</p>
              <p className="text-gray-400 mt-2">去商店购买食物吧！</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {foodItems.map((item) => (
                <button
                  key={item.productId}
                  onClick={() => {
                    feedPet(item.productId);
                    onClose();
                  }}
                  className="flex flex-col items-center p-4 bg-gray-50 hover:bg-orange-50 rounded-2xl border-2 border-transparent hover:border-orange-200 transition-all duration-200"
                >
                  <span className="text-4xl mb-2">{item.emoji}</span>
                  <span className="font-heading font-medium text-gray-800">{item.name}</span>
                  <span className="text-sm text-gray-500">x{item.quantity}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
