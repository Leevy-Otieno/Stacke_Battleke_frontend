import React from 'react';

export default function Leaderboards() {
  const topThree = [
    { name: "Sarah J. Namas", inst: "Strathmore University", pts: "14,820 pts", pos: "2" },
    { name: "Ken M. Okello", inst: "Jomo Kenyatta University", pts: "16,240 pts", pos: "1", main: true },
    { name: "Amina W. Hassan", inst: "UON Towers", pts: "13,910 pts", pos: "3" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Leaderboards</h2>
        <p className="text-sm text-slate-500">Track academic excellence.</p>
      </div>

      {/* Podium Display */}
      <div className="grid grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
        {topThree.map((user, i) => (
          <div key={i} className={`bg-white p-6 rounded-xl border border-slate-200 text-center relative ${user.main ? 'ring-2 ring-brand-blue py-8 shadow-sm' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white absolute -top-3 left-1/2 -translate-x-1/2 ${user.main ? 'bg-brand-blue' : 'bg-slate-400'}`}>
              {user.pos}
            </span>
            <div className="w-12 h-12 bg-slate-300 rounded-full mx-auto mb-3"></div>
            <h3 className="text-sm font-bold text-slate-800">{user.name}</h3>
            <p className="text-xs text-slate-400">{user.inst}</p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${user.main ? 'bg-brand-lightBlue text-brand-blue' : 'bg-slate-100 text-slate-600'}`}>
              {user.pts}
            </span>
          </div>
        ))}
      </div>

      {/* Ranked Table View */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">National Ranking</h3>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-xs text-slate-400 uppercase font-bold border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Participant</th>
              <th className="px-6 py-3">Points</th>
              <th className="px-6 py-3">Badge</th>
              <th className="px-6 py-3">Institution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { rank: "04", name: "Brian Mwangi", pts: "12,450", badge: "Gold Tier", inst: "Dedan Kimathi University" },
              { rank: "05", name: "Grace Waweru", pts: "11,890", badge: "Gold Tier", inst: "Mount Kenya University" },
              { rank: "12", name: "Felix Korir", pts: "8,210", badge: "Silver Tier", inst: "Strathmore University", highlight: true },
              { rank: "13", name: "Lucy W. Maina", pts: "7,940", badge: "Silver Tier", inst: "Egerton University" }
            ].map((row, idx) => (
              <tr key={idx} className={row.highlight ? 'bg-brand-lightBlue/30 font-semibold' : ''}>
                <td className={`px-6 py-4 text-xs font-bold ${row.highlight ? 'text-brand-blue' : 'text-slate-400'}`}>{row.rank}</td>
                <td className="px-6 py-4 text-slate-800">{row.name}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{row.pts}</td>
                <td className="px-6 py-4"><span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-slate-100 rounded text-slate-500">{row.badge}</span></td>
                <td className="px-6 py-4 text-slate-500">{row.inst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}