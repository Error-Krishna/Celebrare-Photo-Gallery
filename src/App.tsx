import React from 'react';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717] flex flex-col selection:bg-purple-100 selection:text-purple-900 font-sans">
      {/* Global Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Editorial Hero Introduction */}
        <section className="pt-14 pb-4 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#6C5CE7] mb-3">
            PHOTO COLLECTION
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#171717] font-serif mb-4">
            Explore the gallery.
          </h1>
          <p className="text-base sm:text-lg text-[#737373] max-w-2xl mx-auto font-normal leading-relaxed">
            Browse through 30 curated photographs from around the world. Search by
            author in real-time and save your personal favourites with persistent storage.
          </p>
        </section>

        {/* Gallery Grid & Live Search Section */}
        <Gallery />
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-[#E5E5E5] bg-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#171717] font-serif">Frame</span>
            <span>—</span>
            <span>Celebrare Frontend Internship Prescreening Assignment</span>
          </div>
          <div>
            <span>Powered by Picsum API • React 19 • Vite • Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
