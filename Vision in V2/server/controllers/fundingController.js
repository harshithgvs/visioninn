import { dbStore } from '../utils/store.js';

export const getFundingPrograms = (req, res) => {
  try {
    const { type, search } = req.query;
    let list = [...dbStore.funding];

    if (type && type !== 'all') {
      list = list.filter(f => f.type.toLowerCase() === type.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f => 
        f.programName.toLowerCase().includes(q) ||
        f.organization.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({ success: true, funding: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitPitch = (req, res) => {
  try {
    const { programId, pitchDeckLink, summary, startupName } = req.body;
    const userId = req.headers['x-user-id'] || 'user-1';
    const user = dbStore.users.find(u => u.id === userId) || dbStore.users[0];
    const program = dbStore.funding.find(f => f.id === programId);

    if (!program) {
      return res.status(404).json({ success: false, message: 'Funding program not found.' });
    }

    const submission = {
      id: `sub-${Date.now()}`,
      programId,
      applicant: user.name,
      pitchDeckLink,
      submittedAt: 'Just now'
    };

    // Log Pitch Deck Submission to Super Admin Stream
    dbStore.logSubmission(
      'PITCH_DECK',
      `Pitch to ${program.programName} (${startupName || user.startupName || 'Startup'})`,
      `${user.name} (${user.email})`,
      `Pitch Deck Link: ${pitchDeckLink} | Summary: ${summary || 'None'}`
    );

    return res.status(200).json({
      success: true,
      message: `Pitch deck for ${startupName || user.startupName || 'your startup'} submitted to ${program.programName}! The evaluation team will review your application.`,
      submission
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
