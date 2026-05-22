import React, { useState, useCallback, useEffect } from 'react';
import apiClient from '../../services/api';
import { PageLoader, ErrorMessage, SuccessBanner, FormError } from '../../components/UI';
import { Code, Settings, Trash2, Plus, Save, X } from 'lucide-react';

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // info | code | tests
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    title: '', slug: '', description: '', category: 'General', difficulty: 'Easy',
    points_reward: 50, time_limit: 5000, memory_limit: 128,
    starter_code_python: '', starter_code_javascript: '',
    test_cases: []
  });

  const [testCase, setTestCase] = useState({ input_data: '', expected_output: '', is_hidden: false, points_value: 10 });

  const fetchChallenges = useCallback(async () => {
    try {
      const res = await apiClient.get('/challenges');
      setChallenges(res.data?.data || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchChallenges(); }, [fetchChallenges]);

  const addTestCase = () => {
    setForm(prev => ({ ...prev, test_cases: [...prev.test_cases, { ...testCase }] }));
    setTestCase({ input_data: '', expected_output: '', is_hidden: false, points_value: 10 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');
    try {
      await apiClient.post('/admin/challenges', {
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/ /g, '-')
      });
      setSuccess('Challenge created successfully!');
      setShowModal(false);
      fetchChallenges();
    } catch (e) { setFormError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Challenges</h1>
          <p className="page-subtitle">Manage coding problems & test cases</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> New Challenge
        </button>
      </div>

      {success && <SuccessBanner message={success} />}

      <div className="grid gap-4 mt-6">
        {challenges.map(c => (
          <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '600' }}>{c.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.difficulty} · {c.points_reward} pts</div>
            </div>
            <button className="text-red-500 hover:text-red-400" style={{ background: 'none' }}><Trash2 size={18} /></button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: '600' }}>Create Challenge</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none' }}><X size={20} /></button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              {['info', 'code', 'tests'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', borderBottom: activeTab === tab ? '2px solid var(--primary-green)' : 'none', padding: '0.5rem', color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            <FormError message={formError} />

            {/* Content */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <input className="input-field" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                <textarea className="input-field" placeholder="Description" style={{ height: '100px' }} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <select className="input-field" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                  <input type="number" className="input-field" placeholder="Points" value={form.points_reward} onChange={e => setForm({...form, points_reward: e.target.value})} />
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-4">
                <textarea className="input-field" placeholder="Python Starter Code" style={{ height: '100px', fontFamily: 'monospace' }} value={form.starter_code_python} onChange={e => setForm({...form, starter_code_python: e.target.value})} />
                <textarea className="input-field" placeholder="JS Starter Code" style={{ height: '100px', fontFamily: 'monospace' }} value={form.starter_code_javascript} onChange={e => setForm({...form, starter_code_javascript: e.target.value})} />
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="space-y-4">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input className="input-field" placeholder="Input" value={testCase.input_data} onChange={e => setTestCase({...testCase, input_data: e.target.value})} />
                  <input className="input-field" placeholder="Output" value={testCase.expected_output} onChange={e => setTestCase({...testCase, expected_output: e.target.value})} />
                  <button onClick={addTestCase} className="btn-primary" style={{ width: 'auto' }}><Plus size={16}/></button>
                </div>
                {form.test_cases.map((t, i) => (
                  <div key={i} className="card" style={{ padding: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem' }}>{t.input_data} → {t.expected_output}</span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
              {loading ? 'Saving...' : 'Publish Challenge'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminChallenges;