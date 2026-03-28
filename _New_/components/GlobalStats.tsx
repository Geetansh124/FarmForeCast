
import React from 'react';
import { Users, Trees, Car, Factory, Globe, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'USA', cars: 850, treesNeeded: 120, color: '#f43f5e' },
  { name: 'China', cars: 400, treesNeeded: 200, color: '#f97316' },
  { name: 'India', cars: 220, treesNeeded: 250, color: '#eab308' },
  { name: 'Russia', cars: 390, treesNeeded: 90, color: '#3b82f6' },
  { name: 'Brazil', cars: 350, treesNeeded: 300, color: '#10b981' },
];

const GlobalStats: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-black rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/10 p-6 md:p-8 animate-slide-up relative overflow-hidden group transition-colors">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20">
          <Globe size={24} className="text-white animate-spin-slow" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Planetary Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Real-time Biosphere Telemetry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Stat 1 */}
        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-emerald-500/50 transition-colors group/card">
          <div className="flex justify-between items-start mb-2">
            <Users className="text-gray-400 group-hover/card:text-gray-600 dark:group-hover/card:text-white transition-colors" size={20} />
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">8.1 B</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Population</div>
        </div>

        {/* Stat 2 */}
        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-orange-500/50 transition-colors group/card">
          <div className="flex justify-between items-start mb-2">
            <Car className="text-gray-400 group-hover/card:text-gray-600 dark:group-hover/card:text-white transition-colors" size={20} />
            <TrendingUp size={16} className="text-orange-500" />
          </div>
          <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">1.4 B</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Fleet</div>
        </div>

        {/* Stat 3 */}
        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-red-500/50 transition-colors group/card">
          <div className="flex justify-between items-start mb-2">
            <Factory className="text-gray-400 group-hover/card:text-gray-600 dark:group-hover/card:text-white transition-colors" size={20} />
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          </div>
          <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">37 Gt</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">CO2 Output</div>
        </div>

        {/* Stat 4 */}
        <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-green-500/50 transition-colors group/card">
          <div className="flex justify-between items-start mb-2">
            <Trees className="text-gray-400 group-hover/card:text-gray-600 dark:group-hover/card:text-white transition-colors" size={20} />
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">1.2 T</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tree Deficit</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="h-64 bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/5 flex flex-col">
           <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
               Reforestation Urgency Index
           </h3>
           <div className="flex-1 w-full min-h-0" style={{ minWidth: 0 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, rgba(150,150,150,0.1))" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#6b7280'}} />
                   <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#6b7280'}} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'var(--tooltip-bg, #fff)', borderRadius: '12px', border: '1px solid #e5e7eb', color: 'var(--tooltip-text, #000)' }}
                     cursor={{fill: 'rgba(0,0,0,0.05)'}}
                   />
                   <Bar dataKey="treesNeeded" radius={[4, 4, 0, 0]}>
                     {data.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
           </div>
        </div>

        {/* Impact Visual */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white flex flex-col justify-center relative overflow-hidden border border-white/10 shadow-lg">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           
           <div className="relative z-10">
             <h3 className="text-xl font-bold mb-3 text-emerald-300">Balance The Equation</h3>
             <p className="text-gray-300 text-sm mb-6 leading-relaxed">
               Current biospheric load requires <span className="text-white font-bold">250 mature trees</span> to offset a single combustion vehicle's lifespan.
             </p>
             
             <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-emerald-400">
                    <span>FOREST COVER</span>
                    <span>60% / 100%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 h-2 rounded-full relative animate-pulse">
                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                    </div>
                </div>
             </div>
           </div>
        </div>
      </div>
      
      <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-6 uppercase tracking-wider">
          *Data modeled via Aggregated Global Sensor Arrays
      </p>
    </div>
  );
};

export default GlobalStats;
