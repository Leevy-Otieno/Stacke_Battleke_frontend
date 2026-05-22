import React, { useState, useCallback, useEffect } from 'react';
import apiClient from '../../services/api';
import { PageLoader, ErrorMessage, SuccessBanner, FormError } from '../../components/UI';
import { Trash2, Plus, X, BookOpen } from 'lucide-react';

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); 
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
    } catch (e) { console.error("Error loading challenges", e); }
  }, []);

  useEffect(() => { fetchChallenges(); }, [fetchChallenges]);

  // DELETE LOGIC
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this challenge?')) return;
    
    try {
      await apiClient.delete(`/admin/challenges/${id}`);
      setSuccess('Challenge deleted successfully.');
      fetchChallenges(); // Refresh the list
    } catch (e) {
      alert("Failed to delete challenge.");
    }
  };

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
          <p className="page-subtitle">Manage coding problems</p>
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
            {/* DELETE BUTTON */}
            <button 
              onClick={() => handleDelete(c.id)} 
              className="text-red-500 hover:text-red-400" 
              style={{ background: 'none' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* MODAL code remains the same as provided previously */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* ... Modal content remains identical to previous version ... */}
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminChallenges;