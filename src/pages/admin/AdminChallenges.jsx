import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { X, Plus, Trash2, Code, Terminal, BookOpen, ListPlus } from 'lucide-react';

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for the form
  const [form, setForm] = useState({
    title: '', description: '', difficulty: 'Easy', 
    points: 50, category: 'General', starter_code_js: '', starter_code_py: '',
    test_cases: []
  });

  const [testInput, setTestInput] = useState({ input: '', output: '', is_hidden: false });

  const fetchChallenges = async () => {
    try {
      const res = await apiClient.get('/challenges');
      setChallenges(res.data?.data || []);
    } catch (e) {
      console.error("Error fetching challenges:", e);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const addTest = () => {
    setForm(prev => ({
      ...prev,
      test_cases: [...prev.test_cases, { ...testInput }]
    }));
    setTestInput({ input: '', output: '', is_hidden: false });
  };

  const removeTest = (index) => {
    setForm(prev => ({
      ...prev,
      test_cases: prev.test_cases.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/admin/challenges', form);
      setShowModal(false);
      setForm({ title: '', description: '', difficulty: 'Easy', points: 50, category: 'General', starter_code_js: '', starter_code_py: '', test_cases: [] });
      fetchChallenges();
    } catch (e) {
      alert("Failed to create challenge. Check your backend console.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Challenges</h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium"
        >
          <Plus size={18} /> New Challenge
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map(c => (
          <div key={c.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-white">{c.title}</h3>
              <p className="text-xs text-slate-400">{c.difficulty} • {c.points} pts</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add Challenge</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input required className="w-full bg-slate-800 p-2 rounded text-white" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <textarea required className="w-full bg-slate-800 p-2 rounded text-white h-20" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              
              <div className="flex gap-2">
                <input className="flex-1 bg-slate-800 p-2 rounded text-white" placeholder="Input" value={testInput.input} onChange={e => setTestInput({...testInput, input: e.target.value})} />
                <input className="flex-1 bg-slate-800 p-2 rounded text-white" placeholder="Output" value={testInput.output} onChange={e => setTestInput({...testInput, output: e.target.value})} />
                <button type="button" onClick={addTest} className="bg-slate-700 px-3 rounded"><ListPlus /></button>
              </div>

              <div className="max-h-20 overflow-y-auto space-y-1">
                {form.test_cases.map((t, i) => (
                  <div key={i} className="flex justify-between bg-slate-800 p-1 px-2 rounded text-xs text-slate-300">
                    {t.input} → {t.output}
                    <button type="button" onClick={() => removeTest(i)} className="text-red-400"><Trash2 size={12}/></button>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 py-2 rounded font-bold text-white mt-4">
                {loading ? 'Publishing...' : 'Publish Challenge'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminChallenges;