export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-8">
      <main className="flex flex-col items-center text-center max-w-4xl space-y-8 animate-in fade-in zoom-in duration-700">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 drop-shadow-2xl">
          Event Koi
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-300 max-w-2xl">
          Experience the future of event management. Streamlined, powerful, and built for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full">
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
            <h2 className="text-2xl font-bold text-pink-400 mb-2 group-hover:scale-105 transition-transform">Features</h2>
            <p className="text-gray-400">Discover the 6 core pillars of our platform.</p>
          </div>
          <a href="/register" className="block p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
            <h2 className="text-2xl font-bold text-indigo-400 mb-2 group-hover:scale-105 transition-transform">Get Started</h2>
            <p className="text-gray-400">Initialize your journey with RDBMS power.</p>
          </a>
        </div>
      </main>
    </div>
  );
}
