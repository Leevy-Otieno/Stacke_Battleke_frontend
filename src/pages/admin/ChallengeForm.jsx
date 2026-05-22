// src/components/admin/ChallengeForm.jsx
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const ChallengeForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    difficulty: 'Easy',
    description: '',
    testCases: [{ input: '', output: '' }]
  });

  const addTestCase = () => {
    setFormData({ ...formData, testCases: [...formData.testCases, { input: '', output: '' }] });
  };

  const updateTestCase = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData({ ...formData, testCases: newTestCases });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input 
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Difficulty</label>
        <select 
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          value={formData.difficulty}
          onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea 
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg h-32"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Test Cases</label>
        {formData.testCases.map((tc, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input placeholder="Input" className="w-1/2 p-2 border rounded" value={tc.input} onChange={(e) => updateTestCase(index, 'input', e.target.value)} />
            <input placeholder="Output" className="w-1/2 p-2 border rounded" value={tc.output} onChange={(e) => updateTestCase(index, 'output', e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={addTestCase} className="text-blue-600 text-sm flex items-center gap-1 mt-2">
          <Plus size={16} /> Add Test Case
        </button>
      </div>

      <button 
        onClick={() => onSubmit(formData)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4"
      >
        Save Challenge
      </button>
    </div>
  );
};

export default ChallengeForm;