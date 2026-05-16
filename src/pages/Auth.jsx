import React, { useState } from 'react';

export default function Auth({ setCurrentPage, setUserData }) {
  const [activeTab, setActiveTab] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'login') {
      // Create a username directly from their actual email address string
      const generatedName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
      const formattedName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);

      setUserData({
        name: formattedName,
        email: email,
        institution: "Not Specified", 
        points: 0,
        globalRank: "Unranked",
        avatar: "" // Blank slate avatar
      });
    } else {
      // Save exact user details from signup fields
      setUserData({
        name: fullName,
        email: email,
        institution: institution || "Independent",
        points: 0,
        globalRank: "Unranked",
        avatar: ""
      });
    }

    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">Stack-Battle</h1>
        <span className="text-xl font-black text-brand-blue block -mt-1 tracking-wider">KE</span>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-full max-w-md">
        <div className="flex border-b border-slate-200 mb-6 bg-slate-50 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
              activeTab === 'login' ? 'bg-white text-brand-blue shadow-xs' : 'text-slate-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
              activeTab === 'signup' ? 'bg-white text-brand-blue shadow-xs' : 'text-slate-400'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm" 
                required 
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.ac.ke" 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm" 
              required 
            />
          </div>

          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Institution</label>
              <select 
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
                required
              >
                <option value="">Select your campus</option>
                <option value="Dedan Kimathi University of Technology">Dedan Kimathi University of Technology (DeKUT)</option>
                <option value="Strathmore University">Strathmore University</option>
                <option value="University of Nairobi">University of Nairobi (UoN)</option>
                <option value="JKUAT">JKUAT</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-brand-blue text-white py-2.5 rounded-lg text-sm font-semibold shadow-xs hover:bg-blue-700 transition-colors">
            {activeTab === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}