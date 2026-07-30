import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Briefcase, Lock, CheckCircle2 } from 'lucide-react';

export const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'founder',
    college: '',
    password: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.password) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!formData.agreeTerms) {
      addToast('Please accept the Terms of Service to proceed.', 'error');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      addToast('Account created successfully! Welcome to VisionIn.', 'success');
      navigate('/');
    } else {
      addToast(result.message || 'Signup failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[1040px] grid grid-cols-1 md:grid-cols-2 bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left Decorative Banner */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0F172A] to-[#1D4ED8] relative overflow-hidden border-r border-[#1E293B]">
          
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-500/20 blur-2xl pointer-events-none"></div>

          <div>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center font-extrabold text-lg text-white shadow-lg shadow-blue-500/40 mb-6">
              VI
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
              Start Your Entrepreneurial Journey Today.
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Create an account to unlock full access to the student ecosystem tools.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                Secure idea timestamps & IP protection
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                Match with skilled student co-founders & managers
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                Connect directly with university incubators
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium pt-8">
            © 2026 VisionIn Ecosystem. All rights reserved.
          </div>
        </div>

        {/* Right Form Section */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1.5">Create an Account</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Enter your information to set up your profile.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="firstName">
                  First Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Harshith"
                    required
                    className="w-full bg-[#1E293B] border border-[#1E293B] focus:border-brand focus:ring-2 focus:ring-brand/20 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="lastName">
                  Last Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="GVS"
                    className="w-full bg-[#1E293B] border border-[#1E293B] focus:border-brand focus:ring-2 focus:ring-brand/20 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] focus:border-brand focus:ring-2 focus:ring-brand/20 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="role">
                Primary Account Role
              </label>
              <div className="relative flex items-center">
                <Briefcase className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] focus:border-brand focus:ring-2 focus:ring-brand/20 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white outline-none cursor-pointer transition-all appearance-none"
                >
                  <option value="founder">Student Founder</option>
                  <option value="manager">Manager / Project Lead</option>
                  <option value="editor">Editor / Content Curator</option>
                  <option value="developer">Developer / Engineer</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="investor">Incubator / Mentor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="college">
                University / College Name
              </label>
              <input
                type="text"
                id="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="IIT Madras / BITS Pilani"
                className="w-full bg-[#1E293B] border border-[#1E293B] focus:border-brand focus:ring-2 focus:ring-brand/20 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="password">
                Create Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  required
                  className="w-full bg-[#1E293B] border border-[#1E293B] focus:border-brand focus:ring-2 focus:ring-brand/20 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 text-xs text-slate-400">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="accent-brand w-4 h-4 mt-0.5 cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="cursor-pointer leading-tight text-[11px]">
                I agree to the <span className="text-brand font-medium hover:underline">Terms of Service</span> and{' '}
                <span className="text-brand font-medium hover:underline">Privacy Policy</span>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:opacity-95 text-white font-semibold rounded-xl py-3 text-sm shadow-lg shadow-blue-500/25 transition-all mt-2"
            >
              {loading ? 'Creating Profile...' : 'Create Account'}
            </button>

            <div className="text-center text-xs text-slate-400 pt-3">
              Already have an account?{' '}
              <Link to="/login" className="text-brand font-semibold hover:underline">
                Sign in
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
