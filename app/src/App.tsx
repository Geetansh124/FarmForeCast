import { useState, useCallback } from 'react';
import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { FarmerDashboard } from './sections/FarmerDashboard';
import { AdminDashboard } from './sections/AdminDashboard';
import { Footer } from './sections/Footer';
import { Preloader } from './components/Preloader';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      <div className={`min-h-screen bg-[#0a0a0a] ${isLoading ? 'overflow-hidden max-h-screen' : ''}`}>
        <Navigation />

        <main>
          <Hero isReady={!isLoading} />
          <FarmerDashboard />
          <AdminDashboard />
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}

export default App;
