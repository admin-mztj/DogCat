import { useState } from 'react';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { PetProvider } from './context/PetContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop'>('home');

  return (
    <PetProvider>
      <div className="min-h-screen">
        {currentPage === 'home' && (
          <Home onGoToShop={() => setCurrentPage('shop')} />
        )}
        {currentPage === 'shop' && (
          <Shop onBack={() => setCurrentPage('home')} />
        )}
      </div>
    </PetProvider>
  );
}

export default App;
