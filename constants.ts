

import { Course, Specialization, DeepDiveData, SoftSkill } from './types';

export const TEAM_DATA = {
  mentor: {
      name: "Dr. Sayantan Sinha",
      role: "PROJECT MENTOR",
      phone: "", // Phone removed as per new spec not mentioning it explicitly, or keep empty if not provided
      email: "sayantan.sinha@gla.ac.in",
      linkedin: "https://www.linkedin.com/in/dr-sayantan-sinha-1b56a567?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      desc: "Guiding our vision with expertise and leadership."
  },
  members: [
      {
          name: "Alankrita Pathak",
          role: "TEAM LEAD",
          email: "k955776758@gmail.com",
          linkedin: "https://www.linkedin.com/in/alankrita-pathak-189266397?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
      {
          name: "Saksham Chaturvedi",
          role: "Developer",
          email: "time62135@gmail.com",
          linkedin: "https://www.linkedin.com/in/saksham-chaturvedi-9974a43a8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
      {
          name: "Pradyumn Rana",
          role: "Developer",
          email: "pradyumn2304@gmail.com",
          linkedin: "https://www.linkedin.com/in/pradyumn-rana-81b886383?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
      {
          name: "Krishna Upadhyay",
          role: "Developer",
          email: "k955776758@gmail.com",
          linkedin: "https://www.linkedin.com/in/krishna-upadhyay-829113384?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
  ]
};

export const COURSES: Course[] = [
  {
      id: "c1",
      name: "Engineering",
      full: "B.Tech / B.E.",
      icon: "cpu",
      desc: "The builders of the physical and digital world.",
      theme: "blue",
      gradient: "from-blue-600 to-cyan-400",
      bgLight: "bg-neo-blue",
      bgDark: "bg-blue-900/20",
      border: "border-blue-200"
  },
  {
      id: "c2",
      name: "Computer App",
      full: "BCA / MCA / B.Sc",
      icon: "code-2",
      desc: "Software, Systems, and Algorithmic Logic.",
      theme: "violet",
      gradient: "from-violet-600 to-fuchsia-500",
      bgLight: "bg-neo-purple",
      bgDark: "bg-violet-900/20",
      border: "border-violet-200"
  },
  {
      id: "c3",
      name: "Business",
      full: "BBA / MBA / B.Com",
      icon: "briefcase",
      desc: "Strategy, Finance, and Market Leadership.",
      theme: "amber",
      gradient: "from-amber-400 to-orange-600",
      bgLight: "bg-neo-yellow",
      bgDark: "bg-amber-900/20",
      border: "border-amber-200"
  },
  {
      id: "c4",
      name: "Design & Arts",
      full: "B.Des / B.A.",
      icon: "palette",
      desc: "Visuals, Experience, and Creative Expression.",
      theme: "rose",
      gradient: "from-rose-500 to-pink-500",
      bgLight: "bg-neo-rose",
      bgDark: "bg-rose-900/20",
      border: "border-rose-200"
  },
  {
      id: "c5",
      name: "Life Sciences",
      full: "B.Sc / B.Tech Bio",
      icon: "microscope",
      desc: "Intersection of biology, technology, and data.",
      theme: "emerald",
      gradient: "from-emerald-400 to-teal-600",
      bgLight: "bg-neo-green",
      bgDark: "bg-emerald-900/20",
      border: "border-emerald-200"
  },
  {
      id: "c6",
      name: "Infrastructure",
      full: "B.Arch / B.Tech Civil",
      icon: "building-2",
      desc: "Designing sustainable infrastructure for the future.",
      theme: "orange",
      gradient: "from-orange-400 to-red-500",
      bgLight: "bg-neo-yellow",
      bgDark: "bg-orange-900/20",
      border: "border-orange-200"
  },
];

export const SPECIALIZATIONS: Specialization[] = [
  { id: "s1", courseId: "c1", name: "Full Stack Development", growth: "High", salary: "₹6L - ₹24L", tags: ["Web", "SaaS"] },
  { id: "s2", courseId: "c1", name: "AI & Machine Learning", growth: "Explosive", salary: "₹8L - ₹30L", tags: ["Data", "R&D"] },
  { id: "s3", courseId: "c1", name: "DevOps & Cloud Arch", growth: "High", salary: "₹7L - ₹25L", tags: ["AWS", "Infra"] },
  { id: "s10", courseId: "c1", name: "VLSI & Embedded", growth: "Stable", salary: "₹6L - ₹20L", tags: ["Hardware", "Chips"] },
  { id: "s11", courseId: "c1", name: "Robotics Engineering", growth: "Rising", salary: "₹5L - ₹18L", tags: ["Mechatronics", "Auto"] },
  { id: "s4", courseId: "c2", name: "Mobile Engineering", growth: "Stable", salary: "₹5L - ₹18L", tags: ["iOS", "Android"] },
  { id: "s12", courseId: "c2", name: "Cyber Security Analyst", growth: "Very High", salary: "₹6L - ₹22L", tags: ["Security", "Network"] },
  { id: "s13", courseId: "c2", name: "Game Development", growth: "Moderate", salary: "₹4L - ₹15L", tags: ["Unity", "3D"] },
  { id: "s14", courseId: "c2", name: "Blockchain Developer", growth: "Explosive", salary: "₹8L - ₹30L", tags: ["Web3", "Smart Contracts"] },
  { id: "s5", courseId: "c3", name: "Product Management", growth: "High", salary: "₹10L - ₹35L", tags: ["Strategy", "Tech"] },
  { id: "s6", courseId: "c3", name: "Digital Marketing", growth: "Moderate", salary: "₹4L - ₹12L", tags: ["SEO", "Ads"] },
  { id: "s15", courseId: "c3", name: "Financial Analyst", growth: "High", salary: "₹7L - ₹22L", tags: ["Finance", "Analysis"] },
  { id: "s16", courseId: "c3", name: "HR Manager", growth: "Stable", salary: "₹6L - ₹18L", tags: ["HR", "Recruiting"] },
  { id: "s7", courseId: "c4", name: "Product Design (UI/UX)", growth: "High", salary: "₹6L - ₹22L", tags: ["Figma", "User"] },
  { id: "s17", courseId: "c4", name: "Motion Graphics", growth: "Rising", salary: "₹5L - ₹18L", tags: ["Animation", "3D"] },
  { id: "s50", courseId: "c5", name: "Bioinformatics Engineer", growth: "High", salary: "₹7L - ₹25L", tags: ["DNA Data", "Python", "AI"] },
  { id: "s60", courseId: "c6", name: "Smart City Planner", growth: "Rising", salary: "₹8L - ₹22L", tags: ["IoT", "Urban Design"] },
];

const generateQuiz = (topic: string) => [
  { q: `What is the primary function of ${topic}?`, o: ["Data Storage", "User Interface", "Core Logic", "Networking"], a: 2 },
  { q: `Which tool is essential for ${topic}?`, o: ["VS Code", "Excel", "Photoshop", "Compiler"], a: 0 },
  { q: "What is a key concept in this step?", o: ["Modular Design", "Sales Funnel", "Color Theory", "Taxation"], a: 0 },
  { q: "How do you measure success here?", o: ["Efficiency", "Beauty", "Cost", "Volume"], a: 0 },
  { q: "Which language is most relevant?", o: ["English", "Python/JS", "French", "Binary"], a: 1 },
  { q: "What is a common pitfall?", o: ["Over-engineering", "Under-sleeping", "Eating too much", "Smiling"], a: 0 },
  { q: "What helps you improve fast?", o: ["Practice", "Reading only", "Guessing", "Waiting"], a: 0 },
  { q: "Who uses this skill most?", o: ["Developers", "Chefs", "Pilots", "Doctors"], a: 0 }
];

export const DEEP_DIVES: Record<string, DeepDiveData> = {
  "default": {
      role: "Specialized Professional",
      tagline: "Expertise drives the economy.",
      summary: "Success depends on building a portfolio.",
      dayInLife: [
          { time: "09:00 AM", title: "Daily Sync", desc: "Aligning with the team on today's goals and blockers." },
          { time: "10:30 AM", title: "Core Work", desc: "Deep focus block: designing, coding, or analyzing data." },
          { time: "02:00 PM", title: "Collaboration", desc: "Stakeholder meetings, code reviews, or design critiques." },
          { time: "05:00 PM", title: "Upskilling", desc: "Learning new tools or researching industry trends." }
      ],
      stats: [{ label: "Entry", value: "₹5.0 LPA" }, { label: "Senior", value: "₹20.0 LPA" }, { label: "Remote", value: "50%" }],
      stack: ["Tools", "Comm", "Analytics", "Mgmt"],
      roadmap: [
          { title: "Fundamentals", desc: "Core theories.", color: "bg-zinc-500", resources: [{ name: "Coursera Fundamentals", url: "https://coursera.org" }], quiz: generateQuiz("Fundamentals") },
          { title: "Tools", desc: "Standard software.", color: "bg-zinc-500", resources: [{ name: "Official Docs", url: "#" }], quiz: generateQuiz("Tools") },
      ]
  },
  "s1": {
      role: "Full Stack Developer",
      tagline: "The architect of the modern web.",
      summary: "You bridge the gap between backend logic and frontend interactivity.",
      dayInLife: [
          { time: "09:30 AM", title: "Stand-up", desc: "Quick update with the squad. Coffee in hand, Jira board open." },
          { time: "10:30 AM", title: "Feature Dev", desc: "Headphones on. Building that new payment integration component in React." },
          { time: "02:00 PM", title: "Code Review", desc: "Roasting (constructively) PRs from the team to ensure clean architecture." },
          { time: "04:00 PM", title: "Bug Bashing", desc: "Fixing that weird CSS layout glitch on Safari before deployment." }
      ],
      stats: [{ label: "Entry", value: "₹6.0 LPA" }, { label: "Senior", value: "₹28.0 LPA" }, { label: "Remote", value: "85%" }],
      stack: ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js", "Tailwind"],
      roadmap: [
          {
              title: "Foundations", desc: "HTML5, CSS3, JS (ES6+), DOM.", color: "bg-blue-500",
              resources: [
                  { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
                  { name: "freeCodeCamp HTML/CSS", url: "https://www.freecodecamp.org" }
              ],
              quiz: [
                  { q: "What does HTML stand for?", o: ["HyperText Markup Language", "HighTool Main Language", "HyperLinks Text Mark", "None"], a: 0 },
                  { q: "Which tag is used for the largest heading?", o: ["< h6 > ", "< head >", "< h1 >", "< header >"], a: 2 },
                  { q: "What is the box model in CSS?", o: ["Layout Logic", "Padding/Border/Margin", "Flexbox", "Grid"], a: 1 },
                  { q: "Which keyword declares a constant in JS?", o: ["var", "let", "const", "fixed"], a: 2 },
                  { q: "What is the DOM?", o: ["Data Object Mode", "Document Object Model", "Digital Order Main", "None"], a: 1 },
                  { q: "Which symbol creates a template literal?", o: ["'", "\"", "`", "-"], a: 2 },
                  { q: "What is the correct way to link a CSS file?", o: ["<link>", "<style>", "<css>", "<script>"], a: 0 },
                  { q: "Which event fires when a user clicks?", o: ["onHover", "onClick", "onPress", "onTap"], a: 1 }
              ]
          },
          {
              title: "Frontend Frameworks", desc: "React.js, State Mgmt, Tailwind.", color: "bg-indigo-500",
              resources: [
                  { name: "React Official Docs", url: "https://react.dev" },
                  { name: "Tailwind CSS Labs", url: "https://tailwindcss.com/docs" }
              ],
              quiz: [
                 { q: "What is a React Component?", o: ["Function/Class", "Database", "Server", "Loop"], a: 0 },
                 { q: "How do you manage local state?", o: ["useState", "useEffect", "useRef", "useContext"], a: 0 },
                 { q: "JSX stands for?", o: ["JS XML", "Java Syntax", "JSON X", "Jira System"], a: 0 },
                 { q: "What is a prop?", o: ["Argument passed to component", "State", "Hook", "Style"], a: 0 },
                 { q: "Which hook runs after render?", o: ["useEffect", "useState", "useMemo", "useCallback"], a: 0 },
                 { q: "What is Tailwind CSS?", o: ["Utility-first framework", "Component library", "JS library", "Database"], a: 0 }
              ]
          },
          {
            title: "Server Side", desc: "Node.js, Express, REST/GraphQL.", color: "bg-violet-500",
            resources: [
                { name: "Node.js Crash Course", url: "https://nodejs.org/en/docs/" }
            ],
            quiz: [
                 { q: "What is Node.js?", o: ["Runtime", "Language", "Database", "OS"], a: 0 },
                 { q: "How do you import modules?", o: ["require()", "include()", "fetch()", "get()"], a: 0 },
                 { q: "What is NPM?", o: ["Package Manager", "Project Maker", "Node Process", "None"], a: 0 },
                 { q: "Which module handles file system?", o: ["fs", "http", "path", "os"], a: 0 },
                 { q: "What does API stand for?", o: ["App Programming Interface", "Apple Pie Inc", "Auto Process Input", "None"], a: 0 },
                 { q: "What is middleware?", o: ["Fn between req & res", "Database", "Frontend", "Hardware"], a: 0 }
            ]
          }
      ]
  },
  "s2": {
      role: "AI Engineer",
      tagline: "Teaching machines to think.",
      summary: "You design models that process data to solve complex problems.",
      dayInLife: [
          { time: "10:00 AM", title: "Data Cleaning", desc: "Wrangling messy datasets. 80% of the job is cleaning data." },
          { time: "12:00 PM", title: "Model Training", desc: "Tweaking hyperparameters and starting a 4-hour training run on the GPU cluster." },
          { time: "03:00 PM", title: "Paper Read", desc: "Reading the latest arXiv paper to stay ahead of the curve." },
          { time: "05:00 PM", title: "Evaluation", desc: "Analyzing loss curves and confusion matrices. Did the model learn or memorize?" }
      ],
      stats: [{ label: "Entry", value: "₹8.0 LPA" }, { label: "Senior", value: "₹35.0 LPA" }, { label: "Remote", value: "60%" }],
      stack: ["Python", "PyTorch", "TensorFlow", "Pandas", "HuggingFace", "CUDA"],
      roadmap: [
          { title: "Math Foundations", desc: "Linear Algebra, Calculus, Stats.", color: "bg-indigo-500", resources: [], quiz: generateQuiz("Math") },
          { title: "Python for Data", desc: "NumPy, Pandas, Matplotlib.", color: "bg-blue-500", resources: [], quiz: generateQuiz("Python") }
      ]
  }
};

// Fill default data for missing deep dives
SPECIALIZATIONS.forEach(s => {
  if (!DEEP_DIVES[s.id]) {
      DEEP_DIVES[s.id] = JSON.parse(JSON.stringify(DEEP_DIVES["default"]));
      DEEP_DIVES[s.id].role = s.name;
  }
});

export const SOFT_SKILLS: SoftSkill[] = [
  {
      id: "ss_comm",
      title: "Communication",
      icon: "mic-2",
      color: "blue",
      desc: "The ability to convey information effectively and understand others.",
      assessment: [
          "I listen more than I speak in conversations.",
          "I can explain complex ideas in simple terms.",
          "I ask clarifying questions before responding.",
          "I adjust my tone based on the audience."
      ],
      tips: [
          "Practice active listening: repeat back what you heard.",
          "Use the 'Pyramid Principle' for written communication.",
          "Pay attention to non-verbal cues (body language)."
      ],
      resources: [
          { name: "TED: How to speak so people listen", url: "https://www.ted.com" },
          { name: "HBR: Communication", url: "https://hbr.org/topic/communication" }
      ],
      scenarios: [
          "Simulate a difficult conversation where I have to tell a client their project deadline will be missed.",
          "Roleplay explaining a complex technical architecture to a non-technical CEO.",
          "Help me practice giving constructive feedback to a colleague who interrupts during meetings."
      ]
  },
  {
      id: "ss_lead",
      title: "Leadership",
      icon: "users",
      color: "amber",
      desc: "Guiding and inspiring others toward a common goal.",
      assessment: [
          "I take initiative without being asked.",
          "I help others succeed/grow.",
          "I take responsibility for failures.",
          "I can make decisions with incomplete information."
      ],
      tips: [
          "Start with 'Why' (Simon Sinek).",
          "Delegate tasks to build trust.",
          "Give credit publicly, take blame privately."
      ],
      resources: [
          { name: "Simon Sinek: How great leaders inspire", url: "https://www.ted.com" }
      ],
      scenarios: [
          "I need to motivate a team that has just experienced a significant project failure.",
          "Roleplay a conflict resolution between two senior engineers disagreeing on a tech stack.",
          "How do I delegate tasks to a junior developer who lacks confidence but has high potential?"
      ]
  },
  {
      id: "ss_time",
      title: "Time Management",
      icon: "clock",
      color: "emerald",
      desc: "Organizing and planning how to divide your time.",
      assessment: [
          "I prioritize tasks based on importance, not just urgency.",
          "I avoid procrastination on big projects.",
          "I can say 'no' to non-essential requests.",
          "I focus on one task at a time (deep work)."
      ],
      tips: [
          "Use the Eisenhower Matrix.",
          "Try the Pomodoro technique.",
          "Eat the frog (do hardest task first)."
      ],
      resources: [
          { name: "James Clear: Atomic Habits", url: "https://jamesclear.com/atomic-habits" }
      ],
      scenarios: [
          "Create a prioritization strategy for a week where I have 3 major deadlines and 5 hours of meetings.",
          "Simulate a scenario where my boss assigns an urgent task while I'm already overloaded.",
          "Help me design a 'Deep Work' schedule for a software engineer working remotely."
      ]
  },
  {
      id: "ss_eq",
      title: "Emotional Intelligence",
      icon: "heart-handshake",
      color: "rose",
      desc: "Recognizing, understanding, and managing your own emotions and others'.",
      assessment: [
          "I can identify my emotional triggers.",
          "I remain calm under pressure.",
          "I can empathize with others' perspectives.",
          "I handle criticism constructively."
      ],
      tips: [
          "Pause before reacting to emotional triggers.",
          "Practice active empathy by putting yourself in others' shoes.",
          "Journal your daily emotional responses."
      ],
      resources: [
          { name: "Daniel Goleman: Emotional Intelligence", url: "https://www.danielgoleman.info/" },
          { name: "Psychology Today: EQ", url: "https://www.psychologytoday.com/us/basics/emotional-intelligence" }
      ],
      scenarios: [
          "I received harsh, unfair feedback in a code review. Help me draft a professional response.",
          "Roleplay a scenario where a team member is visibly stressed and snappy.",
          "I feel overwhelmed by imposter syndrome before a big presentation. Coach me."
      ]
  },
  {
      id: "ss_crit",
      title: "Critical Thinking",
      icon: "brain-circuit",
      color: "violet",
      desc: "The objective analysis and evaluation of an issue in order to form a judgment.",
      assessment: [
          "I question assumptions before accepting them.",
          "I look for evidence to support claims.",
          "I consider multiple perspectives before deciding.",
          "I can identify logical fallacies in arguments."
      ],
      tips: [
          "Ask 'Why?' five times to find the root cause.",
          "Play Devil's Advocate with your own ideas.",
          "Diversify your information sources."
      ],
      resources: [
          { name: "The Foundation for Critical Thinking", url: "https://www.criticalthinking.org/" }
      ],
      scenarios: [
          "Analyze a situation where our app's user retention dropped by 10% after a new feature release.",
          "Help me evaluate the pros and cons of migrating a legacy monolith to microservices.",
          "I need to make a high-stakes decision with incomplete data. Guide me through a structured process."
      ]
  }
];

export const QUIZ_LEVELS: any = {
  beginner: [
      { question: "What activity sounds most fun?", options: [{ txt: "Drawing & designing", spec: "s7", color: "border-neo-rose dark:border-pink-200" }, { txt: "Solving logic puzzles", spec: "s1", color: "border-neo-blue dark:border-indigo-200" }, { txt: "Planning a party", spec: "s5", color: "border-neo-yellow dark:border-amber-200" }, { txt: "Protecting secrets", spec: "s12", color: "border-red-400 dark:border-red-200" }] },
      { question: "Pick a workspace:", options: [{ txt: "Art studio", spec: "s17", color: "border-neo-purple dark:border-purple-200" }, { txt: "Quiet coding room", spec: "s2", color: "border-neo-blue dark:border-blue-200" }, { txt: "Busy stock floor", spec: "s15", color: "border-neo-green dark:border-emerald-200" }, { txt: "Hardware lab", spec: "s10", color: "border-orange-400 dark:border-orange-200" }] },
      { question: "What matters most?", options: [{ txt: "Creativity", spec: "s7", color: "border-neo-rose dark:border-pink-200" }, { txt: "Innovation", spec: "s2", color: "border-neo-blue dark:border-indigo-200" }, { txt: "Money", spec: "s15", color: "border-neo-green dark:border-emerald-200" }, { txt: "Stability", spec: "s26", color: "border-slate-400 dark:border-slate-200" }] }
  ],
  intermediate: [
      { question: "Code vs No-Code?", options: [{ txt: "I love writing code", spec: "s1", color: "border-neo-blue dark:border-blue-200" }, { txt: "I prefer visual tools", spec: "s7", color: "border-neo-rose dark:border-pink-200" }, { txt: "I like managing people", spec: "s5", color: "border-neo-yellow dark:border-amber-200" }, { txt: "I like hardware tools", spec: "s10", color: "border-orange-400 dark:border-orange-200" }] },
      { question: "Frontend or Backend?", options: [{ txt: "Visuals (Frontend)", spec: "s1", color: "border-neo-purple dark:border-indigo-200" }, { txt: "Logic (Backend)", spec: "s23", color: "border-neo-blue dark:border-cyan-200" }, { txt: "Data Analytics", spec: "s25", color: "border-neo-green dark:border-emerald-200" }, { txt: "System Security", spec: "s12", color: "border-red-400 dark:border-red-200" }] },
      { question: "Tech Interest?", options: [{ txt: "Blockchain/Web3", spec: "s14", color: "border-yellow-400 dark:border-yellow-200" }, { txt: "AI/ML", spec: "s2", color: "border-neo-purple dark:border-violet-200" }, { txt: "Cloud/DevOps", spec: "s3", color: "border-neo-blue dark:border-sky-200" }, { txt: "Mobile Apps", spec: "s4", color: "border-neo-green dark:border-lime-200" }] }
  ],
  advanced: [
      { question: "Career Objective?", options: [{ txt: "Chief Technology Officer", spec: "s23", color: "border-neo-blue dark:border-blue-200" }, { txt: "Product Leader", spec: "s5", color: "border-neo-yellow dark:border-amber-200" }, { txt: "Research Scientist", spec: "s2", color: "border-neo-purple dark:border-violet-200" }, { txt: "Founder", spec: "s28", color: "border-red-400 dark:border-red-200" }] },
      { question: "Specialization Preference?", options: [{ txt: "High Frequency Trading", spec: "s15", color: "border-neo-green dark:border-emerald-200" }, { txt: "LLM Fine-tuning", spec: "s2", color: "border-neo-purple dark:border-indigo-200" }, { txt: "Cloud Architecture", spec: "s3", color: "border-neo-blue dark:border-cyan-200" }, { txt: "Penetration Testing", spec: "s12", color: "border-neo-rose dark:border-rose-200" }] }
  ]
};

export const AVAILABLE_SKILLS = [
  "React", "Node.js", "Python", "Data", "AWS", "Design", "Management", "Finance",
  "Security", "Blockchain", "Gaming", "Hardware", "Mobile", "Marketing", "HR"
];
