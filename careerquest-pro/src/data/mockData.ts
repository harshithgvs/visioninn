import { ResumeData, CourseRoadmap, QuizData, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  fullName: 'G.V.S. Harshith',
  displayName: 'HARSHI',
  college: 'Narayana Engineering College Nellore',
  degree: 'B.Tech in Computer Science & Engineering',
  year: '4th Year (2022 - 2026)',
  bio: 'Passionate 4th Year B.Tech Computer Science student at Narayana Engineering College, Nellore. Aspiring Full-Stack Software Engineer dedicated to mastering cloud architectures, building scalable AI web applications, and constantly elevating skills through hands-on engineering projects.',
  email: 'gvs.harshith@example.com',
  phone: '+91 98765 43210',
  location: 'Nellore, Andhra Pradesh, India',
};

export const INITIAL_RESUMES: ResumeData[] = [
  {
    id: 'res-1',
    title: 'Full Stack Engineer Resume',
    templateId: 'modern-clean',
    updatedAt: new Date().toISOString(),
    fullName: 'G.V.S. Harshith',
    targetRole: 'Full Stack Software Engineer',
    email: 'gvs.harshith@example.com',
    phone: '+91 98765 43210',
    location: 'Nellore, Andhra Pradesh, India',
    linkedin: 'linkedin.com/in/gvsharshith',
    github: 'github.com/gvsharshith',
    summary: 'Passionate 4th Year B.Tech Computer Science student at Narayana Engineering College, Nellore. Aspiring Full-Stack Software Engineer dedicated to mastering cloud architectures, building scalable AI web applications, and constantly elevating skills through hands-on engineering projects.',
    skills: [
      {
        id: 'sk-1',
        category: 'Frontend & Web Development',
        items: ['React 19', 'TypeScript', 'Tailwind CSS', 'JavaScript (ES6+)', 'HTML5/CSS3', 'WebSockets'],
      },
      {
        id: 'sk-2',
        category: 'Backend & Databases',
        items: ['Node.js', 'Express.js', 'Python', 'PostgreSQL', 'RESTful APIs', 'SQL'],
      },
      {
        id: 'sk-3',
        category: 'AI Tools & Core CS',
        items: ['Gemini API', 'Data Structures & Algorithms', 'Git / GitHub', 'System Design Basics'],
      },
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'AutoPath AI Tech Labs',
        role: 'Full Stack Developer Intern',
        location: 'Nellore / Remote',
        startDate: 'Jan 2025',
        endDate: 'Present',
        highlights: [
          'Engineered a responsive AI resume & learning roadmap web application using React, TypeScript, and Express.',
          'Integrated Gemini API server-side proxy routes for instant prompt-based resume generation and ATS keyword matching.',
          'Optimized component renders and state management, achieving sub-100ms UI interaction latency.',
        ],
      },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'AutoPath AI Platform',
        techStack: ['React', 'TypeScript', 'Express', 'Gemini API', 'Tailwind CSS'],
        description: 'An AI-powered career platform providing instant ATS resume generation, interactive roadmaps, and dynamic skill mock tests.',
        link: 'https://autopath.ai',
      },
      {
        id: 'proj-2',
        title: 'Campus Placement & Skill Assessment Portal',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        description: 'Full-stack placement assessment portal built for college students to practice tech quizzes and track interview readiness.',
        link: 'https://github.com/gvsharshith/placement-portal',
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'Narayana Engineering College Nellore',
        degree: 'B.Tech in Computer Science & Engineering',
        year: '2022 - 2026 (4th Year)',
        gpa: '8.8 / 10.0 CGPA',
      },
    ],
    certifications: [
      'Meta Front-End Developer Professional Certificate',
      'AWS Academy Graduate - Cloud Foundations',
      'Narayana Tech Excellence Award in Web Development',
    ],
  },
];


export const INITIAL_ROADMAPS: CourseRoadmap[] = [
  {
    id: 'road-webdev',
    title: 'Full-Stack Web Development',
    category: 'web-dev',
    description: 'Master modern frontend & backend development from HTML/CSS fundamentals to production Node.js, React, and cloud deployments.',
    estimatedWeeks: 12,
    iconName: 'Code',
    colorTheme: 'indigo',
    prerequisites: ['Basic Computer Literacy', 'Logical Problem Solving'],
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: 'Web Foundations & Modern CSS',
        description: 'Build responsive layouts and interactive user interfaces using semantic HTML5, CSS Grid/Flexbox, and Tailwind CSS.',
        estimatedHours: 25,
        projectIdea: 'Build a responsive SaaS Landing Page with dark mode and smooth animations.',
        topics: [
          {
            topicTitle: 'Semantic HTML & Accessibility (a11y)',
            summary: 'Structure web documents properly using landmark elements and ARIA standards.',
            keyTakeaways: ['HTML5 structural tags', 'ARIA attributes & screen reader testing', 'Keyboard navigation'],
            resourceType: 'Interactive Tutorial',
          },
          {
            topicTitle: 'Modern CSS, Flexbox & Tailwind CSS',
            summary: 'Master utility-first styling, fluid typography, and responsive grid layouts.',
            keyTakeaways: ['Flexbox alignment math', 'CSS Grid templates', 'Tailwind spacing & color tokens'],
            resourceType: 'Video Course & Practice',
          },
        ],
      },
      {
        phaseNumber: 2,
        phaseTitle: 'Core JavaScript & TypeScript',
        description: 'Deep dive into asynchronous JS, DOM manipulation, ES6+ syntax, and static type safety with TypeScript.',
        estimatedHours: 35,
        projectIdea: 'Create an interactive Task Manager with localStorage persistence and filter sorting.',
        topics: [
          {
            topicTitle: 'ES6+ & Async JavaScript (Promises, Async/Await)',
            summary: 'Understand the event loop, execution context, closures, and asynchronous network calls.',
            keyTakeaways: ['Event loop & microtask queue', 'Fetch API & error handling', 'Promises vs Async/Await'],
            resourceType: 'Documentation & Labs',
          },
          {
            topicTitle: 'TypeScript Essentials & Strict Typing',
            summary: 'Prevent runtime errors by declaring explicit interfaces, generics, and union types.',
            keyTakeaways: ['Interfaces vs Types', 'Generic functions', 'Strict null checks'],
            resourceType: 'Interactive Exercises',
          },
        ],
      },
      {
        phaseNumber: 3,
        phaseTitle: 'Frontend Engineering with React 19',
        description: 'Learn component state management, custom hooks, virtual DOM rendering, and client-side performance optimization.',
        estimatedHours: 40,
        projectIdea: 'Develop a real-time E-Commerce Storefront with shopping cart state and product search.',
        topics: [
          {
            topicTitle: 'React Hooks (useState, useEffect, useMemo)',
            summary: 'Master component lifecycle, state immutability, and side-effect management.',
            keyTakeaways: ['Custom hooks creation', 'Effect cleanup functions', 'Memoization strategies'],
            resourceType: 'Code Sandbox Project',
          },
          {
            topicTitle: 'State Management & Router Navigation',
            summary: 'Manage complex global state and multi-page application flows seamlessly.',
            keyTakeaways: ['Context API vs State Stores', 'Dynamic routing parameters', 'Route guards'],
            resourceType: 'Guided Walkthrough',
          },
        ],
      },
      {
        phaseNumber: 4,
        phaseTitle: 'Backend Architecture & Cloud API',
        description: 'Build RESTful APIs with Express, connect relational databases (PostgreSQL), and implement JWT authentication.',
        estimatedHours: 45,
        projectIdea: 'Architect a full-stack REST API backend with user authentication and database persistence.',
        topics: [
          {
            topicTitle: 'Express.js API Design & Middleware',
            summary: 'Structure scalable HTTP servers with route handlers, validation, and error middlewares.',
            keyTakeaways: ['REST architectural standards', 'Middleware pipelines', 'Rate limiting & security'],
            resourceType: 'Backend Lab',
          },
          {
            topicTitle: 'Database Modeling & PostgreSQL Queries',
            summary: 'Design relational database schemas, foreign keys, and perform optimized SQL queries.',
            keyTakeaways: ['Schema normalization (3NF)', 'Indexing strategies', 'SQL joins & aggregations'],
            resourceType: 'Hands-on Database Exercises',
          },
        ],
      },
    ],
  },
  {
    id: 'road-aiml',
    title: 'AI & Data Science Specialist',
    category: 'ai-ml',
    description: 'Pathway into artificial intelligence, LLM prompt engineering, machine learning pipelines, and vector databases.',
    estimatedWeeks: 10,
    iconName: 'Sparkles',
    colorTheme: 'emerald',
    prerequisites: ['Python Basics', 'Linear Algebra & Statistics Basics'],
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: 'Python Data Stack & EDA',
        description: 'Analyze real-world data distributions using NumPy, Pandas, and Matplotlib.',
        estimatedHours: 30,
        projectIdea: 'Analyze global housing market trends and produce a visual insights report.',
        topics: [
          {
            topicTitle: 'Pandas DataFrames & Data Cleaning',
            summary: 'Filter, merge, group, and clean complex tabular data.',
            keyTakeaways: ['Handling missing values', 'GroupBy aggregations', 'Feature engineering'],
            resourceType: 'Data Notebook',
          },
        ],
      },
      {
        phaseNumber: 2,
        phaseTitle: 'Machine Learning Algorithms',
        description: 'Train supervised and unsupervised ML models using Scikit-Learn.',
        estimatedHours: 40,
        projectIdea: 'Build a Customer Churn Predictor model with 90%+ accuracy.',
        topics: [
          {
            topicTitle: 'Regression, Classification & Model Evaluation',
            summary: 'Understand precision, recall, ROC-AUC, and hyperparameter tuning.',
            keyTakeaways: ['Decision trees & Random Forests', 'Cross-validation', 'Confusion matrix analysis'],
            resourceType: 'ML Competition Lab',
          },
        ],
      },
      {
        phaseNumber: 3,
        phaseTitle: 'Generative AI & LLM Applications',
        description: 'Integrate Gemini API, vector embeddings, and Retrieval-Augmented Generation (RAG).',
        estimatedHours: 35,
        projectIdea: 'Create an AI Knowledge Assistant that answers questions based on uploaded PDF documents.',
        topics: [
          {
            topicTitle: 'LLM Prompt Engineering & Gemini SDK',
            summary: 'Leverage structured JSON outputs, system instructions, and function calling.',
            keyTakeaways: ['Few-shot prompting', 'Structured schema output', 'Safety settings'],
            resourceType: 'Hands-on API Lab',
          },
        ],
      },
    ],
  },
  {
    id: 'road-devops',
    title: 'Cloud Architect & DevOps Engineer',
    category: 'cloud-devops',
    description: 'Containerization, CI/CD automation pipelines, Kubernetes clusters, and cloud server provisioning.',
    estimatedWeeks: 10,
    iconName: 'Server',
    colorTheme: 'cyan',
    prerequisites: ['Linux Command Line', 'Basic Networking'],
    phases: [
      {
        phaseNumber: 1,
        phaseTitle: 'Linux Administration & Shell Scripting',
        description: 'Master Bash commands, process management, SSH keys, and system logs.',
        estimatedHours: 25,
        projectIdea: 'Automate system health monitoring and email alert scripts.',
        topics: [
          {
            topicTitle: 'Linux Permissions, Bash & Systemd',
            summary: 'Manage background services, file permissions, and environment variables.',
            keyTakeaways: ['Cron jobs & automation', 'File ownership & chmod', 'Network diagnostic tools'],
            resourceType: 'Terminal Sandbox',
          },
        ],
      },
      {
        phaseNumber: 2,
        phaseTitle: 'Docker & Microservice Containerization',
        description: 'Package applications into lightweight, isolated Docker containers and multi-container Docker Compose environments.',
        estimatedHours: 30,
        projectIdea: 'Containerize a full-stack React + Node + Postgres application stack with Docker Compose.',
        topics: [
          {
            topicTitle: 'Dockerfiles & Multi-Stage Builds',
            summary: 'Write optimized Dockerfiles with minimal image footprints and security best practices.',
            keyTakeaways: ['Layer caching strategies', 'Alpine vs Debian base images', 'Environment secret handling'],
            resourceType: 'Hands-on Workshop',
          },
        ],
      },
    ],
  },
];

export const INITIAL_QUIZZES: QuizData[] = [
  {
    id: 'quiz-react-1',
    quizTitle: 'React 19 & Modern Web Engineering',
    topic: 'React 19 & Web Development',
    difficulty: 'Intermediate',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        questionText: 'What is the main benefit of React 19 Server Components (RSC)?',
        options: [
          'They execute entirely on the browser DOM to speed up re-renders.',
          'They render on the server without sending component JavaScript bundle to the client.',
          'They replace the need for CSS files by auto-generating Tailwind classes.',
          'They require all state variables to be converted into global Context.',
        ],
        correctOptionIndex: 1,
        explanation: 'React Server Components execute exclusively on the server side and send lightweight HTML/JSON payload to the client, reducing client bundle size significantly.',
        conceptCategory: 'React Architecture',
      },
      {
        id: 2,
        questionText: 'Which Hook in React is recommended to prevent expensive calculations from running on every single render?',
        options: ['useEffect', 'useCallback', 'useMemo', 'useRef'],
        correctOptionIndex: 2,
        explanation: 'useMemo memoizes the computed result of a function and only recalculates it when one of its dependencies changes.',
        conceptCategory: 'React Performance',
      },
      {
        id: 3,
        questionText: 'In TypeScript, what is the key difference between an interface and a type alias for defining object shapes?',
        options: [
          'Interfaces can be extended via declaration merging, whereas types cannot be redeclared.',
          'Type aliases only support primitive values and cannot describe objects.',
          'Interfaces are converted into runtime JavaScript objects, whereas types are deleted.',
          'There is no difference at all; both behave identically in all scenarios.',
        ],
        correctOptionIndex: 0,
        explanation: 'Interfaces allow declaration merging (multiple interface definitions with the same name automatically combine properties), whereas type aliases cannot be reopened once declared.',
        conceptCategory: 'TypeScript',
      },
      {
        id: 4,
        questionText: 'What HTTP status code represents a "401 Unauthorized" response from a web server API?',
        options: [
          '400 Bad Request',
          '401 Client lacks valid authentication credentials',
          '403 Server understands credentials but forbids access',
          '404 Resource Not Found',
        ],
        correctOptionIndex: 1,
        explanation: '401 Unauthorized specifically means authentication credentials are missing or invalid (e.g. missing JWT or invalid API token).',
        conceptCategory: 'HTTP & APIs',
      },
      {
        id: 5,
        questionText: 'What CSS layout module is designed specifically for two-dimensional layouts (both rows and columns simultaneously)?',
        options: ['Flexbox', 'CSS Grid', 'Position Absolute', 'Float Layout'],
        correctOptionIndex: 1,
        explanation: 'CSS Grid is a 2D layout model handling both rows and columns, whereas Flexbox is primarily a 1D layout model (either row or column).',
        conceptCategory: 'CSS Layout',
      },
    ],
  },
  {
    id: 'quiz-python-ai',
    quizTitle: 'Python & AI Engineering Essentials',
    topic: 'Python, Machine Learning & LLMs',
    difficulty: 'Intermediate',
    timeLimitMinutes: 10,
    questions: [
      {
        id: 1,
        questionText: 'In Python list comprehension, what is the correct syntax to square all even numbers in a list `nums`?',
        options: [
          '[x**2 for x in nums if x % 2 == 0]',
          '[x*2 in nums where x % 2 == 0]',
          'nums.map(x => x**2 if x % 2 == 0)',
          '[for x in nums select x**2 if even]',
        ],
        correctOptionIndex: 0,
        explanation: 'The standard list comprehension syntax filtering even numbers and squaring them is `[x**2 for x in nums if x % 2 == 0]`.',
        conceptCategory: 'Python Basics',
      },
      {
        id: 2,
        questionText: 'What is the core purpose of a Vector Database (e.g., Pinecone, Chroma, Qdrant) in Generative AI / RAG applications?',
        options: [
          'To store structured relational tables with SQL primary key joins.',
          'To store mathematical vector embeddings for fast semantic similarity search.',
          'To cache CSS stylesheets for web applications.',
          'To compile Python code into C bytecode.',
        ],
        correctOptionIndex: 1,
        explanation: 'Vector databases store high-dimensional numerical vectors (embeddings) generated by AI models and perform fast cosine or Euclidean similarity searches.',
        conceptCategory: 'AI Architecture',
      },
      {
        id: 3,
        questionText: 'What does "Temperature" control when calling Large Language Models like Gemini?',
        options: [
          'The CPU clock temperature of the server processing the request.',
          'The randomness/creativity level of the generated output token choices.',
          'The speed of internet transmission bandwidth.',
          'The maximum character length of the prompt input.',
        ],
        correctOptionIndex: 1,
        explanation: 'Temperature controls the degree of randomness in token selection. Lower values (e.g., 0.2) yield deterministic factual outputs, while higher values (e.g., 0.8+) yield creative variations.',
        conceptCategory: 'Prompt Engineering',
      },
    ],
  },
  {
    id: 'quiz-devops-cloud',
    quizTitle: 'Docker & Cloud Architecture Quiz',
    topic: 'Cloud, Docker & DevOps',
    difficulty: 'Intermediate',
    timeLimitMinutes: 8,
    questions: [
      {
        id: 1,
        questionText: 'What is the command to list all running and stopped Docker containers on a system?',
        options: ['docker container list --all', 'docker ps -a', 'docker status', 'Both A and B are correct'],
        correctOptionIndex: 3,
        explanation: 'Both `docker ps -a` and `docker container list --all` list all running and stopped containers in Docker.',
        conceptCategory: 'Docker CLI',
      },
      {
        id: 2,
        questionText: 'What key benefit does Docker Multi-Stage builds offer in software production?',
        options: [
          'Allows running Windows and Mac OS inside the same image.',
          'Dramatically reduces final container image size by discarding build tools/dependencies from final runtime layer.',
          'Auto-generates domain SSL certificates.',
          'Increases RAM speed by 200%.',
        ],
        correctOptionIndex: 1,
        explanation: 'Multi-stage builds allow you to use temporary build containers (with compilers, dev dependencies) and copy only compiled artifacts into a lightweight final image.',
        conceptCategory: 'Container Security',
      },
    ],
  },
];
