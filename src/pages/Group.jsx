import React from 'react';

export default function Groups() {
  const groups = [
    { title: "Cyber-Security Elite", inst: "Strathmore University", rank: "#1 Rank", members: "124" },
    { title: "Neural Network Lab", inst: "University of Nairobi", rank: "#4 Rank", members: "89" },
    { title: "Quantum Algorithms", inst: "JKUAT", rank: "#12 Rank", members: "42" },
    { title: "Data Science Society", inst: "Kenyatta University", rank: "#2 Rank", members: "210" },
    { title: "Blockchain Devs", inst: "Riara University", rank: "#7 Rank", members: "56" },
    { title: "IoT Explorers", inst: "Daystar University", rank: "#15 Rank", members: "31" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Academic Groups</h2>
          <p className="text-sm text-slate-500">Join specialized research and coding clusters to climb the institutional ranks.</p>
        </div>
        <button className="px-4 py-2 bg-brand-blue text-white font-semibold text-sm rounded-lg hover:bg-blue-700">+ Create Group</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Groups", val: "1,284" },
          { label: "Active Institutions", val: "142" },
          { label: "Your Points", val: "14,200" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 font-semibold uppercase">{item.label}</span>
            <span className="text-xl font-bold text-slate-800 mt-1">{item.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {groups.map((group, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 relative">
            <span className="absolute top-4 right-4 text-[10px] text-slate-400 font-bold">{group.rank}</span>
            <div className="w-8 h-8 rounded bg-slate-800 mb-3"></div>
            <h3 className="text-sm font-bold text-slate-800">{group.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{group.inst}</p>
            
            <div className="flex justify-between text-xs mt-4 pt-4 border-t border-slate-100">
              <div><span className="text-slate-400">Members:</span> <span className="font-bold text-slate-700">{group.members}</span></div>
              <div className="text-emerald-500 font-medium">• Private</div>
            </div>
            <button className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-lg">Join via invite</button>
          </div>
        ))}
      </div>
    </div>
  );
}