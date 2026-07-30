import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { auth, googleProvider, signInWithPopup } from '../services/firebase';

const AuthContext = createContext();

const SEED_ACCOUNTS = [
  {
    id: "user-admin",
    name: "Harshith GVS",
    email: "gvsharshith6@gmail.com",
    password: "harshith@suresh",
    role: "admin",
    roleLabel: "Platform Super Admin",
    headline: "Platform Founder & Super Admin @ VisionIn Core",
    college: "VisionIn Global Headquarters",
    skills: ["System Architecture", "AI Telemetry", "Enterprise Security", "Cloud Operations"],
    bio: "Super Admin and Lead Architect of VisionIn. Centralized admin portal receives all user submissions, research ideas, pitches, and job applications.",
    avatar: "HG",
    cover: "linear-gradient(135deg, #1D4ED8 0%, #0F172A 100%)",
    startupName: "VisionIn Core Platform",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" },
    portfolio: ["VisionIn Enterprise Platform", "IP Ledger Crypto Node"],
    isAdmin: true,
    status: "Active"
  },
  {
    id: "user-1",
    name: "Ravi Kumar",
    email: "ravi@university.edu",
    password: "password123",
    role: "founder",
    roleLabel: "Student Founder",
    headline: "Student Founder @ AgriSense AI · Building Smart Farm Automations",
    college: "IIT Madras",
    skills: ["AI/ML", "React", "Python", "Product Strategy"],
    bio: "Passionate about leveraging IoT and computer vision to solve agricultural bottlenecks.",
    avatar: "RK",
    cover: "linear-gradient(120deg, #1D4ED8, #0F172A)",
    startupName: "AgriSense AI",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" },
    portfolio: ["AgriSense Web App"],
    isAdmin: false,
    status: "Active"
  },
  {
    id: "user-2",
    name: "Sneha Patil",
    email: "sneha@university.edu",
    password: "password123",
    role: "manager",
    roleLabel: "Ecosystem Manager",
    headline: "Manager @ GreenCart · Hyperlocal Farm Produce Marketplace",
    college: "COEP Tech University",
    skills: ["Product Management", "Operations", "Market Validation"],
    bio: "Ecosystem Manager driving GreenCart growth and vendor onboarding.",
    avatar: "SP",
    cover: "linear-gradient(120deg, #3B82F6, #1E293B)",
    startupName: "GreenCart",
    socials: { linkedin: "https://linkedin.com" },
    portfolio: ["GreenCart App MVP"],
    isAdmin: false,
    status: "Active"
  }
];

const getStoredRegisteredUsers = () => {
  try {
    const saved = localStorage.getItem('visionin_registered_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse registered users:', e);
  }
  localStorage.setItem('visionin_registered_users', JSON.stringify(SEED_ACCOUNTS));
  return SEED_ACCOUNTS;
};

const saveRegisteredUserToLocalStore = (user) => {
  try {
    const currentList = getStoredRegisteredUsers();
    const existingIndex = currentList.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...currentList];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...user };
    } else {
      updatedList = [user, ...currentList];
    }
    localStorage.setItem('visionin_registered_users', JSON.stringify(updatedList));
  } catch (e) {
    console.error('Failed saving user to local store:', e);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('visionin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('visionin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('visionin_user');
    }
  }, [user]);

  const login = async (emailInput, passwordInput) => {
    setLoading(true);
    const cleanEmail = (emailInput || '').trim().toLowerCase();
    const cleanPassword = passwordInput || '';

    try {
      // 1. Permanent Super Admin Bypass for Harshith GVS
      if (cleanEmail === 'gvsharshith6@gmail.com') {
        if (cleanPassword === 'harshith@suresh') {
          const adminUser = SEED_ACCOUNTS[0];
          setUser(adminUser);
          saveRegisteredUserToLocalStore(adminUser);
          return { success: true, message: 'Welcome Back Super Admin Harshith!' };
        } else {
          return { success: false, message: 'Invalid Admin Password. Please try again.' };
        }
      }

      // 2. Try Backend API login first
      try {
        const res = await API.post('/auth/login', { email: cleanEmail, password: cleanPassword });
        if (res.data && res.data.success) {
          const authUser = res.data.user;
          setUser(authUser);
          saveRegisteredUserToLocalStore({ ...authUser, password: cleanPassword });
          return { success: true, message: res.data.message || 'Login successful' };
        } else if (res.data && res.data.message) {
          return { success: false, message: res.data.message };
        }
      } catch (apiErr) {
        // If server explicitly returned 401 or 400 (e.g. Invalid password or User exists), respect server error
        if (apiErr.response && (apiErr.response.status === 401 || apiErr.response.status === 400)) {
          return { success: false, message: apiErr.response.data?.message || 'Invalid email or password.' };
        }
        console.warn('Backend server API unreachable or returned 404, attempting local registry login:', apiErr.message);
      }

      // 3. Fallback to Local Persistent Account Store
      const localUsers = getStoredRegisteredUsers();
      const localMatch = localUsers.find(u => u.email.toLowerCase() === cleanEmail);

      if (localMatch) {
        if (!localMatch.password || localMatch.password === cleanPassword) {
          setUser(localMatch);
          return { success: true, message: 'Welcome back to VisionIn!' };
        } else {
          return { success: false, message: 'Invalid password. Please check your credentials.' };
        }
      }

      return { success: false, message: 'No account found with this email. Please click "Create account" to register.' };

    } catch (err) {
      return { success: false, message: err.message || 'Authentication error occurred.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    const cleanEmail = (formData.email || '').trim().toLowerCase();
    const roleMap = {
      founder: 'Student Founder',
      manager: 'Ecosystem Manager',
      editor: 'Content Editor',
      developer: 'Developer / Engineer',
      designer: 'UI/UX Designer',
      investor: 'Incubator / Mentor'
    };

    const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
    const initials = ((formData.firstName ? formData.firstName[0] : 'U') + (formData.lastName ? formData.lastName[0] : '')).toUpperCase();

    const localNewUser = {
      id: `user-${Date.now()}`,
      name: fullName,
      email: cleanEmail,
      password: formData.password,
      role: formData.role || 'founder',
      roleLabel: roleMap[formData.role] || 'Student Founder',
      headline: `${roleMap[formData.role] || 'Innovator'} @ Campus Ecosystem`,
      college: formData.college || 'University Campus',
      skills: formData.role === 'developer' ? ['JavaScript', 'React', 'Node.js'] : formData.role === 'designer' ? ['Figma', 'UI/UX'] : ['Strategy', 'Pitching'],
      bio: 'Excited to build and scale startups with fellow students!',
      avatar: initials || 'VI',
      cover: 'linear-gradient(135deg, #0F172A, #1D4ED8)',
      startupName: '',
      socials: {},
      portfolio: [],
      isAdmin: cleanEmail === 'gvsharshith6@gmail.com',
      status: 'Active'
    };

    try {
      // 1. Try Backend API registration
      try {
        const res = await API.post('/auth/register', formData);
        if (res.data && res.data.success) {
          const authUser = res.data.user;
          const userToStore = { ...authUser, password: formData.password };
          setUser(userToStore);
          saveRegisteredUserToLocalStore(userToStore);
          return { success: true, message: res.data.message || 'Account created successfully!' };
        } else if (res.data && res.data.message) {
          return { success: false, message: res.data.message };
        }
      } catch (apiErr) {
        // If server explicitly returned 400 (e.g. Account already exists), return error message
        if (apiErr.response && apiErr.response.status === 400) {
          return { success: false, message: apiErr.response.data?.message || 'Account already exists.' };
        }
        console.warn('Backend server API unreachable or returned 404, falling back to local persistent store registration:', apiErr.message);
      }

      // 2. Local Persistent Account Registration Fallback
      const localUsers = getStoredRegisteredUsers();
      const existing = localUsers.find(u => u.email.toLowerCase() === cleanEmail);

      if (existing) {
        return { success: false, message: 'An account with this email address already exists. Please sign in.' };
      }

      saveRegisteredUserToLocalStore(localNewUser);
      setUser(localNewUser);
      return { success: true, message: 'Account created successfully! Welcome to VisionIn.' };

    } catch (err) {
      return { success: false, message: err.message || 'Registration error occurred.' };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      let googleUser = {
        email: "harshith.google@university.edu",
        displayName: "Harshith GVS",
        photoURL: null
      };

      if (auth && googleProvider) {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          googleUser = {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          };
        } catch (fbErr) {
          console.warn("Google Auth popup fallback active:", fbErr.message);
        }
      }

      try {
        const res = await API.post('/auth/google', googleUser);
        if (res.data && res.data.success) {
          setUser(res.data.user);
          saveRegisteredUserToLocalStore(res.data.user);
          return { success: true, user: res.data.user };
        }
      } catch (apiErr) {
        console.warn("Google API call failed, signing in locally:", apiErr.message);
      }

      const localGoogleUser = {
        id: `user-google-${Date.now()}`,
        name: googleUser.displayName || 'Google User',
        email: googleUser.email,
        role: "founder",
        roleLabel: "Student Founder",
        headline: "Founder @ VisionIn Platform",
        college: "Tech University",
        skills: ["Product Leadership", "Innovation"],
        bio: "Authenticated via Google.",
        avatar: (googleUser.displayName ? googleUser.displayName[0] : 'G') + 'U',
        photoURL: googleUser.photoURL,
        cover: "linear-gradient(120deg, #3B82F6, #1E293B)",
        startupName: "",
        socials: {},
        portfolio: [],
        isAdmin: false
      };

      setUser(localGoogleUser);
      saveRegisteredUserToLocalStore(localGoogleUser);
      return { success: true, user: localGoogleUser };

    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('visionin_user');
  };

  const updateProfile = async (updatedData) => {
    try {
      try {
        const res = await API.put('/users/profile', updatedData);
        if (res.data && res.data.success) {
          setUser(res.data.user);
          saveRegisteredUserToLocalStore(res.data.user);
          return { success: true, message: res.data.message };
        }
      } catch (apiErr) {
        console.warn("API profile update unreachable, updating local state:", apiErr.message);
      }

      if (user) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        saveRegisteredUserToLocalStore(updatedUser);
        return { success: true, message: 'Profile updated successfully!' };
      }
      return { success: false, message: 'User not logged in.' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

