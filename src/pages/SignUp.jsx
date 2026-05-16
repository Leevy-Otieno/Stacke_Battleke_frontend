import React from 'react';

export default function SignUp({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">Stack-Battle</h1>
        <span className="text-xl font-black text-brand-blue block -mt-1 tracking-wider">KE</span>
        <p className="text-sm text-slate-500 mt-1">Academic Excellence in Programming</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">Join the competitive academic arena.</p>

        <form onSubmit={(e) => { e.preventDefault(); setCurrentPage('dashboard'); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <input type="text" placeholder="John Doe" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue" required />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" placeholder="student@university.ac.ke" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue" required />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue" required />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Institution</label>
            <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-brand-blue">
              <option>Dedan Kimathi University of Technology</option>
              <option>Strathmore University</option>
              <option>University of Nairobi</option>
              <option>JKUAT</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-brand-blue text-white py-3 rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition-colors mt-2">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}