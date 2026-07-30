import { dbStore } from '../utils/store.js';

export const getUsers = (req, res) => {
  try {
    const { role, skill, search, college } = req.query;
    let users = [...dbStore.users];

    if (role && role !== 'all') {
      users = users.filter(u => u.role.toLowerCase() === role.toLowerCase());
    }

    if (skill) {
      users = users.filter(u => u.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase())));
    }

    if (college) {
      users = users.filter(u => u.college?.toLowerCase().includes(college.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(q) ||
        u.headline?.toLowerCase().includes(q) ||
        u.skills?.some(s => s.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = dbStore.users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }
    const userPosts = dbStore.posts.filter(p => p.authorId === id);
    const userIdeas = dbStore.ideas.filter(i => i.userId === id && i.isPublic);

    return res.status(200).json({ success: true, user, posts: userPosts, ideas: userIdeas });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'user-1';
    const user = dbStore.users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { name, headline, college, role, skills, bio, startupName, socials, portfolio, avatar } = req.body;

    if (name) user.name = name;
    if (headline) user.headline = headline;
    if (college) user.college = college;
    if (role) {
      user.role = role;
      const roleMap = { founder: 'Student Founder', developer: 'Developer / Engineer', designer: 'UI/UX Designer', investor: 'Incubator / Mentor' };
      user.roleLabel = roleMap[role] || role;
    }
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (bio) user.bio = bio;
    if (startupName !== undefined) user.startupName = startupName;
    if (socials) user.socials = { ...user.socials, ...socials };
    if (portfolio) user.portfolio = Array.isArray(portfolio) ? portfolio : portfolio.split(',').map(p => p.trim());
    if (avatar) user.avatar = avatar;

    return res.status(200).json({ success: true, user, message: 'Profile updated successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const connectRequest = (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const requesterId = req.headers['x-user-id'] || 'user-1';

    if (requesterId === recipientId) {
      return res.status(400).json({ success: false, message: 'Cannot connect to yourself.' });
    }

    let existing = dbStore.connections.find(
      c => (c.requesterId === requesterId && c.recipientId === recipientId) ||
           (c.requesterId === recipientId && c.recipientId === requesterId)
    );

    if (existing) {
      return res.status(200).json({ success: true, connection: existing, message: `Connection status is ${existing.status}` });
    }

    const newConnection = {
      id: `conn-${Date.now()}`,
      requesterId,
      recipientId,
      status: 'pending',
      message: message || 'Would love to connect and build together!',
      createdAt: 'Just now'
    };

    dbStore.connections.push(newConnection);
    return res.status(201).json({ success: true, connection: newConnection, message: 'Connection request sent successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
