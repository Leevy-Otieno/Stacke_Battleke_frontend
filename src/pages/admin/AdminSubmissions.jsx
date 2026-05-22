// src/pages/admin/AdminSubmissions.jsx
import { useState } from 'react';
import { Eye, CheckCircle, XCircle, Search } from 'lucide-react';

const AdminSubmissions = () => {
  // Mock data
  const [submissions] = useState([
    { id: 101, user: 'Wayne Kiprotich', challenge: 'Two Sum', status: 'Passed', date: '2026-05-22' },
    { id: 102, user: 'John Doe', challenge: 'Palindrome Check', status: 'Failed', date: '2026-05-21' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Submission Review</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Filter by user or challenge..." 
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">User</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Challenge</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{sub.user}</td>
                <td className="px-6 py-4">{sub.challenge}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    sub.status === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {sub.status === 'Passed' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{sub.date}</td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                    <Eye size={16} /> View Code
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubmissions;