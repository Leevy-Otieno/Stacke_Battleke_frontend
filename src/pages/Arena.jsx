import React from "react";

export default function Arena({ setCurrentPage }) {
  const challenges = [
    {
      title: "Two Sum",
      diff: "Easy",
      diffColor: "text-emerald-500 bg-emerald-50",
      desc: "Implement an efficient search algorithm to find an element in a sorted array with O(log n)...",
      rate: "92%",
    },
    {
      title: "Add Two Numbers",
      diff: "Medium",
      diffColor: "text-amber-500 bg-amber-50",
      desc: "Determine if a binary tree is height-balanced. A tree is balanced if depths of subtrees differ...",
      rate: "64%",
    },
    {
      title: "Palindrome Number",
      diff: "Hard",
      diffColor: "text-rose-500 bg-rose-50",
      desc: "Place N chess queens on an NxN chessboard so that no two queens threaten each other...",
      rate: "18%",
    },
    {
      title: "Regex Expression",
      diff: "Medium",
      diffColor: "text-amber-500 bg-amber-50",
      desc: "Find the longest path in a Directed Acyclic Graph starting from a specific source node...",
      rate: "42%",
    },
    {
      title: "Roman to Integer",
      diff: "Easy",
      diffColor: "text-emerald-500 bg-emerald-50",
      desc: "Write a function to determine if two given strings are anagrams of each other, ignoring...",
      rate: "88%",
    },
    {
      title: "Zigzag conversion",
      diff: "Hard",
      diffColor: "text-rose-500 bg-rose-50",
      desc: "Implement the Edmonds-Karp algorithm to find the maximum flow through a network...",
      rate: "12%",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Practice Arena</h2>
        <p className="text-sm text-slate-500">
          Level up your coding skills with fun, curated challenges and instant
          feedback.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {challenges.map((challenge, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between"
          >
            <div>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${challenge.diffColor}`}
              >
                {challenge.diff}
              </span>
              <h3 className="text-base font-bold text-slate-800 mt-2">
                {challenge.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                {challenge.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                  Success Rate
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {challenge.rate}
                </span>
              </div>
              <button
                onClick={() => setCurrentPage("challenge")}
                className="px-4 py-2 bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Solve Challenge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
