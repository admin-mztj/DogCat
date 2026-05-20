import { useState } from 'react';
import { usePetState } from '../hooks/usePetState';
import { PRODUCTS } from '../data/products';
import { ArrowLeft, Coins } from 'lucide-react';

interface ShopProps {
  onBack: () => void;
}

type Category = 'all' | 'food' | 'toy';

export const Shop = ({ onBack }: ShopProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const { state, purchaseProduct } = usePetState();

  const filteredProducts = PRODUCTS.filter(p => {
    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
    const petMatch = p.applicablePets.includes(state.pet.type);
    return categoryMatch && petMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-6">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="font-heading font-bold text-xl text-gray-800">宠物商店</h1>
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-700">{state.pet.coins}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex gap-2 mb-6">
          {(['all', 'food', 'toy'] as Category[]).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-1 py-3 rounded-2xl font-heading font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category === 'all' ? '全部' : category === 'food' ? '食物' : '道具'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-4 shadow-md hover:shadow-xl transition-all duration-200"
            >
              <div className="text-5xl text-center mb-2">{product.emoji}</div>
              <h3 className="font-heading font-bold text-gray-800 text-center mb-1">
                {product.name}
              </h3>
              <div className="text-center mb-3">
                {product.effect.hunger && (
                  <span className="text-sm text-green-600">饥饿+{product.effect.hunger}</span>
                )}
                {product.effect.hunger && product.effect.mood && ' / '}
                {product.effect.mood && (
                  <span className="text-sm text-purple-600">心情+{product.effect.mood}</span>
                )}
              </div>
              <button
                onClick={() => purchaseProduct(product.id)}
                disabled={state.pet.coins < product.price}
                className={`w-full py-3 rounded-2xl font-heading font-bold transition-all duration-200 ${
                  state.pet.coins >= product.price
                    ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:shadow-lg active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                🪙 {product.price}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
