import { useState } from 'react';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop'>('home');

  return (
    <div className="min-h-screen">
      {currentPage === 'home' && (
        <Home onGoToShop={() => setCurrentPage('shop')} />
      )}
      {currentPage === 'shop' && (
        <Shop onBack={() => setCurrentPage('home')} />
      )}
    </div>
  );
}

export default App;
