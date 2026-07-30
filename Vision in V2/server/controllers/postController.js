import { dbStore } from '../utils/store.js';

export const getPosts = (req, res) => {
  try {
    const { category, search } = req.query;
    let result = [...dbStore.posts];
    
    if (category) {
      result = result.filter(p => p.category === category || p.roleTags.includes(category));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(q) ||
        p.body?.toLowerCase().includes(q) ||
        p.authorName?.toLowerCase().includes(q)
      );
    }
    
    return res.status(200).json({ success: true, posts: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = (req, res) => {
  try {
    const { body, roleTags, isSecureIdea, title, category } = req.body;
    const userId = req.headers['x-user-id'] || 'user-1';
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[0];

    if (!body || body.trim() === '') {
      return res.status(400).json({ success: false, message: 'Post content cannot be empty.' });
    }

    const timestampNum = Math.floor(1000 + Math.random() * 9000);
    const newPost = {
      id: `post-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: user.roleLabel || 'Founder',
      title: title || `${user.startupName || user.name}'s Post`,
      headline: user.headline,
      body,
      roleTags: roleTags || [],
      isSecureIdea: !!isSecureIdea,
      timestampBadge: isSecureIdea ? `Timestamped #${timestampNum}` : '',
      hash: isSecureIdea ? dbStore.generateIPHash(body) : '',
      likes: [],
      likeCount: 0,
      comments: [],
      savedBy: [],
      category: category || 'Ecosystem Feed',
      createdAt: 'Just now'
    };

    dbStore.posts.unshift(newPost);

    // Log submission to Super Admin stream
    dbStore.logSubmission(
      'FEED_POST',
      newPost.title,
      `${user.name} (${user.email})`,
      newPost.body.substring(0, 100) + '...'
    );

    return res.status(201).json({ success: true, post: newPost, message: 'Post published successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLikePost = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || 'user-1';
    const post = dbStore.posts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const index = post.likes.indexOf(userId);
    if (index > -1) {
      post.likes.splice(index, 1);
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      post.likes.push(userId);
      post.likeCount += 1;
    }

    return res.status(200).json({ success: true, post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.headers['x-user-id'] || 'user-1';
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[0];
    const post = dbStore.posts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text required.' });
    }

    const comment = {
      id: `c-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      text,
      createdAt: 'Just now'
    };

    post.comments.push(comment);

    // Log comment to Super Admin
    dbStore.logSubmission('POST_COMMENT', `Comment on ${post.title}`, `${user.name} (${user.email})`, text);

    return res.status(201).json({ success: true, comment, post });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleSavePost = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || 'user-1';
    const post = dbStore.posts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const index = post.savedBy.indexOf(userId);
    if (index > -1) {
      post.savedBy.splice(index, 1);
    } else {
      post.savedBy.push(userId);
    }

    return res.status(200).json({ success: true, post, isSaved: post.savedBy.includes(userId) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = (req, res) => {
  try {
    const { id } = req.params;
    const index = dbStore.posts.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    dbStore.posts.splice(index, 1);
    return res.status(200).json({ success: true, message: 'Post deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
