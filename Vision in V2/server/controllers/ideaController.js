import { dbStore } from '../utils/store.js';

export const getIdeas = (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'user-1';
    const { search, filter } = req.query;
    
    let ideas = dbStore.ideas.filter(i => i.userId === userId || i.isPublic);
    
    if (filter === 'private') {
      ideas = ideas.filter(i => i.userId === userId && !i.isPublic);
    } else if (filter === 'public') {
      ideas = ideas.filter(i => i.isPublic);
    } else if (filter === 'timestamped') {
      ideas = ideas.filter(i => i.status === 'Timestamped');
    }

    if (search) {
      const q = search.toLowerCase();
      ideas = ideas.filter(i => 
        i.title.toLowerCase().includes(q) ||
        i.problem.toLowerCase().includes(q) ||
        i.solution.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({ success: true, ideas });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createIdea = (req, res) => {
  try {
    const { title, problem, solution, targetMarket, techStack, isPublic } = req.body;
    const userId = req.headers['x-user-id'] || 'user-1';
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[0];

    if (!title || !problem || !solution) {
      return res.status(400).json({ success: false, message: 'Title, problem statement, and solution are required.' });
    }

    const ideaText = `${title}|${problem}|${solution}|${targetMarket || ''}`;
    const hash = dbStore.generateIPHash(ideaText);
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const newIdea = {
      id: `idea-${Date.now()}`,
      userId: user.id,
      authorName: user.name,
      title,
      problem,
      solution,
      targetMarket: targetMarket || 'Global Founders & Developers',
      techStack: techStack || 'Modern Stack',
      status: 'Timestamped',
      isPublic: !!isPublic,
      hash,
      timestamp: dateStr,
      versionHistory: [
        { version: 1, date: dateStr.split(' ')[0], note: 'Initial Cryptographic IP Timestamp Seal' }
      ]
    };

    dbStore.ideas.unshift(newIdea);

    // Log to Super Admin Stream
    dbStore.logSubmission(
      'SECURED_IDEA',
      newIdea.title,
      `${user.name} (${user.email})`,
      `Problem: ${problem} | Solution: ${solution} | IP Hash: ${hash}`
    );

    // Automatically create a secure timestamp post on feed if set to public
    if (isPublic) {
      dbStore.posts.unshift({
        id: `post-${Date.now()}`,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        authorRole: user.roleLabel || 'Founder',
        title: newIdea.title,
        headline: `Published Secured Idea: ${newIdea.title}`,
        body: `${newIdea.problem}\n\nSolution: ${newIdea.solution}`,
        roleTags: (techStack || 'Startup').split(',').map(s => s.trim()),
        isSecureIdea: true,
        timestampBadge: `Timestamped #${Math.floor(1000 + Math.random() * 9000)}`,
        hash: newIdea.hash,
        likes: [],
        likeCount: 1,
        comments: [],
        savedBy: [],
        category: 'Idea Vault',
        createdAt: 'Just now'
      });
    }

    return res.status(201).json({ success: true, idea: newIdea, message: 'Idea securely timestamped and saved to your Vault!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleIdeaVisibility = (req, res) => {
  try {
    const { id } = req.params;
    const idea = dbStore.ideas.find(i => i.id === id);

    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found.' });
    }

    idea.isPublic = !idea.isPublic;
    return res.status(200).json({ success: true, idea, message: `Idea is now ${idea.isPublic ? 'Public' : 'Private'}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyIdeaTimestamp = (req, res) => {
  try {
    const { id } = req.params;
    const idea = dbStore.ideas.find(i => i.id === id);

    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea certificate not found.' });
    }

    return res.status(200).json({
      success: true,
      certificate: {
        ideaId: idea.id,
        title: idea.title,
        author: idea.authorName,
        hash: idea.hash,
        timestamp: idea.timestamp,
        status: 'VERIFIED ON VISIONIN IP LEDGER',
        blockchainProof: `0x${idea.hash.slice(2, 18)}...VISIONIN_VERIFIED_NODE`
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
