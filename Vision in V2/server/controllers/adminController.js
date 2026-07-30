import { dbStore } from '../utils/store.js';

export const getAdminStats = (req, res) => {
  try {
    const stats = {
      totalUsers: dbStore.users.length,
      activeUsers: dbStore.users.filter(u => u.status === 'Active').length,
      newRegistrations: dbStore.users.length - 1,
      totalPosts: dbStore.posts.length,
      totalIdeas: dbStore.ideas.length,
      totalJobs: dbStore.jobs.length,
      totalFundingPrograms: dbStore.funding.length,
      totalSubmissions: dbStore.submissions.length,
      timestampedIdeas: dbStore.ideas.filter(i => i.status === 'Timestamped').length,
      aiRequestsCount: dbStore.aiRequestsCount,
      serverStatus: 'ONLINE (0ms Latency)',
      storageUsage: '0.4 MB / 512 MB Cluster',
      databaseVersion: 'MongoDB Atlas v7.0.5'
    };

    return res.status(200).json({
      success: true,
      stats,
      users: dbStore.users,
      posts: dbStore.posts,
      ideas: dbStore.ideas,
      jobs: dbStore.jobs,
      submissions: dbStore.submissions,
      logs: dbStore.logs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRoleByAdmin = (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = dbStore.users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const roleMap = {
      admin: 'Platform Super Admin',
      manager: 'Ecosystem Manager',
      editor: 'Content Editor',
      founder: 'Student Founder',
      developer: 'Developer / Engineer',
      designer: 'UI/UX Designer',
      investor: 'Incubator / Mentor'
    };

    user.role = role;
    user.roleLabel = roleMap[role] || role;
    user.isAdmin = role === 'admin';

    dbStore.logActivity('ROLE_CHANGE', `User ${user.name} role updated to ${user.roleLabel}`);

    return res.status(200).json({ success: true, user, message: `Updated role for ${user.name} to ${user.roleLabel}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUserByAdmin = (req, res) => {
  try {
    const { id } = req.params;
    const idx = dbStore.users.findIndex(u => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const deletedUser = dbStore.users[idx];
    if (deletedUser.email === 'gvsharshith6@gmail.com') {
      return res.status(400).json({ success: false, message: 'Super Admin account cannot be deleted.' });
    }

    dbStore.users.splice(idx, 1);
    dbStore.logActivity('USER_DELETE', `Super Admin removed member: ${deletedUser.name} (${deletedUser.email})`);

    return res.status(200).json({ success: true, message: `Member ${deletedUser.name} removed from platform.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
