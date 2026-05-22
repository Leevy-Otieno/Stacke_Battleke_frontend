import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { X, Plus, Trash2, Code, Terminal, BookOpen, ChevronRight } from 'lucide-react';

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
    } catch (e) { console.error("Failed to fetch challenges", e); }
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

  const handleDelete = async (id) => {
    if(window.confirm('Delete this challenge?')) {
        await apiClient.delete(`/admin/challenges/${id}`);
        fetchChallenges();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-white">Challenges</h1>
            <p className="text-slate-400 text-sm">Create and manage coding problems.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium transition-all"
        >
          <Plus size={18} /> New Challenge
        </button>
      </div>

      {/* Challenge Grid */}
      <div className="grid gap-4">
        {challenges.map(c => (
          <div key={c.id} className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center gap-4">
                <div className="bg-slate-800 p-3 rounded-lg text-emerald-400">
                    <BookOpen size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-100">{c.title}</h3>
                    <div className="flex gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{c.difficulty}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 bg-emerald-500/10 px-2 py-0.5 rounded">{c.points} pts</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => handleDelete(c.id)} className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Create Challenge</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white p-2 bg-slate-800 rounded-full"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 uppercase font-bold">Title</label>
                    <input required className="bg-slate-800 w-full p-3 rounded-lg border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 uppercase font-bold">Category</label>
                    <input required className="bg-slate-800 w-full p-3 rounded-lg border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase font-bold">Description</label>
                <textarea required className="bg-slate-800 w-full p-3 rounded-lg border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none h-32" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 uppercase font-bold">Difficulty</label>
                    <select className="bg-slate-800 w-full p-3 rounded-lg border border-slate-700 text-white outline-none" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                        <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 uppercase font-bold">Points</label>
                    <input type="number" className="bg-slate-800 w-full p-3 rounded-lg border border-slate-700 text-white outline-none" value={form.points} onChange={e => setForm({...form, points: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 flex items-center gap-2 uppercase font-bold"><Code size={14}/> JavaScript Starter</label>
                  <textarea className="bg-slate-800 w-full p-3 rounded-lg border border-slate-700 text-slate-300 font-mono text-sm h-20" value={form.starter_code_js} onChange={e => setForm({...form, starter_code_js: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 flex items-center gap-2 uppercase font-bold"><Terminal size={14}/> Python Starter</label>
                  <textarea className="bg-slate-800 w-full p-3 rounded-lg border border-slate-700 text-slate-300 font-mono text-sm h-20" value={form.starter_code_py} onChange={e => setForm({...form, starter_code_py: e.target.value})} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.01]">
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