import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { X, Plus, Trash2, Code, Terminal } from 'lucide-react';

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', difficulty: 'Easy', 
    points: 50, category: 'General', starter_code_js: '', starter_code_py: ''
  });

  const fetchChallenges = async () => {
    try {
      const res = await apiClient.get('/challenges');
      setChallenges(res.data?.data || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchChallenges(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/admin/challenges', form);
      setShowModal(false);
      setForm({ title: '', description: '', difficulty: 'Easy', points: 50, category: 'General', starter_code_js: '', starter_code_py: '' });
      fetchChallenges();
    } catch (e) { alert("Failed to create challenge"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium">
          <Plus size={18} /> New Challenge
        </button>
      </div>

      <div className="grid gap-4">
        {challenges.map(c => (
          <div key={c.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-slate-400">{c.category} • {c.difficulty}</p>
            </div>
            <button className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Create Challenge</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Title" required className="bg-slate-800 p-3 rounded-lg border border-slate-700 w-full" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                <input placeholder="Category" required className="bg-slate-800 p-3 rounded-lg border border-slate-700 w-full" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              </div>

              <textarea placeholder="Description (Markdown)" required className="bg-slate-800 p-3 rounded-lg border border-slate-700 w-full h-24" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />

              <div className="grid grid-cols-2 gap-4">
                <select className="bg-slate-800 p-3 rounded-lg border border-slate-700" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                  <option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
                <input type="number" placeholder="Points" className="bg-slate-800 p-3 rounded-lg border border-slate-700" value={form.points} onChange={e => setForm({...form, points: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 flex items-center gap-2"><Code size={14}/> JavaScript Starter</label>
                  <textarea className="bg-slate-800 p-3 rounded-lg border border-slate-700 w-full font-mono text-sm" value={form.starter_code_js} onChange={e => setForm({...form, starter_code_js: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 flex items-center gap-2"><Terminal size={14}/> Python Starter</label>
                  <textarea className="bg-slate-800 p-3 rounded-lg border border-slate-700 w-full font-mono text-sm" value={form.starter_code_py} onChange={e => setForm({...form, starter_code_py: e.target.value})} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-bold">
                {loading ? 'Saving...' : 'Publish Challenge'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminChallenges;