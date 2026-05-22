// src/pages/admin/AdminChallenges.jsx
import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Code } from 'lucide-react';

const AdminChallenges = () => {
  // Mock data - replace with your API call logic later
  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Two Sum', difficulty: 'Easy', submissions: 142 },
    { id: 2, title: 'Palindrome Check', difficulty: 'Medium', submissions: 89 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Challenges</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Add Challenge
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search challenges..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Challenges Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Challenge Title</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Difficulty</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Submissions</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {challenges.map((challenge) => (
              <tr key={challenge.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded">
                    <Code size={16} />
                  </div>
                  {challenge.title}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{challenge.submissions}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded text-gray-600"><Edit size={18} /></button>
                  <button className="p-2 hover:bg-red-100 rounded text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminChallenges;