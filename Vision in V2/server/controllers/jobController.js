import { dbStore } from '../utils/store.js';

export const getJobs = (req, res) => {
  try {
    const { type, search } = req.query;
    let jobs = [...dbStore.jobs];

    if (type && type !== 'all') {
      jobs = jobs.filter(j => j.type.toLowerCase() === type.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = (req, res) => {
  try {
    const { title, companyName, location, type, stipend, tags, description, requirements } = req.body;
    const userId = req.headers['x-user-id'] || 'user-1';
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[0];

    if (!title || !companyName || !description) {
      return res.status(400).json({ success: false, message: 'Job title, company name, and description are required.' });
    }

    const newJob = {
      id: `job-${Date.now()}`,
      title,
      companyName,
      companyLogo: companyName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      location: location || 'Remote',
      type: type || 'Internship',
      stipend: stipend || 'Competitive Stipend',
      tags: Array.isArray(tags) ? tags : (tags || 'Tech, Startup').split(',').map(t => t.trim()),
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements || '').split('\n').filter(r => r.trim()),
      postedBy: userId,
      applicantsCount: 0,
      createdAt: 'Just now'
    };

    dbStore.jobs.unshift(newJob);

    // Log to Super Admin Stream
    dbStore.logSubmission('JOB_LISTING', `${title} @ ${companyName}`, `${user.name} (${user.email})`, description);

    return res.status(201).json({ success: true, job: newJob, message: 'Opportunity posted successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const applyJob = (req, res) => {
  try {
    const { id } = req.params;
    const { resumeLink, note } = req.body;
    const userId = req.headers['x-user-id'] || 'user-1';
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[0];
    const job = dbStore.jobs.find(j => j.id === id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job listing not found.' });
    }

    job.applicantsCount += 1;

    // Log job application to Super Admin stream
    dbStore.logSubmission(
      'JOB_APPLICATION',
      `Application for ${job.title} at ${job.companyName}`,
      `${user.name} (${user.email})`,
      `Resume/Portfolio: ${resumeLink} | Cover Note: ${note || 'None'}`
    );

    return res.status(200).json({
      success: true,
      message: `Successfully submitted application to ${job.companyName} for ${job.title}!`,
      job
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
