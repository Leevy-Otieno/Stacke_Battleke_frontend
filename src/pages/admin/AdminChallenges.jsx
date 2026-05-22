import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [activeTestModal, setActiveTestModal] = useState(null); // stores challenge ID when open

  // Form states
  const [challengeForm, setChallengeForm] = useState({
    title: '', description: '', difficulty: 'Easy', points_reward: 50, category: 'General',
    starter_code_javascript: '', starter_code_python: ''
  });

  const [testForm, setTestForm] = useState({
    input_data: '', expected_output: '', is_hidden: true
  });

  const token = localStorage.getItem('token');

  // Fetch all challenges on mount
  const fetchChallenges = async () => {
    try {
      const response = await axios.get('https://stack-battle-ke-backend.onrender.com/api/challenges/');
      setChallenges(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch challenges", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  // Submit New Challenge
  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://stack-battle-ke-backend.onrender.com/api/admin/challenges', challengeForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowChallengeModal(false);
      setChallengeForm({ title: '', description: '', difficulty: 'Easy', points_reward: 50, category: 'General', starter_code_javascript: '', starter_code_python: '' });
      fetchChallenges(); // Refresh list
    } catch (error) {
      alert("Failed to create challenge. Check console.");
      console.error(error);
    }
  };

  // Submit New Test Case
  const handleAddTestCase = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://stack-battle-ke-backend.onrender.com/api/admin/challenges/${activeTestModal}/test-cases`, testForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveTestModal(null);
      setTestForm({ input_data: '', expected_output: '', is_hidden: true });
      alert("Test case added successfully!");
    } catch (error) {
      alert("Failed to add test case.");
      console.error(error);
    }
  };

  // Soft Delete Challenge
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this challenge?")) return;
    try {
      await axios.delete(`https://stack-battle-ke-backend.onrender.com/api/admin/challenges/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchChallenges();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  if (loading) return <div className="text-gray-500 font-medium p-8">Loading challenges...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Area */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Challenges</h2>
          <p className="text-sm text-gray-500 mt-1">Create and manage coding problems and test cases.</p>
        </div>
        <button 
          onClick={() => setShowChallengeModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + New Challenge
        </button>
      </div>

      {/* Challenges Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
              <th className="p-4">Title</th>
              <th className="p-4">Difficulty</th>
              <th className="p-4">Points</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {challenges.map((chal) => (
              <tr key={chal.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{chal.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    chal.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                    chal.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {chal.difficulty}
                  </span>
                </td>
                <td className="p-4 font-mono text-blue-600">{chal.points} pts</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => setActiveTestModal(chal.id)} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    + Add Test
                  </button>
                  <button onClick={() => handleDelete(chal.id)} className="text-sm font-medium text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================== */}
      {/* MODAL: CREATE CHALLENGE                    */}
      {/* ========================================== */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Create New Challenge</h3>
              <button onClick={() => setShowChallengeModal(false)} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>
            
            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" value={challengeForm.title} onChange={e => setChallengeForm({...challengeForm, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Markdown supported)</label>
                <textarea required rows="4" value={challengeForm.description} onChange={e => setChallengeForm({...challengeForm, description: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2"></textarea>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select value={challengeForm.difficulty} onChange={e => setChallengeForm({...challengeForm, difficulty: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2">
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points Reward</label>
                  <input required type="number" value={challengeForm.points_reward} onChange={e => setChallengeForm({...challengeForm, points_reward: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">JS Starter Code</label>
                  <textarea rows="3" value={challengeForm.starter_code_javascript} onChange={e => setChallengeForm({...challengeForm, starter_code_javascript: e.target.value})} className="w-full font-mono text-sm border border-gray-300 rounded-lg p-2" placeholder="function solution() {}"></textarea>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Python Starter Code</label>
                  <textarea rows="3" value={challengeForm.starter_code_python} onChange={e => setChallengeForm({...challengeForm, starter_code_python: e.target.value})} className="w-full font-mono text-sm border border-gray-300 rounded-lg p-2" placeholder="def solution(): pass"></textarea>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4">
                Publish Challenge
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD TEST CASE                       */}
      {/* ========================================== */}
      {activeTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add Test Case</h3>
              <button onClick={() => setActiveTestModal(null)} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>
            
            <form onSubmit={handleAddTestCase} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Input Data</label>
                <textarea rows="2" value={testForm.input_data} onChange={e => setTestForm({...testForm, input_data: e.target.value})} className="w-full font-mono text-sm border border-gray-300 rounded-lg p-2" placeholder="e.g., [2,7,11,15]\n9"></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Output</label>
                <textarea required rows="2" value={testForm.expected_output} onChange={e => setTestForm({...testForm, expected_output: e.target.value})} className="w-full font-mono text-sm border border-gray-300 rounded-lg p-2" placeholder="e.g., [0,1]"></textarea>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="isHidden" checked={testForm.is_hidden} onChange={e => setTestForm({...testForm, is_hidden: e.target.checked})} className="mr-2" />
                <label htmlFor="isHidden" className="text-sm font-medium text-gray-700">Hidden Test Case (Used for grading, hidden from students)</label>
              </div>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mt-4">
                Save Test Case
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChallenges;