import React from 'react';

export default function Profile() {
  const submissions = [
    { name: "Binary Tree Maximum Path Sum", lang: "python3", status: "ACCEPTED", statusStyle: "text-emerald-600 bg-emerald-50", time: "42ms", date: "2 hours ago" },
    { name: "Longest Valid Parentheses", lang: "cpp", status: "RUNTIME ERROR", statusStyle: "text-rose-600 bg-rose-50", time: "—", date: "5 hours ago" },
    { name: "Trapping Rain Water", lang: "python3", status: "ACCEPTED", statusStyle: "text-emerald-600 bg-emerald-50", time: "58ms", date: "Yesterday" },
    { name: "Sudoku Solver", lang: "cpp", status: "TIME LIMIT EXCEEDED", statusStyle: "text-amber-600 bg-amber-50", time: ">1000ms", date: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex gap-6 items-center">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="avatar" className="w-24 h-24 rounded-xl object-cover" />
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">John Doe</h2>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Full-stack developer specializing in efficient algorithms and low-latency systems. Competitive programming enthusiast and mentor at Nairobi Tech Hub.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 text-center">
          <div><span className="text-xs text-slate-400 block font-semibold uppercase">Total Solved</span><span className="text-xl font-bold text-slate-800">1,284</span></div>
          <div><span className="text-xs text-slate-400 block font-semibold uppercase">Success Rate</span><span className="text-xl font-bold text-slate-800">94.2%</span></div>
          <div><span className="text-xs text-slate-400 block font-semibold uppercase">Battle Points</span><span className="text-xl font-bold text-brand-blue">24,500</span></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100"><h3 className="text-sm font-bold text-slate-700">History</h3></div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-400 uppercase font-bold">
            <tr>
              <th className="px-6 py-3">Problem Name</th>
              <th className="px-6 py-3">Language</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Runtime</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {submissions.map((sub, i) => (
              <tr key={i}>
                <td className="px-6 py-4 text-slate-800 font-medium flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'ACCEPTED' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  {sub.name}
                </td>
                <td className="px-6 py-4"><span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded text-xs text-slate-500">{sub.lang}</span></td>
                <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.statusStyle}`}>{sub.status}</span></td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{sub.time}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{sub.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}