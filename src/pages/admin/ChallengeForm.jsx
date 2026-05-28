
import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { FormError } from '../../components/UI';

const EMPTY_TC = { input: '', expected_output: '', is_hidden: false };

const DEFAULTS = {
  title: '', description: '', difficulty: 'Easy',
  points_reward: 10, is_published: false,
  testCases: [{ ...EMPTY_TC }],
};

const ChallengeForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [form, setForm] = useState({ ...DEFAULTS, ...initialData });
  const [error, setError] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const updateTC = (i, key, val) =>
    setForm((f) => {
      const tcs = [...f.testCases];
      tcs[i] = { ...tcs[i], [key]: val };
      return { ...f, testCases: tcs };
    });

  const addTC    = () => setForm((f) => ({ ...f, testCases: [...f.testCases, { ...EMPTY_TC }] }));
  const removeTC = (i) => setForm((f) => ({ ...f, testCases: f.testCases.filter((_, idx) => idx !== i) }));

  const handleSubmit = () => {
    if (!form.title.trim())       return setError('Title is required.');
    if (!form.description.trim()) return setError('Description is required.');
    if (form.points_reward < 1)   return setError('Points must be at least 1.');
    setError('');
    onSubmit(form);
  };

  const inputStyle = {
    width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)',
    borderRadius: '7px', padding: '0.6rem 0.875rem', color: 'var(--text-primary)',
    fontSize: '0.875rem', outline: 'none',
  };
  const labelStyle = { display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '500' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <FormError message={error} />

      {/* Title */}
      <div>
        <label style={labelStyle}>Challenge Title *</label>
        <input style={inputStyle} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Two Sum" />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Problem Description *</label>
        <textarea
          style={{ ...inputStyle, height: '120px', resize: 'vertical', lineHeight: '1.6' }}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe the problem, constraints, and expected format…"
        />
      </div>

      {/* Difficulty + Points row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Difficulty</label>
          <select style={inputStyle} value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Points Reward</label>
          <input style={inputStyle} type="number" min={1} value={form.points_reward} onChange={(e) => set('points_reward', Number(e.target.value))} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          {/* Published toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', paddingBottom: '0.6rem' }}>
            <div
              onClick={() => set('is_published', !form.is_published)}
              style={{
                width: '36px', height: '20px', borderRadius: '999px', position: 'relative',
                backgroundColor: form.is_published ? '#10B981' : 'var(--border-color)',
                transition: 'background 0.2s', flexShrink: 0, cursor: 'pointer',
              }}
            >
              <div style={{
                position: 'absolute', top: '2px', left: form.is_published ? '18px' : '2px',
                width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff',
                transition: 'left 0.2s',
              }} />
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Published</span>
          </label>
        </div>
      </div>

      {/* Test Cases */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <label style={{ ...labelStyle, margin: 0 }}>Test Cases</label>
          <button
            onClick={addTC}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', color: '#10B981', fontSize: '0.8rem', fontWeight: '600' }}
          >
            <Plus size={14} /> Add Test Case
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {form.testCases.map((tc, i) => (
            <div key={i} style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '7px', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Test {i + 1}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Hidden toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={tc.is_hidden} onChange={(e) => updateTC(i, 'is_hidden', e.target.checked)} style={{ accentColor: '#10B981' }} />
                    Hidden
                  </label>
                  {form.testCases.length > 1 && (
                    <button onClick={() => removeTC(i)} style={{ background: 'none', color: '#EF4444' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Input</label>
                  <textarea
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.82rem', padding: '0.5rem' }}
                    value={tc.input}
                    onChange={(e) => updateTC(i, 'input', e.target.value)}
                    placeholder="e.g. [2,7,11,15]\n9"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Expected Output</label>
                  <textarea
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.82rem', padding: '0.5rem' }}
                    value={tc.expected_output}
                    onChange={(e) => updateTC(i, 'expected_output', e.target.value)}
                    placeholder="e.g. [0,1]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.25rem', borderRadius: '7px', border: '1px solid var(--border-color)', background: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '500' }}
          >
            <X size={15} /> Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ padding: '0.6rem 1.5rem', borderRadius: '7px', backgroundColor: '#10B981', color: '#fff', fontWeight: '600', fontSize: '0.875rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Saving…' : 'Save Challenge'}
        </button>
      </div>
    </div>
  );
};

export default ChallengeForm;