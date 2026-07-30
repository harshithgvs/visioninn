import { dbStore } from '../utils/store.js';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = dbStore.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found. Please create an account.' });
    }

    if (user.password && user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
    }

    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, college, password } = req.body;
    if (!email || !firstName || !password) {
      return res.status(400).json({ success: false, message: 'First name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const fullName = `${firstName} ${lastName || ''}`.trim();
    const existing = dbStore.users.find(u => u.email.toLowerCase() === cleanEmail);
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
    }

    const roleMap = {
      founder: 'Student Founder',
      manager: 'Ecosystem Manager',
      editor: 'Content Editor',
      developer: 'Developer / Engineer',
      designer: 'UI/UX Designer',
      investor: 'Incubator / Mentor'
    };

    const newUser = {
      id: `user-${Date.now()}`,
      name: fullName,
      email: cleanEmail,
      password: password,
      role: role || 'founder',
      roleLabel: roleMap[role] || 'Student Founder',
      headline: `${roleMap[role] || 'Innovator'} @ Campus Ecosystem`,
      college: college || 'University Student',
      skills: role === 'developer' ? ['JavaScript', 'React', 'Node.js'] : role === 'designer' ? ['Figma', 'UI/UX'] : ['Strategy', 'Pitching'],
      bio: 'Excited to build and scale startups with fellow students!',
      avatar: (firstName[0] + (lastName ? lastName[0] : firstName[1] || 'X')).toUpperCase(),
      cover: 'linear-gradient(135deg, #0F172A, #1D4ED8)',
      startupName: '',
      socials: {},
      portfolio: [],
      isAdmin: cleanEmail === 'gvsharshith6@gmail.com',
      status: 'Active',
      lastLogin: 'Just now'
    };

    dbStore.users.push(newUser);
    dbStore.logActivity('SIGNUP', `New Ecosystem account registered: ${newUser.name} (${newUser.email})`);
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: newUser
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { email, displayName, photoURL } = req.body;
    const userEmail = email || 'google.user@visionin.io';
    let user = dbStore.users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
    
    if (!user) {
      const name = displayName || 'Google User';
      const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      user = {
        id: `user-${Date.now()}`,
        name,
        email: userEmail,
        role: "founder",
        roleLabel: "Student Founder",
        headline: "Founder @ VisionIn Platform",
        college: "Tech University",
        skills: ["Product Leadership", "Innovation"],
        bio: "Joined via Google authentication.",
        avatar: initials || "GU",
        photoURL: photoURL || null,
        cover: "linear-gradient(120deg, #3B82F6, #1E293B)",
        startupName: "",
        socials: {},
        portfolio: [],
        isAdmin: false
      };
      dbStore.users.push(user);
    }

    const token = `google-auth-token-${user.id}`;
    return res.status(200).json({ success: true, user, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const user = dbStore.users.find(u => u.id === userId) || dbStore.users[0];
  return res.status(200).json({ success: true, user });
};
