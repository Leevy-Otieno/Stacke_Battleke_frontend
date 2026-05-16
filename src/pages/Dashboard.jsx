import React from 'react';

export default function Dashboard({ setCurrentPage }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Profile Overview Card & Stats Matrix */}
      <div className="col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="avatar" className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h3 className="text-lg font-bold text-slate-800">John Doe</h3>
              <p className="text-sm text-slate-500">Dedan Kimathi University of Technology</p>
              <div className="flex gap-4 mt-2">
                <div><span className="text-xs text-slate-400 block font-semibold">POINTS</span><span className="text-brand-blue font-bold">12,450</span></div>
                <div><span className="text-xs text-slate-400 block font-semibold">GLOBAL RANK</span><span className="text-slate-700 font-bold">#42</span></div>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Edit Profile</button>
        </div>

        {/* Mini Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Points', val: '12.4k' },
            { label: 'Friends', val: '128' },
            { label: 'Group', val: 'DevOps_DeKUT' },
            { label: 'Grp Rank', val: '#3' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-400 font-semibold mb-1">{stat.label}</p>
              <p className="text-sm font-bold text-slate-800 truncate">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Daily/Featured Challenge Prompt */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <span className="p-2 bg-brand-lightBlue text-brand-blue rounded-lg inline-block mb-3 text-xs font-bold">Featured Challenge</span>
          <h4 className="text-base font-bold text-slate-800">Sum of two</h4>
          <p className="text-sm text-slate-500 mt-1 mb-4">Sharpen your skills with curated problems in Python, C++, and Go.</p>
          <button onClick={() => setCurrentPage('challenge')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg">View Challenge</button>
        </div>
      </div>

      {/* Right Column: Group Status Widget */}
      <div className="col-span-1">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">My Group</h3>
            <span className="text-slate-400 cursor-pointer">•••</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand-lightBlue flex items-center justify-center text-brand-blue font-bold">DG</div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">DevOps_DEKUT</h4>
              <p className="text-xs text-slate-400">Level 8 Squad</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Members</span><span className="font-semibold text-slate-800">24 Students</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Group Rank</span><span className="font-semibold text-brand-blue">1st (University)</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100"><span className="text-slate-500">Next War</span><span className="font-bold text-red-500 text-xs">In 14h 22m</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}