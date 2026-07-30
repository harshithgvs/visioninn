import crypto from 'crypto';

// Seed users initialized with explicit Super Admin account for Harshith GVS
export const initialUsers = [
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
    status: "Active",
    lastLogin: "Just now"
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
    bio: "Passionate about leveraging IoT and computer vision to solve agricultural bottlenecks for smallholder farmers.",
    avatar: "RK",
    cover: "linear-gradient(120deg, #1D4ED8, #0F172A)",
    startupName: "AgriSense AI",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com", twitter: "https://twitter.com" },
    portfolio: ["AgriSense Web App", "Smart Irrigation System"],
    isAdmin: false,
    status: "Active",
    lastLogin: "2 hours ago"
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
    status: "Active",
    lastLogin: "1 day ago"
  },
  {
    id: "user-3",
    name: "Neha Verma",
    email: "neha@university.edu",
    password: "password123",
    role: "editor",
    roleLabel: "Content Editor",
    headline: "Senior Editor & UI/UX Designer · 3 MVPs shipped",
    college: "NID Ahmedabad",
    skills: ["Figma", "Content Moderation", "Design Systems"],
    bio: "Curating startup success stories, legal templates, and educational roadmaps.",
    avatar: "NV",
    cover: "linear-gradient(120deg, #8B5CF6, #0F172A)",
    startupName: "PixelCraft Studio",
    socials: { linkedin: "https://linkedin.com", website: "https://dribbble.com" },
    portfolio: ["Design Tokens Library", "Fintech Mobile App"],
    isAdmin: false,
    status: "Active",
    lastLogin: "3 days ago"
  },
  {
    id: "user-4",
    name: "Tarun Reddy",
    email: "tarun@university.edu",
    password: "password123",
    role: "developer",
    roleLabel: "Full-Stack Developer",
    headline: "Full-Stack Developer · Node.js & React Expert",
    college: "BITS Pilani",
    skills: ["Node.js", "React", "MongoDB", "Docker"],
    bio: "Full stack developer building backends and reactive frontends.",
    avatar: "TR",
    cover: "linear-gradient(120deg, #10B981, #0F172A)",
    startupName: "",
    socials: { github: "https://github.com" },
    portfolio: ["Distributed Task Queue"],
    isAdmin: false,
    status: "Active",
    lastLogin: "4 hours ago"
  }
];

export const initialPosts = [
  {
    id: "post-1",
    authorId: "user-2",
    authorName: "Sneha Patil",
    authorAvatar: "SP",
    authorRole: "Ecosystem Manager",
    title: "GreenCart - Hyperlocal Farm Produce Marketplace",
    headline: "Building GreenCart — Hyperlocal Farm Produce Marketplace",
    body: "Looking for technical co-founders to join GreenCart. Our MVP is validated with 3 local vendors. We are prepping for the university incubator pitch deck deadline next month!",
    roleTags: ["Flutter Developer", "UI/UX Designer", "AI/ML Engineer"],
    isSecureIdea: true,
    timestampBadge: "Timestamped #4092",
    hash: "sha256-a9f8b7c6d5e4f3a2b109876543210fe",
    likes: ["user-admin", "user-1", "user-3", "user-4"],
    likeCount: 34,
    comments: [
      { id: "c1", authorId: "user-admin", authorName: "Harshith GVS", authorAvatar: "HG", text: "Great initiative Sneha! Verified and featured on incubator showcase.", createdAt: "1 hour ago" },
      { id: "c2", authorId: "user-4", authorName: "Tarun Reddy", authorAvatar: "TR", text: "Hey Sneha, I'd love to chat about the Flutter backend setup!", createdAt: "30 mins ago" }
    ],
    savedBy: ["user-admin"],
    category: "Co-Founder Request",
    createdAt: "2h ago"
  },
  {
    id: "post-2",
    authorId: "user-1",
    authorName: "AgriSense Technologies",
    authorAvatar: "AS",
    authorRole: "Startup Company",
    title: "Computer Vision & Embedded Systems Internship",
    headline: "Published an Internship Opportunity · Seed stage startup",
    body: "We are looking for student interns to help build computer vision modules for smart soil analysis. Direct mentorship from senior founders and potential equity path.",
    roleTags: ["Python / OpenCV", "Embedded Systems"],
    isSecureIdea: false,
    timestampBadge: "",
    likes: ["user-admin", "user-2"],
    likeCount: 19,
    comments: [
      { id: "c3", authorId: "user-3", authorName: "Neha Verma", authorAvatar: "NV", text: "Are you also looking for UI designers for the field app dashboard?", createdAt: "3 hours ago" }
    ],
    savedBy: [],
    category: "Internship Hiring",
    createdAt: "Yesterday"
  }
];

export const initialIdeas = [
  {
    id: "idea-101",
    userId: "user-admin",
    authorName: "Harshith GVS",
    title: "Autonomous Crop Health Scanner using Edge AI",
    problem: "Smallholder farmers lose up to 30% yield due to undetected early crop diseases and pest infestations.",
    solution: "Low-cost mobile camera attachment connected to edge AI model to diagnose leaf pathology instantly without internet connection.",
    targetMarket: "Agricultural cooperatives & polyhouse farmers in South Asia",
    techStack: "PyTorch Mobile, Raspberry Pi, React Native",
    status: "Timestamped",
    isPublic: true,
    hash: "0x8f3c7e9a2b1d4f6e5a0c3b2a1987654321fedcba9876543210abcdef12345678",
    timestamp: "2026-06-15 10:45:00 UTC",
    versionHistory: [
      { version: 1, date: "2026-06-15", note: "Initial IP Hash registration on VisionIn Vault" }
    ]
  }
];

export const initialJobs = [
  {
    id: "job-1",
    title: "AI / Computer Vision Engineering Intern",
    companyName: "AgriSense AI",
    companyLogo: "AS",
    location: "Remote / IIT Madras Research Park",
    type: "Internship",
    stipend: "₹15,000 / month + Equity Options",
    tags: ["Python", "PyTorch", "OpenCV"],
    description: "Work directly with the co-founders to build real-time soil classification models.",
    requirements: ["Proficiency in Python and PyTorch"],
    postedBy: "user-1",
    applicantsCount: 14,
    createdAt: "2 days ago"
  }
];

export const initialFundingPrograms = [
  {
    id: "fund-1",
    programName: "NIDHI-PRAYAS Prototype Grant",
    organization: "DST, Govt. of India & IIT Incubator",
    logo: "NP",
    type: "Grant",
    equity: "0% Equity (Non-dilutive)",
    fundingAmount: "Up to ₹10,000,000",
    deadline: "August 30, 2026",
    description: "Proof-of-concept grant support for hardware, deep-tech, and AI student startups.",
    eligibility: "Student-led teams with validated prototype concept"
  }
];

export const initialSubmissions = [
  {
    id: "sub-1",
    category: "PITCH_DECK",
    title: "AgriSense AI Prototype Pitch Deck",
    submittedBy: "Ravi Kumar (ravi@university.edu)",
    details: "Submitted pitch deck to NIDHI-PRAYAS Prototype Grant. Link: https://drive.google.com/pitch/agrisense",
    timestamp: "10 mins ago"
  },
  {
    id: "sub-2",
    category: "JOB_APPLICATION",
    title: "AI Engineering Intern Application",
    submittedBy: "Tarun Reddy (tarun@university.edu)",
    details: "Applied for AI / Computer Vision Engineering Intern at AgriSense AI. Resume: https://github.com/tarun/resume.pdf",
    timestamp: "1 hour ago"
  },
  {
    id: "sub-3",
    category: "SECURED_IDEA",
    title: "Autonomous Crop Health Scanner using Edge AI",
    submittedBy: "Harshith GVS (gvsharshith6@gmail.com)",
    details: "Cryptographic SHA-256 IP Timestamp Seal: 0x8f3c7e9a2b1d4f6e5a0c3b2a1987654321fedcba9876543210abcdef12345678",
    timestamp: "2 hours ago"
  },
  {
    id: "sub-4",
    category: "COFOUNDER_CONNECT",
    title: "Connection Request to Harshith GVS",
    submittedBy: "Neha Verma (neha@university.edu)",
    details: "Message: 'Hi Harshith, loved your VisionIn platform architecture! Would love to collaborate on UI design systems.'",
    timestamp: "3 hours ago"
  }
];

export const initialLogs = [
  { id: "log-1", type: "LOGIN", message: "Super Admin Harshith GVS authenticated (gvsharshith6@gmail.com)", timestamp: "Just now" },
  { id: "log-2", type: "SUBMISSION_RECEIVED", message: "New pitch submission logged for AgriSense AI to NIDHI-PRAYAS Grant", timestamp: "10 mins ago" },
  { id: "log-3", type: "SIGNUP", message: "New Ecosystem account registered: Sneha Patil (Manager)", timestamp: "1 day ago" }
];

class InMemoryStore {
  constructor() {
    this.users = [...initialUsers];
    this.posts = [...initialPosts];
    this.ideas = [...initialIdeas];
    this.jobs = [...initialJobs];
    this.funding = [...initialFundingPrograms];
    this.connections = [];
    this.submissions = [...initialSubmissions];
    this.logs = [...initialLogs];
    this.aiRequestsCount = 142;
  }

  logActivity(type, message) {
    this.logs.unshift({
      id: `log-${Date.now()}`,
      type,
      message,
      timestamp: "Just now"
    });
  }

  logSubmission(category, title, submittedBy, details) {
    const newSub = {
      id: `sub-${Date.now()}`,
      category,
      title,
      submittedBy,
      details,
      timestamp: "Just now"
    };
    this.submissions.unshift(newSub);
    this.logActivity('DATA_RECEIVED', `[${category}] ${title} from ${submittedBy}`);
    return newSub;
  }

  generateIPHash(ideaText) {
    const hash = crypto.createHash('sha256').update(ideaText + Date.now().toString()).digest('hex');
    return `0x${hash}`;
  }
}

export const dbStore = new InMemoryStore();
