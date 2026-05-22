import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { X, Plus, Trash2, Code, Terminal, BookOpen, ListPlus, Settings, Save } from 'lucide-react';

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // info | code | tests
  const [loading, setLoading] = useState(false);

  // The state perfectly mirrors your DB model
  const [form, setForm] = useState({
    title: '', slug: '', description: '', category: 'General', difficulty: 'Easy',
    points_reward: 50, time_limit: 5000, memory_limit: 128,
    starter_code_python: '', starter_code_javascript: '',
    test_cases: [] // Array of {input_data, expected_output, is_hidden, points_value}
  });

  const [testCase, setTestCase] = useState({ input_data: '', expected_output: '', is_hidden: false, points_value: 10 });

  const fetchChallenges = async () => {
    try {
      const res = await apiClient.get('/challenges');
      setChallenges(res.data?.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchChallenges(); }, []);

  // Helpers
  const addTestCase = () => {
    setForm(prev => ({ ...prev, test_cases: [...prev.test_cases, testCase] }));
    setTestCase({ input_data: '', expected_output: '', is_hidden: false, points_value: 10 });
  };

  const removeTestCase = (idx) => {
    setForm(prev => ({ ...prev, test_cases: prev.test_cases.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Auto-generate slug if empty
      const payload = { ...form, slug: form.slug || form.title.toLowerCase().replace(/ /g, '-') };
      await apiClient.post('/admin/challenges', payload);
      setShowModal(false);
      fetchChallenges();
    } catch (e) { alert("Failed to save challenge"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Challenges</h1>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2">
          <Plus size={18} /> New Challenge
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map(c => (
          <div key={c.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white">{c.title}</h3>
            <p className="text-slate-400 text-xs mb-3">{c.difficulty} • {c.points_reward} pts</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">New Challenge</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-800 mb-6">
              {['info', 'code', 'tests'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`capitalize pb-2 border-b-2 ${activeTab === tab ? 'border-emerald-500 text-white' : 'border-transparent text-slate-500'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-4">
              {activeTab === 'info' && (
                <>
                  <input required className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 text-white" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  <textarea required className="w-full bg-slate-800 p-3 rounded-lg border border-slate-700 text-white h-24" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  <div className="grid grid-cols-3 gap-2">
                    <select className="bg-slate-800 p-3 rounded-lg text-white" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                      <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                    <input type="number" className="bg-slate-800 p-3 rounded-lg text-white" placeholder="Points" value={form.points_reward} onChange={e => setForm({...form, points_reward: e.target.value})} />
                    <input className="bg-slate-800 p-3 rounded-lg text-white" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                  </div>
                </>
              )}

              {activeTab === 'code' && (
                <>
                  <textarea className="w-full bg-slate-800 p-3 rounded-lg h-32 font-mono text-xs" placeholder="Python Starter Code" value={form.starter_code_python} onChange={e => setForm({...form, starter_code_python: e.target.value})} />
                  <textarea className="w-full bg-slate-800 p-3 rounded-lg h-32 font-mono text-xs" placeholder="JavaScript Starter Code" value={form.starter_code_javascript} onChange={e => setForm({...form, starter_code_javascript: e.target.value})} />
                </>
              )}

              {activeTab === 'tests' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <input className="bg-slate-800 p-2 rounded text-xs" placeholder="Input" value={testCase.input_data} onChange={e => setTestCase({...testCase, input_data: e.target.value})} />
                    <input className="bg-slate-800 p-2 rounded text-xs" placeholder="Output" value={testCase.expected_output} onChange={e => setTestCase({...testCase, expected_output: e.target.value})} />
                  </div>
                  <button type="button" onClick={addTestCase} className="w-full py-2 bg-slate-700 rounded text-sm text-emerald-400 font-bold">+ Add Test Case</button>
                  <div className="space-y-2">
                    {form.test_cases.map((t, i) => (
                      <div key={i} className="flex justify-between bg-slate-800 p-2 rounded text-xs">
                        <span>{t.input_data} → {t.expected_output}</span>
                        <button type="button" onClick={() => removeTestCase(i)} className="text-red-400"><Trash2 size={12}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 py-3 rounded-xl font-bold mt-6 hover:bg-emerald-500 transition-colors">
                {loading ? 'Saving...' : 'Save Challenge'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminChallenges;