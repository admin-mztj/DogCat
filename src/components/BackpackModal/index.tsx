import { X } from 'lucide-react';
import { usePetState } from '../../hooks/usePetState';
import { PRODUCTS } from '../../data/products';

interface BackpackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackpackModal = ({ isOpen, onClose }: BackpackModalProps) => {
  const { state } = usePetState();
  
  const items = state.backpack.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return { ...product!, ...item };
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[70vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between border-b">
          <h2 className="font-heading font-bold text-xl text-gray-800">我的背包</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">背包是空的</p>
              <p className="text-gray-400 mt-2">去商店购物吧！</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl"
                >
                  <span className="text-4xl mb-2">{item.emoji}</span>
                  <span className="font-heading font-medium text-gray-800 text-sm text-center">{item.name}</span>
                  <span className="text-sm text-gray-500 font-bold">x{item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
