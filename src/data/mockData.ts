import { 
  StudentProfile, 
  MotivationalQuote, 
  LeaderboardUser, 
  ExamCountdown, 
  StudyAlarm, 
  StudyGoal, 
  ChapterProgress, 
  StudyNote, 
  DPP,
  ChatSession,
  AIStudyPlan,
  WeaknessReport,
  MockVivaSession,
  AIQuiz,
  AIRevisionSchedule,
  FlashcardDeck,
  MindMapData,
  PYQuestion,
  SavedQuestion,
  FormulaItem,
  DailyChallenge,
  ChapterTest,
  FriendChallenge,
  WeeklyChampionRecord,
  XPShopItem,
  PomodoroSessionRecord
} from '../types';

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    quote: "Success doesn't come from what you do occasionally, it comes from what you do consistently.",
    author: "Marie Curie",
    category: "Perseverance",
    hindiTranslation: "सफलता कभी-कभार किए जाने वाले कामों से नहीं, बल्कि लगातार किए जाने वाले प्रयासों से मिलती है।"
  },
  {
    quote: "The expert in anything was once a beginner. Keep revising, keep solving!",
    author: "Helen Hayes",
    category: "Focus",
    hindiTranslation: "हर विषय का विशेषज्ञ कभी शुरुआत में नौसिखिया ही था। दोहराते रहें, हल करते रहें!"
  },
  {
    quote: "Push yourself, because no one else is going to do it for you.",
    author: "Dr. A.P.J. Abdul Kalam",
    category: "Hard Work",
    hindiTranslation: "खुद को आगे बढ़ाएं, क्योंकि आपके लिए कोई दूसरा यह नहीं करेगा।"
  },
  {
    quote: "Dreams do not work unless you do. Give your 100% to today's study target!",
    author: "John C. Maxwell",
    category: "Inspiration",
    hindiTranslation: "सपने तब तक काम नहीं करते जब तक आप खुद मेहनत नहीं करते। आज के लक्ष्य को 100% पूरा करें!"
  },
  {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    category: "Inspiration",
    hindiTranslation: "शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया को बदलने के लिए कर सकते हैं।"
  },
  {
    quote: "Small progress every single day adds up to massive exam results.",
    author: "EduSpark Wisdom",
    category: "Exams",
    hindiTranslation: "हर दिन की छोटी-छोटी प्रगति मिलकर परीक्षा में बड़ी सफलता दिलाती है।"
  }
];

export const INITIAL_STUDENT: StudentProfile = {
  id: 'student-demo-1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@eduspark.ai',
  className: 'Class 10',
  school: 'Delhi Public School, R.K. Puram',
  board: 'CBSE',
  subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  preferredLanguage: 'English',
  dailyTargetMinutes: 120,
  targetExamGoal: '95%+ in Class 10 Board Examinations',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  xp: 3450,
  level: 14,
  rankTitle: 'Scholar Prodigy',
  studyStreakDays: 12,
  longestStreakDays: 19,
  activeFrame: 'frame-neon-cyan',
  activeTheme: 'futuristic',
  totalQuestionsSolved: 142,
  totalFocusMinutes: 480,
};

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    id: 'user-1',
    name: 'Ananya Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    xp: 4850,
    level: 18,
    streak: 15,
    school: 'National Public School, Bengaluru',
    className: 'Class 10',
    rank: 1,
    frame: 'frame-gold-crown'
  },
  {
    id: 'user-2',
    name: 'Kabir Singhania',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    xp: 4120,
    level: 16,
    streak: 14,
    school: 'Bombay Scottish School, Mumbai',
    className: 'Class 10',
    rank: 2,
    frame: 'frame-silver-spark'
  },
  {
    id: 'user-current',
    name: 'Aarav Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    xp: 3450,
    level: 14,
    streak: 12,
    school: 'Delhi Public School, R.K. Puram',
    className: 'Class 10',
    rank: 3,
    frame: 'frame-neon-cyan'
  },
  {
    id: 'user-3',
    name: 'Tanvi Agarwal',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    xp: 3100,
    level: 13,
    streak: 10,
    school: 'DAV Boys Senior Secondary, Chennai',
    className: 'Class 10',
    rank: 4
  },
  {
    id: 'user-4',
    name: 'Ishan Mukherjee',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    xp: 2780,
    level: 11,
    streak: 9,
    school: 'South Point High School, Kolkata',
    className: 'Class 10',
    rank: 5
  },
  {
    id: 'user-5',
    name: 'Rhea Sengupta',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    xp: 2450,
    level: 10,
    streak: 8,
    school: 'The Mother\'s International, New Delhi',
    className: 'Class 10',
    rank: 6
  }
];

export const INITIAL_EXAMS: ExamCountdown[] = [
  {
    id: 'exam-1',
    name: 'Class 10 Mid-Term Board Exams',
    subject: 'All Major Subjects',
    examDate: '2026-09-18',
    examTime: '09:00',
    remindersEnabled: true,
    notes: 'Cover Mathematics sample papers and Science NCERT diagrams.'
  },
  {
    id: 'exam-2',
    name: 'CBSE Mathematics Pre-Board',
    subject: 'Mathematics',
    examDate: '2026-10-05',
    examTime: '10:30',
    remindersEnabled: true,
    notes: 'Focus on Word Problems in Quadratic Equations & Trigonometric Identities.'
  }
];

export const INITIAL_ALARMS: StudyAlarm[] = [
  {
    id: 'alarm-1',
    title: 'Morning Focus: Mathematics Numerical Practice',
    time: '06:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    isEnabled: true,
    subject: 'Mathematics'
  },
  {
    id: 'alarm-2',
    title: 'Evening Science Theory & Ray Diagrams',
    time: '18:30',
    days: ['Mon', 'Wed', 'Fri', 'Sat'],
    isEnabled: true,
    subject: 'Science'
  }
];

export const INITIAL_GOALS: StudyGoal[] = [
  {
    id: 'goal-1',
    title: 'Solve 15 Word Problems from Quadratic Equations',
    subject: 'Mathematics',
    estimatedMinutes: 45,
    completed: true,
    date: '2026-08-23'
  },
  {
    id: 'goal-2',
    title: 'Revise Ray Diagrams for Concave & Convex Mirrors',
    subject: 'Science',
    estimatedMinutes: 30,
    completed: false,
    date: '2026-08-23'
  },
  {
    id: 'goal-3',
    title: 'Complete 1 Daily Question Challenge & 20-min Pomodoro',
    subject: 'General Study',
    estimatedMinutes: 25,
    completed: false,
    date: '2026-08-23'
  }
];

export const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    title: 'Quadratic Equations - Formula & Nature of Roots Master Sheet',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    type: 'formulas',
    language: 'English',
    content: `### Standard Form\n$$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$\n\n### Discriminant ($D$)\n$$D = b^2 - 4ac$$\n\n### Nature of Roots\n1. **$D > 0$ and perfect square**: Roots are real, rational, and distinct.\n2. **$D > 0$ and not a perfect square**: Roots are real, irrational, and distinct (conjugate pairs).\n3. **$D = 0$**: Roots are real and equal ($x = -b / 2a$).\n4. **$D < 0$**: No real roots.\n\n### Vieta's Relations\n- Sum of Roots ($\\alpha + \\beta$) = $-\\frac{b}{a}$\n- Product of Roots ($\\alpha \\cdot \\beta$) = $\\frac{c}{a}$`,
    createdAt: '2026-08-22',
    tags: ['Math', 'Formulas', 'BoardExam'],
    isOffline: true
  },
  {
    id: 'note-2',
    title: 'Optics & Light - Sign Convention Rules',
    subject: 'Science',
    chapter: 'Light: Reflection and Refraction',
    type: 'important_points',
    language: 'English',
    content: `### New Cartesian Sign Convention\n1. All distances are measured from the **Optical Centre** (lens) or **Pole** (mirror).\n2. Distances measured in the direction of incident light are taken as **Positive (+)**.\n3. Distances measured opposite to incident light are taken as **Negative (-)**.\n\n### Mirror Formula vs. Lens Formula\n- **Mirror Formula**: $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$\n- **Lens Formula**: $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$\n- **Focal Length of Concave Mirror/Lens**: Always Negative ($-$).\n- **Focal Length of Convex Mirror/Lens**: Always Positive ($+$).`,
    createdAt: '2026-08-21',
    tags: ['Physics', 'Optics', 'SignConvention'],
    isOffline: true
  }
];

export const INITIAL_DPP_HISTORY: DPP[] = [
  {
    id: 'dpp-1',
    title: 'Daily Practice Paper #1: Quadratic Equations',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    topic: 'Nature of Roots and Discriminant',
    difficulty: 'Medium',
    language: 'English',
    totalQuestions: 5,
    score: 4,
    completedAt: '2026-08-22',
    xpEarned: 120,
    timeSpentSeconds: 290,
    userAnswers: { 0: 0, 1: 1, 2: 2, 3: 0, 4: 1 },
    questions: [
      {
        id: 'q1',
        question: 'If the discriminant of ax² + bx + c = 0 is greater than zero and a perfect square, what is the nature of its roots?',
        options: ['Real, rational and distinct', 'Real and equal', 'No real roots', 'Real, irrational and distinct'],
        correctIndex: 0,
        explanation: 'When D > 0 and is a perfect square, the square root of D is rational, leading to real, distinct, and rational roots.',
        hint: 'Consider the quadratic formula x = (-b ± √D)/(2a).'
      },
      {
        id: 'q2',
        question: 'What is the discriminant of the quadratic equation 3x² - 5x + 2 = 0?',
        options: ['-1', '1', '49', '25'],
        correctIndex: 1,
        explanation: 'D = b² - 4ac = (-5)² - 4(3)(2) = 25 - 24 = 1.',
        hint: 'Use D = b² - 4ac with a=3, b=-5, c=2.'
      },
      {
        id: 'q3',
        question: 'For what value of k does the equation 2x² + kx + 3 = 0 have equal roots?',
        options: ['±2√6', '±4', '±3√2', '±6'],
        correctIndex: 0,
        explanation: 'For equal roots, D = 0 => k² - 4(2)(3) = 0 => k² = 24 => k = ±2√6.',
        hint: 'Set the discriminant D = 0.'
      },
      {
        id: 'q4',
        question: 'The sum of zeroes of the quadratic polynomial 2x² - 8x + 6 is:',
        options: ['4', '-4', '3', '2'],
        correctIndex: 0,
        explanation: 'Sum of zeroes = -b/a = -(-8)/2 = 8/2 = 4.',
        hint: 'Sum of zeroes alpha + beta = -b/a.'
      },
      {
        id: 'q5',
        question: 'If a and b are co-prime numbers, then HCF(a, b) is:',
        options: ['0', '1', 'a*b', 'a/b'],
        correctIndex: 1,
        explanation: 'By definition, co-prime numbers share no common factor other than 1. Hence HCF is always 1.',
        hint: 'Co-prime numbers have only 1 as their common divisor.'
      }
    ]
  }
];

export const INITIAL_DOUBT_SESSIONS: ChatSession[] = [
  {
    id: 'doubt-session-1',
    title: 'Quadratic Equation Nature of Roots Doubt',
    createdAt: '2026-08-22T08:00:00Z',
    updatedAt: '2026-08-22T08:10:00Z',
    isDoubtChat: true,
    subject: 'Mathematics',
    messages: [
      {
        id: 'm1',
        sender: 'student',
        text: 'How do I determine if roots are real and distinct for 2x² - 4x + 3 = 0?',
        timestamp: '08:05 AM',
        isDoubt: true,
      },
      {
        id: 'm2',
        sender: 'ai',
        text: `### Final Answer\n**No real roots (The roots are imaginary/complex).**\n\n### Step-by-Step Solution\n1. Identify standard coefficients: $a = 2, b = -4, c = 3$.\n2. Calculate the Discriminant $D = b^2 - 4ac$:\n$$D = (-4)^2 - 4(2)(3) = 16 - 24 = -8$$\n3. Since $D < 0$, the quadratic equation has **no real roots**.\n\n### Core Concept\n- If $D > 0$: 2 distinct real roots\n- If $D = 0$: 2 equal real roots\n- If $D < 0$: No real roots\n\n### Common Mistake\nStudents often write $(-4)^2 = -16$ instead of $+16$. Always remember squaring a negative number yields a positive result!`,
        timestamp: '08:06 AM',
        keyConcepts: ['Discriminant Formula D = b² - 4ac', 'Nature of Quadratic Roots'],
        followUpQuestions: ['What if the equation is 2x² - 4x + 2 = 0? What will be the roots?']
      }
    ]
  }
];

export const INITIAL_TEACHER_SESSIONS: ChatSession[] = [
  {
    id: 'teacher-session-1',
    title: 'Mastering Quadratic Equations & Word Problems',
    createdAt: '2026-08-22T07:30:00Z',
    updatedAt: '2026-08-22T07:45:00Z',
    isDoubtChat: false,
    subject: 'Mathematics',
    messages: [
      {
        id: 'tm-1',
        sender: 'ai',
        text: `Namaste **Aarav**! 🙏 I am your **Personal AI Teacher** for **Class 10 (CBSE)**.\n\nI am here 24/7 to:\n1. Teach difficult concepts with intuitive real-world examples\n2. Diagnose your weak areas and suggest what to revise next\n3. Create personalized study routines & practice questions\n4. Guide you in **English, Hindi, or Hinglish**\n\nWhat chapter or topic would you like to master today?`,
        timestamp: '07:30 AM',
      },
      {
        id: 'tm-2',
        sender: 'student',
        text: 'Can you teach me how to frame equations for speed, distance, and time word problems?',
        timestamp: '07:32 AM',
        subject: 'Mathematics',
      },
      {
        id: 'tm-3',
        sender: 'ai',
        text: `### Intuitive Concept: The Golden Relationship\nIn speed-time word problems, always remember:\n$$\\text{Time} = \\frac{\\text{Distance}}{\\text{Speed}}$$\n\n### 3-Step Master Strategy:\n1. **Let the unknown speed be $x$ km/h**.\n2. **Identify both scenarios** (e.g., normal train speed vs. increased speed $x+10$).\n3. **Set up the Time Difference Equation**:\n$$\\text{Time}_{\\text{slower}} - \\text{Time}_{\\text{faster}} = \\text{Time difference (in hours)}$$\n\n### Example:\nA train travels 360 km. If speed had been 5 km/h more, it would take 1 hour less:\n$$\\frac{360}{x} - \\frac{360}{x+5} = 1$$\nCross multiply and simplify to get: $x^2 + 5x - 1800 = 0 \\implies x = 40\\text{ km/h}$.`,
        timestamp: '07:33 AM',
        keyConcepts: ['Time = Distance / Speed', 'Quadratic Equation Modeling', 'Time Difference Strategy'],
        followUpQuestions: [
          'Give me a practice problem on downstream and upstream boats!',
          'How do I solve pipes and cisterns problem with quadratics?'
        ]
      }
    ]
  }
];

export const INITIAL_CHAPTER_PROGRESS: ChapterProgress[] = [
  {
    id: 'cp-1',
    class: 'Class 10',
    subject: 'Mathematics',
    chapterNumber: 4,
    chapterTitle: 'Quadratic Equations',
    totalTopics: 8,
    completedTopics: 6,
    progressPercentage: 75,
    isCompleted: false,
    lastStudiedAt: '2026-08-22',
    difficulty: 'Medium',
    sections: [
      { id: 'intro', title: '1. Chapter Introduction & Hook', completed: true },
      { id: 'explanation', title: '2. Easy Explanation & Analogies', completed: true },
      { id: 'concepts', title: '3. Important Concepts & Formulas', completed: true },
      { id: 'examples', title: '4. Real Examples & Solved Cases', completed: true },
      { id: 'important_questions', title: '5. High-Yield Board Questions', completed: true },
      { id: 'practice_questions', title: '6. Practice Questions with Hints', completed: true },
      { id: 'mini_test', title: '7. Chapter Mini Test', completed: false },
      { id: 'revision', title: '8. 60-Second Flashcard Revision', completed: false },
    ]
  },
  {
    id: 'cp-2',
    class: 'Class 10',
    subject: 'Science',
    chapterNumber: 9,
    chapterTitle: 'Light: Reflection and Refraction',
    totalTopics: 8,
    completedTopics: 8,
    progressPercentage: 100,
    isCompleted: true,
    lastStudiedAt: '2026-08-21',
    difficulty: 'Hard',
    sections: [
      { id: 'intro', title: '1. Chapter Introduction & Hook', completed: true },
      { id: 'explanation', title: '2. Easy Explanation & Analogies', completed: true },
      { id: 'concepts', title: '3. Important Concepts & Formulas', completed: true },
      { id: 'examples', title: '4. Real Examples & Solved Cases', completed: true },
      { id: 'important_questions', title: '5. High-Yield Board Questions', completed: true },
      { id: 'practice_questions', title: '6. Practice Questions with Hints', completed: true },
      { id: 'mini_test', title: '7. Chapter Mini Test', completed: true },
      { id: 'revision', title: '8. 60-Second Flashcard Revision', completed: true },
    ]
  },
  {
    id: 'cp-3',
    class: 'Class 10',
    subject: 'Science',
    chapterNumber: 6,
    chapterTitle: 'Life Processes',
    totalTopics: 8,
    completedTopics: 5,
    progressPercentage: 62,
    isCompleted: false,
    lastStudiedAt: '2026-08-20',
    difficulty: 'Medium',
    sections: [
      { id: 'intro', title: '1. Nutrition & Autotrophic Pathways', completed: true },
      { id: 'explanation', title: '2. Heterotrophic Digestion in Humans', completed: true },
      { id: 'concepts', title: '3. Respiration & ATP Pathways', completed: true },
      { id: 'examples', title: '4. Human Circulatory System', completed: true },
      { id: 'important_questions', title: '5. Excretion & Nephron Structure', completed: true },
      { id: 'practice_questions', title: '6. Board Diagram Practice', completed: false },
      { id: 'mini_test', title: '7. Chapter Assessment', completed: false },
      { id: 'revision', title: '8. Mind Map & Key Terms', completed: false },
    ]
  }
];

// ----------------------------------------------------
// 1. Initial AI Study Plan
// ----------------------------------------------------
export const INITIAL_STUDY_PLANS: AIStudyPlan[] = [
  {
    id: 'plan-default-1',
    examName: 'Class 10 Mid-Term Board Examination',
    examDate: '2026-09-18',
    targetSubjects: ['Mathematics', 'Science', 'Social Science'],
    chaptersToComplete: ['Quadratic Equations', 'Light: Reflection and Refraction', 'Nationalism in India'],
    dailyStudyMinutes: 120,
    preferredStudyTime: 'Evening (6:00 PM - 8:30 PM)',
    totalDays: 26,
    daysRemaining: 26,
    aiStrategySummary: 'Focused 80/20 strategy: dedicating prime evening slots to high-weightage numericals and ray diagrams, followed by active recall and formula flashcards.',
    createdAt: '2026-08-23',
    days: [
      {
        dayNumber: 1,
        date: '2026-08-23',
        dayName: 'Today',
        isToday: true,
        tasks: [
          {
            id: 't-1-1',
            timeSlot: '06:00 PM - 07:00 PM',
            subject: 'Mathematics',
            chapter: 'Quadratic Equations',
            topic: 'Nature of Roots & Discriminant Practice',
            goal: 'Solve 10 textbook problems and identify error patterns',
            estimatedMinutes: 60,
            isCompleted: false,
            priority: 'High',
            type: 'concept'
          },
          {
            id: 't-1-2',
            timeSlot: '07:15 PM - 08:00 PM',
            subject: 'Science',
            chapter: 'Light: Reflection and Refraction',
            topic: 'Ray Diagrams for Concave Mirror',
            goal: 'Draw 6 cases of image formation cleanly with scale',
            estimatedMinutes: 45,
            isCompleted: false,
            priority: 'High',
            type: 'practice'
          },
          {
            id: 't-1-3',
            timeSlot: '08:00 PM - 08:15 PM',
            subject: 'Science',
            chapter: 'Light',
            topic: 'Optics Formula Flashcards Review',
            goal: 'Quick revision of sign convention and magnification',
            estimatedMinutes: 15,
            isCompleted: false,
            priority: 'Medium',
            type: 'revision'
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-08-24',
        dayName: 'Tomorrow',
        tasks: [
          {
            id: 't-2-1',
            timeSlot: '06:00 PM - 07:15 PM',
            subject: 'Mathematics',
            chapter: 'Quadratic Equations',
            topic: 'Speed & Distance Word Problems',
            goal: 'Solve 6 board exam PYQs and check time taken',
            estimatedMinutes: 75,
            isCompleted: false,
            priority: 'High',
            type: 'mock'
          },
          {
            id: 't-2-2',
            timeSlot: '07:30 PM - 08:15 PM',
            subject: 'Social Science',
            chapter: 'Nationalism in India',
            topic: 'Non-Cooperation Movement Timelines',
            goal: 'Mind map key events from Rowlatt Act to Chauri Chaura',
            estimatedMinutes: 45,
            isCompleted: false,
            priority: 'Medium',
            type: 'concept'
          }
        ]
      }
    ]
  }
];

// ----------------------------------------------------
// 2. Initial AI Weakness Report
// ----------------------------------------------------
export const INITIAL_WEAKNESS_REPORT: WeaknessReport = {
  overallAccuracy: 68,
  identifiedWeakSubjects: ['Mathematics', 'Science'],
  strongTopics: ['Chemical Reactions and Equations', 'Linear Equations in Two Variables', 'Life Processes: Nutrition'],
  criticalTopics: [
    {
      subject: 'Mathematics',
      chapter: 'Quadratic Equations',
      topic: 'Speed-Distance & Upstream/Downstream Word Problems',
      accuracy: 42,
      testsAttempted: 4,
      incorrectQuestionsCount: 7,
      repeatedMistakes: [
        'Writing (Time = Speed / Distance) instead of (Time = Distance / Speed)',
        'Sign slip when subtracting algebraic fractions with (x - 5)'
      ],
      status: 'Critical Weak',
      aiRecommendation: 'Practice 15 dedicated speed-distance word problems and verify discriminant values before factoring.',
      formulaChecklist: ['Time = Distance / Speed', 'Upstream Speed = (u - v) km/h', 'Downstream Speed = (u + v) km/h']
    },
    {
      subject: 'Science',
      chapter: 'Light: Reflection and Refraction',
      topic: 'Sign Convention in Mirror & Lens Formulas',
      accuracy: 54,
      testsAttempted: 3,
      incorrectQuestionsCount: 5,
      repeatedMistakes: [
        'Using + instead of - in lens formula 1/f = 1/v - 1/u',
        'Confusing focal length sign: concave is negative (-), convex is positive (+)'
      ],
      status: 'Needs Practice',
      aiRecommendation: 'Sketch a quick Cartesian coordinate box before plugging in numeric values into optical formulas.',
      formulaChecklist: ['1/f = 1/v + 1/u (Mirror)', '1/f = 1/v - 1/u (Lens)', 'm = -v/u (Mirror)', 'm = v/u (Lens)']
    }
  ],
  personalizedActionPlan: [
    {
      title: 'Optics Sign Convention Revision Drill',
      action: 'Spend 20 minutes reviewing the Formula Vault and testing 5 ray diagram numericals.',
      priority: 'High',
      timeEstimate: '20 mins'
    },
    {
      title: 'Targeted Quadratic Equations DPP',
      action: 'Generate a 10-question medium-difficulty DPP focused strictly on word problems.',
      priority: 'High',
      timeEstimate: '35 mins'
    },
    {
      title: 'AI Mock Viva on Light & Reflection',
      action: 'Take a 5-minute interactive voice/text viva to test oral explanation speed.',
      priority: 'Medium',
      timeEstimate: '10 mins'
    }
  ],
  lastAnalyzedAt: '2026-08-23T08:30:00Z'
};

// ----------------------------------------------------
// 3. Initial Mock Viva Session
// ----------------------------------------------------
export const INITIAL_VIVA_SESSIONS: MockVivaSession[] = [
  {
    id: 'viva-1',
    subject: 'Science',
    chapter: 'Life Processes',
    topic: 'Human Respiration and Energy Pathways',
    difficulty: 'Board Exam Level',
    language: 'English',
    currentTurnIndex: 1,
    isFinished: false,
    createdAt: '2026-08-23T07:00:00Z',
    turns: [
      {
        questionNumber: 1,
        question: 'Explain why aerobic respiration yields significantly more ATP molecules than anaerobic respiration in yeast or human muscles.',
        studentAnswer: 'Because aerobic respiration uses oxygen and breaks down glucose completely into carbon dioxide and water in mitochondria, giving around 36 to 38 ATP. Anaerobic respiration only breaks glucose partially into lactic acid or ethanol, giving just 2 ATP.',
        feedback: 'Excellent answer! You accurately cited both the intracellular location (mitochondria) and the complete vs. partial oxidation difference.',
        score: 9.5,
        keyConceptTested: 'Aerobic vs Anaerobic Glycolysis & Mitochondrial Krebs Cycle',
        idealAnswerBulletPoints: [
          'Aerobic: Complete breakdown of glucose in presence of O2 -> 38 ATP + CO2 + H2O',
          'Anaerobic: Incomplete oxidation in cytoplasm -> 2 ATP + Lactic Acid / Ethanol'
        ],
        isCompleted: true
      },
      {
        questionNumber: 2,
        question: 'Why do athletes often experience muscle cramps during an intense 100m sprint, and how does taking a warm bath help alleviate the cramp?',
        studentAnswer: '',
        keyConceptTested: 'Lactic acid accumulation & vasodilation from heat',
        isCompleted: false
      }
    ]
  }
];

// ----------------------------------------------------
// 4. Initial AI Quizzes
// ----------------------------------------------------
export const INITIAL_QUIZZES: AIQuiz[] = [
  {
    id: 'quiz-1',
    title: 'Class 10 Science: Chemical Reactions & Equations',
    subject: 'Science',
    chapter: 'Chemical Reactions and Equations',
    topic: 'Types of Reactions, Redox & Balancing',
    difficulty: 'Medium',
    language: 'English',
    totalQuestions: 4,
    questions: [
      {
        id: 'qz1',
        type: 'mcq',
        question: 'Which of the following is an example of an endothermic displacement reaction?',
        options: [
          'Decomposition of calcium carbonate',
          'Reaction of copper with silver nitrate',
          'Burning of natural gas',
          'Respiration in living cells'
        ],
        correctAnswer: 'Reaction of copper with silver nitrate',
        explanation: 'Copper is more reactive than silver and displaces it from AgNO3 solution while absorbing heat in specific catalytic setups.',
        hint: 'Look for single displacement involving metal reactivity series.'
      },
      {
        id: 'qz2',
        type: 'true_false',
        question: 'Rusting of iron is an example of a redox reaction where iron is oxidized and oxygen is reduced.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'Iron loses electrons (oxidation: Fe -> Fe3+) while oxygen gains electrons (reduction: O2 -> O2-).',
        hint: 'Recall that oxidation is loss of electrons and reduction is gain.'
      },
      {
        id: 'qz3',
        type: 'fill_blank',
        question: 'In the reaction CuO + H₂ -> Cu + H₂O, the substance that acts as the reducing agent is ____.',
        correctAnswer: 'H2',
        explanation: 'Hydrogen (H2) removes oxygen from copper oxide and gets oxidized to water, so H2 is the reducing agent.',
        hint: 'The substance that undergoes oxidation acts as the reducing agent.'
      },
      {
        id: 'qz4',
        type: 'short_answer',
        question: 'State the law of conservation of mass that necessitates balancing chemical equations.',
        correctAnswer: 'Mass can neither be created nor destroyed in a chemical reaction.',
        explanation: 'Total mass of reactants must equal total mass of products, which means the number of atoms of each element remains invariant.',
        hint: 'Formulated by Antoine Lavoisier in 1789.'
      }
    ]
  }
];

// ----------------------------------------------------
// 5. Initial Revision Schedule
// ----------------------------------------------------
export const INITIAL_REVISION_SCHEDULE: AIRevisionSchedule = {
  examName: 'Class 10 Mid-Term Exams',
  examDate: '2026-09-18',
  completionPercentage: 45,
  highYieldTips: [
    'Draw all physics ray diagrams with a sharp pencil and 30cm ruler to avoid losing 1 mark on ray direction arrows.',
    'Review the Formula Vault every morning for 10 minutes to make formula recall automatic during board exams.'
  ],
  items: [
    {
      id: 'rev-1',
      subject: 'Mathematics',
      chapter: 'Quadratic Equations',
      topic: 'Discriminant & Word Problem Formulations',
      category: 'today',
      keyFormulasOrConcepts: ['D = b² - 4ac', 'x = (-b ± √D)/(2a)', 'Time = Dist/Speed'],
      isCompleted: false,
      estimatedMinutes: 30,
      priorityScore: 95
    },
    {
      id: 'rev-2',
      subject: 'Science',
      chapter: 'Light: Reflection and Refraction',
      topic: 'Convex Lens Image Formation & Magnification',
      category: 'today',
      keyFormulasOrConcepts: ['1/f = 1/v - 1/u', 'm = v/u = h\'/h', 'Power P = 1/f (in meters)'],
      isCompleted: false,
      estimatedMinutes: 25,
      priorityScore: 92
    },
    {
      id: 'rev-3',
      subject: 'Science',
      chapter: 'Acids, Bases and Salts',
      topic: 'pH Scale & Important Salt Chemistry (Baking Soda & Bleaching Powder)',
      category: 'tomorrow',
      keyFormulasOrConcepts: ['pH = -log[H+]', 'NaHCO3 + Heat -> Na2CO3 + CO2 + H2O', 'Ca(OH)2 + Cl2 -> CaOCl2 + H2O'],
      isCompleted: false,
      estimatedMinutes: 25,
      priorityScore: 84
    },
    {
      id: 'rev-4',
      subject: 'Social Science',
      chapter: 'Nationalism in India',
      topic: 'Non-Cooperation, Civil Disobedience & Salt March 1930',
      category: 'high_priority',
      keyFormulasOrConcepts: ['Rowlatt Satyagraha 1919', 'Simon Commission 1928', 'Dandi March 12 Mar - 6 Apr 1930'],
      isCompleted: false,
      estimatedMinutes: 35,
      priorityScore: 88
    },
    {
      id: 'rev-5',
      subject: 'Mathematics',
      chapter: 'Trigonometry',
      topic: 'Standard Angles Table & Pythagorean Identities',
      category: 'quick_revision',
      keyFormulasOrConcepts: ['sin²θ + cos²θ = 1', '1 + tan²θ = sec²θ', '1 + cot²θ = cosec²θ'],
      isCompleted: false,
      estimatedMinutes: 15,
      priorityScore: 80
    }
  ],
  lastGeneratedAt: '2026-08-23T08:00:00Z'
};

// ----------------------------------------------------
// 6. Initial Flashcard Decks
// ----------------------------------------------------
export const INITIAL_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-1',
    title: 'Class 10 Science: Optics & Light High-Yield Flashcards',
    subject: 'Science',
    chapter: 'Light: Reflection and Refraction',
    createdAt: '2026-08-22',
    cards: [
      {
        id: 'fc-1',
        frontQuestion: 'What is the formula for Power of a Lens, and what is its SI unit?',
        backAnswer: 'Power $P = \\frac{1}{f\\text{ (in meters)}}$.\nSI unit is **Dioptre (D)**.\n1 Dioptre is the power of a lens of focal length 1 metre.',
        category: 'formula',
        isBookmarked: true,
        isMarkedDifficult: false,
        repetitionLevel: 2
      },
      {
        id: 'fc-2',
        frontQuestion: 'State Snell\'s Law of Refraction.',
        backAnswer: 'The ratio of the sine of the angle of incidence to the sine of the angle of refraction is a constant for a given pair of media:\n$$\\frac{\\sin i}{\\sin r} = \\text{constant} = \\mu = n_{21}$$',
        category: 'definition',
        isBookmarked: false,
        isMarkedDifficult: false,
        repetitionLevel: 1
      },
      {
        id: 'fc-3',
        frontQuestion: 'Where should an object be placed in front of a concave mirror to get a virtual, erect, and magnified image?',
        backAnswer: 'Between the **Pole ($P$)** and the **Principal Focus ($F$)** of the concave mirror.',
        category: 'concept',
        isBookmarked: true,
        isMarkedDifficult: true,
        repetitionLevel: 0
      },
      {
        id: 'fc-4',
        frontQuestion: 'What is the difference between magnification formula for spherical mirrors vs spherical lenses?',
        backAnswer: '- Mirror Magnification: $m = -\\frac{v}{u} = \\frac{h\'}{h}$\n- Lens Magnification: $m = +\\frac{v}{u} = \\frac{h\'}{h}$',
        category: 'formula',
        isBookmarked: false,
        isMarkedDifficult: false,
        repetitionLevel: 3
      }
    ]
  },
  {
    id: 'deck-2',
    title: 'Class 10 Mathematics: Quadratic Equations & Polynomials',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    createdAt: '2026-08-21',
    cards: [
      {
        id: 'fc-2-1',
        frontQuestion: 'What is the discriminant formula for ax² + bx + c = 0?',
        backAnswer: '$$D = b^2 - 4ac$$\nIf $D > 0$: 2 real, distinct roots\nIf $D = 0$: 2 equal real roots\nIf $D < 0$: No real roots',
        category: 'formula',
        isBookmarked: true,
        isMarkedDifficult: false,
        repetitionLevel: 3
      },
      {
        id: 'fc-2-2',
        frontQuestion: 'What is the relation between coefficients and roots α, β of ax² + bx + c = 0?',
        backAnswer: '- Sum of roots: $\\alpha + \\beta = -\\frac{b}{a}$\n- Product of roots: $\\alpha \\cdot \\beta = \\frac{c}{a}$',
        category: 'concept',
        isBookmarked: false,
        isMarkedDifficult: false,
        repetitionLevel: 2
      }
    ]
  }
];

// ----------------------------------------------------
// 7. Initial Mind Maps
// ----------------------------------------------------
export const INITIAL_MIND_MAPS: MindMapData[] = [
  {
    id: 'mm-1',
    subject: 'Science',
    chapter: 'Life Processes',
    topic: 'Complete Overview of Vital Systems',
    summary: 'Visual tree of human physiological life processes: nutrition, respiration, circulation, and excretion.',
    createdAt: '2026-08-22',
    rootNode: {
      id: 'root-lp',
      label: 'Life Processes (Chapter 6)',
      category: 'core',
      definition: 'Basic functions performed by living organisms to maintain life on earth.',
      color: '#3B82F6',
      children: [
        {
          id: 'n-nut',
          label: '1. Nutrition',
          category: 'subtopic',
          definition: 'Intake and utilization of nutrients for energy.',
          color: '#22D3EE',
          children: [
            {
              id: 'n-auto',
              label: 'Autotrophic',
              definition: 'Photosynthesis: 6CO2 + 6H2O -> C6H12O6 + 6O2 in chloroplasts.',
              category: 'concept',
              color: '#10B981'
            },
            {
              id: 'n-hetero',
              label: 'Heterotrophic',
              definition: 'Holozoic (Humans, Amoeba), Saprophytic (Fungi), Parasitic (Cuscuta).',
              category: 'concept',
              color: '#F59E0B'
            }
          ]
        },
        {
          id: 'n-resp',
          label: '2. Respiration',
          category: 'subtopic',
          definition: 'Oxidation of digested food to release ATP.',
          color: '#8B5CF6',
          children: [
            {
              id: 'n-aero',
              label: 'Aerobic (Mitochondria)',
              definition: 'Pyruvate + O2 -> 6CO2 + 6H2O + 38 ATP',
              category: 'formula',
              color: '#A855F7'
            },
            {
              id: 'n-anaero',
              label: 'Anaerobic (Cytoplasm)',
              definition: 'Glucose -> Lactic Acid + 2 ATP (Muscle cramps) OR Ethanol + CO2 (Yeast)',
              category: 'concept',
              color: '#EC4899'
            }
          ]
        },
        {
          id: 'n-circ',
          label: '3. Transportation',
          category: 'subtopic',
          definition: 'Pumping blood via 4-chambered human heart through double circulation.',
          color: '#06B6D4',
          children: [
            {
              id: 'n-heart',
              label: 'Double Circulation',
              definition: 'Pulmonary circulation (Lungs) & Systemic circulation (Body tissues).',
              category: 'concept',
              color: '#3B82F6'
            },
            {
              id: 'n-plant-trans',
              label: 'Plant Vascular Bundles',
              definition: 'Xylem: Water & Minerals (Unidirectional). Phloem: Translocation of food (Bidirectional).',
              category: 'concept',
              color: '#10B981'
            }
          ]
        },
        {
          id: 'n-excr',
          label: '4. Excretion',
          category: 'subtopic',
          definition: 'Removal of toxic nitrogenous waste via millions of Nephrons.',
          color: '#F97316',
          children: [
            {
              id: 'n-nephron',
              label: 'Nephron Filtration',
              definition: 'Bowman\'s capsule (Ultrafiltration) -> Henle\'s loop -> Collecting duct (Urine).',
              category: 'concept',
              color: '#E11D48'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'mm-2',
    subject: 'Science',
    chapter: 'Light: Reflection and Refraction',
    topic: 'Mirrors, Lenses & Optical Formulas',
    summary: 'Comprehensive concept map of ray optics, focal lengths, Cartesian sign convention, and magnification.',
    createdAt: '2026-08-23',
    rootNode: {
      id: 'root-light',
      label: 'Light: Reflection & Refraction',
      category: 'core',
      definition: 'Study of propagation of light rays, optical surfaces, and image formation.',
      color: '#06B6D4',
      children: [
        {
          id: 'n-refl',
          label: '1. Reflection & Spherical Mirrors',
          category: 'subtopic',
          definition: 'Bouncing back of light in same medium: ∠i = ∠r.',
          color: '#3B82F6',
          children: [
            {
              id: 'n-concave-m',
              label: 'Concave Mirror (Converging)',
              definition: 'Real & inverted images for u > f. Virtual & erect magnified image when object between P and F.',
              category: 'concept',
              color: '#6366F1'
            },
            {
              id: 'n-convex-m',
              label: 'Convex Mirror (Diverging)',
              definition: 'Always produces virtual, erect, diminished image. Used in vehicle rear-view mirrors for wider field of view.',
              category: 'concept',
              color: '#8B5CF6'
            },
            {
              id: 'n-mirror-eq',
              label: 'Mirror Formula & Magnification',
              definition: '$$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}, \\quad m = -\\frac{v}{u} = \\frac{h\'}{h}$$',
              category: 'formula',
              color: '#EC4899'
            }
          ]
        },
        {
          id: 'n-refr',
          label: '2. Refraction & Lenses',
          category: 'subtopic',
          definition: 'Bending of light across media: Snell\'s Law n = sin(i) / sin(r).',
          color: '#10B981',
          children: [
            {
              id: 'n-convex-l',
              label: 'Convex Lens (Converging)',
              definition: 'Focal length is positive (+f). Real, inverted images except when object is inside focal point.',
              category: 'concept',
              color: '#14B8A6'
            },
            {
              id: 'n-concave-l',
              label: 'Concave Lens (Diverging)',
              definition: 'Focal length is negative (-f). Always forms virtual, erect, diminished images.',
              category: 'concept',
              color: '#F59E0B'
            },
            {
              id: 'n-lens-formula',
              label: 'Lens Formula & Power',
              definition: '$$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}, \\quad m = \\frac{v}{u}, \\quad P = \\frac{1}{f\\text{ (m)}} \\text{ (Dioptres)}$$',
              category: 'formula',
              color: '#EF4444'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'mm-3',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    topic: 'Standard Form, Roots & Discriminant',
    summary: 'Hierarchy of quadratic forms, discriminant classification, roots formula, and nature of roots.',
    createdAt: '2026-08-23',
    rootNode: {
      id: 'root-quad',
      label: 'Quadratic Equations ax² + bx + c = 0',
      category: 'core',
      definition: 'Second-degree polynomial equation with real coefficients and a ≠ 0.',
      color: '#8B5CF6',
      children: [
        {
          id: 'n-sol-methods',
          label: '1. Solving Methods',
          category: 'subtopic',
          definition: 'Techniques to evaluate the zeroes/roots of ax² + bx + c = 0.',
          color: '#3B82F6',
          children: [
            {
              id: 'n-fact',
              label: 'Splitting Middle Term',
              definition: 'Factorize into (px + q)(rx + s) = 0 by finding factors multiplying to ac and adding to b.',
              category: 'concept',
              color: '#06B6D4'
            },
            {
              id: 'n-shreedhar',
              label: 'Quadratic Formula (Shreedharacharya)',
              definition: '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$',
              category: 'formula',
              color: '#10B981'
            }
          ]
        },
        {
          id: 'n-discrim',
          label: '2. Discriminant & Nature of Roots',
          category: 'subtopic',
          definition: 'Value of D = b² - 4ac determines root characteristics.',
          color: '#F59E0B',
          children: [
            {
              id: 'n-d-pos',
              label: 'D > 0: Two Distinct Real Roots',
              definition: 'Graph intersects X-axis at two separate points: x1 ≠ x2.',
              category: 'concept',
              color: '#10B981'
            },
            {
              id: 'n-d-zero',
              label: 'D = 0: Two Equal Real Roots',
              definition: 'Parabola touches X-axis at vertex: x = -b / (2a).',
              category: 'concept',
              color: '#3B82F6'
            },
            {
              id: 'n-d-neg',
              label: 'D < 0: No Real Roots',
              definition: 'Parabola does not intersect the real X-axis. Roots are complex conjugates.',
              category: 'concept',
              color: '#EF4444'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'mm-4',
    subject: 'Mathematics',
    chapter: 'Introduction to Trigonometry',
    topic: 'Trigonometric Ratios & Pythagorean Identities',
    summary: 'Visual tree of right-triangle ratios, fundamental Pythagorean identities, and standard angles values.',
    createdAt: '2026-08-24',
    rootNode: {
      id: 'root-trig',
      label: 'Trigonometry Blueprint',
      category: 'core',
      definition: 'Branch of mathematics exploring side-length and angle relationships in triangles.',
      color: '#EC4899',
      children: [
        {
          id: 'n-trig-ratios',
          label: '1. Primary Ratios',
          category: 'subtopic',
          definition: 'Ratios defined for acute angle θ in right triangle (P = Perpendicular, B = Base, H = Hypotenuse).',
          color: '#8B5CF6',
          children: [
            {
              id: 'n-sin-cos-tan',
              label: 'sin, cos, tan',
              definition: '$$\\sin\\theta = \\frac{P}{H}, \\quad \\cos\\theta = \\frac{B}{H}, \\quad \\tan\\theta = \\frac{P}{B} = \\frac{\\sin\\theta}{\\cos\\theta}$$',
              category: 'formula',
              color: '#06B6D4'
            },
            {
              id: 'n-recip',
              label: 'Reciprocal Ratios',
              definition: '$$\\csc\\theta = \\frac{1}{\\sin\\theta}, \\quad \\sec\\theta = \\frac{1}{\\cos\\theta}, \\quad \\cot\\theta = \\frac{1}{\\tan\\theta}$$',
              category: 'formula',
              color: '#10B981'
            }
          ]
        },
        {
          id: 'n-identities',
          label: '2. Pythagorean Identities',
          category: 'subtopic',
          definition: 'Universal relations true for all values of θ (0° ≤ θ ≤ 90°).',
          color: '#F59E0B',
          children: [
            {
              id: 'n-id-1',
              label: '$$\\sin^2\\theta + \\cos^2\\theta = 1$$',
              definition: 'Primary identity derived directly from Pythagoras theorem P² + B² = H².',
              category: 'formula',
              color: '#EF4444'
            },
            {
              id: 'n-id-2',
              label: '$$1 + \\tan^2\\theta = \\sec^2\\theta$$',
              definition: 'Dividing primary identity by cos²θ.',
              category: 'formula',
              color: '#8B5CF6'
            },
            {
              id: 'n-id-3',
              label: '$$1 + \\cot^2\\theta = \\csc^2\\theta$$',
              definition: 'Dividing primary identity by sin²θ.',
              category: 'formula',
              color: '#14B8A6'
            }
          ]
        }
      ]
    }
  }
];

// ----------------------------------------------------
// 8. Initial Previous Year Questions (PYQs)
// ----------------------------------------------------
export const INITIAL_PYQS: PYQuestion[] = [
  {
    id: 'pyq-1',
    className: 'Class 10',
    board: 'CBSE',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    examYear: 2024,
    marks: 4,
    questionText: 'A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream.',
    detailedSolution: `### Step 1: Define Variables
Let the speed of the stream be $x$ km/h.
- Speed of boat in still water = $18$ km/h.
- Speed of boat upstream = $(18 - x)$ km/h.
- Speed of boat downstream = $(18 + x)$ km/h.

### Step 2: Time Equations
$$\\text{Time} = \\frac{\\text{Distance}}{\\text{Speed}}$$
- Time taken upstream $T_1 = \\frac{24}{18 - x}$ hours.
- Time taken downstream $T_2 = \\frac{24}{18 + x}$ hours.

### Step 3: Set up Time Difference Equation
$$T_1 - T_2 = 1 \\implies \\frac{24}{18 - x} - \\frac{24}{18 + x} = 1$$

$$24 \\left[ \\frac{(18 + x) - (18 - x)}{(18 - x)(18 + x)} \\right] = 1$$
$$24 \\left[ \\frac{2x}{324 - x^2} \\right] = 1 \\implies 48x = 324 - x^2$$
$$x^2 + 48x - 324 = 0$$

### Step 4: Factorization
$$(x + 54)(x - 6) = 0$$
Since speed cannot be negative, we reject $x = -54$.
**Therefore, speed of stream $x = 6$ km/h.**`,
    keyFormulasUsed: ['Time = Distance / Speed', 'Upstream Speed = u - v', 'Downstream Speed = u + v'],
    isCompleted: true,
    isBookmarked: true
  },
  {
    id: 'pyq-2',
    className: 'Class 10',
    board: 'CBSE',
    subject: 'Science',
    chapter: 'Light: Reflection and Refraction',
    examYear: 2023,
    marks: 3,
    questionText: 'An object 4 cm in size is placed at 25 cm in front of a concave mirror of focal length 15 cm. At what distance from the mirror should a screen be placed in order to obtain a sharp image? Find the nature and size of the image.',
    detailedSolution: `### Given Data (with Sign Convention):
- Height of object $h = +4$ cm
- Object distance $u = -25$ cm
- Focal length of concave mirror $f = -15$ cm

### Step 1: Mirror Formula
$$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u} \\implies \\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u}$$
$$\\frac{1}{v} = \\frac{1}{-15} - \\frac{1}{-25} = -\\frac{1}{15} + \\frac{1}{25} = \\frac{-5 + 3}{75} = -\\frac{2}{75}$$
$$v = -\\frac{75}{2} = -37.5\\text{ cm}$$
**The screen should be placed at 37.5 cm in front of the mirror (on the same side as object).**

### Step 2: Magnification & Image Height
$$m = -\\frac{v}{u} = \\frac{h'}{h} \\implies h' = -\\left( \\frac{v}{u} \\right) \\times h$$
$$h' = -\\left( \\frac{-37.5}{-25} \\right) \\times 4 = -(1.5) \\times 4 = -6\\text{ cm}$$

### Nature of Image:
Real, Inverted, and Magnified ($h' = -6$ cm).`,
    keyFormulasUsed: ['1/f = 1/v + 1/u', 'm = -v/u = h\'/h'],
    isCompleted: false,
    isBookmarked: true
  },
  {
    id: 'pyq-3',
    className: 'Class 10',
    board: 'CBSE',
    subject: 'Science',
    chapter: 'Chemical Reactions and Equations',
    examYear: 2022,
    marks: 2,
    questionText: 'Why is respiration considered an exothermic reaction? Explain with a balanced chemical equation.',
    detailedSolution: `Respiration is considered an **exothermic reaction** because energy is released during the oxidation of glucose in the cells of our body.\n\n### Chemical Equation:\n$$\\text{C}_6\\text{H}_{12}\\text{O}_6\\text{ (aq)} + 6\\text{O}_2\\text{ (g)} \\longrightarrow 6\\text{CO}_2\\text{ (g)} + 6\\text{H}_2\\text{O (l)} + \\text{Energy (38 ATP)}$$\n\nThis energy provides the power required for all metabolic and cellular activities.`,
    keyFormulasUsed: ['C6H12O6 + 6O2 -> 6CO2 + 6H2O + Energy'],
    isCompleted: true,
    isBookmarked: false
  }
];

// ----------------------------------------------------
// 9. Initial Saved / Bookmarked Questions
// ----------------------------------------------------
export const INITIAL_SAVED_QUESTIONS: SavedQuestion[] = [
  {
    id: 'sq-1',
    source: 'doubt_chat',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    topic: 'Nature of Roots Discriminant',
    question: 'How do I determine if roots are real and distinct for 2x² - 4x + 3 = 0?',
    solutionOrAnswer: 'D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8 < 0. Hence no real roots.',
    savedAt: '2026-08-22'
  },
  {
    id: 'sq-2',
    source: 'pyq',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    topic: 'Upstream & Downstream Boat Speed',
    question: 'A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than downstream...',
    solutionOrAnswer: 'Speed of stream = 6 km/h. Equation: 24/(18-x) - 24/(18+x) = 1.',
    savedAt: '2026-08-21'
  }
];

// ----------------------------------------------------
// 10. Initial Formula Vault
// ----------------------------------------------------
export const INITIAL_FORMULAS: FormulaItem[] = [
  {
    id: 'form-1',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    topic: 'Quadratic Formula & Discriminant',
    formulaTitle: 'Quadratic Formula (Shreedharacharya Rule)',
    formulaLatex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    meaning: 'Used to directly find the two real or complex roots of any second-degree polynomial equation ax² + bx + c = 0.',
    variables: [
      { symbol: 'a', meaning: 'Coefficient of x² (a ≠ 0)' },
      { symbol: 'b', meaning: 'Coefficient of x' },
      { symbol: 'c', meaning: 'Constant term' },
      { symbol: 'D', meaning: 'Discriminant = b² - 4ac' }
    ],
    exampleUsage: 'For 2x² - 5x + 3 = 0: a=2, b=-5, c=3 => x = (5 ± √1)/4 => x = 1.5 or x = 1.',
    isBookmarked: true,
    usageCount: 42
  },
  {
    id: 'form-2',
    subject: 'Science',
    chapter: 'Light: Reflection and Refraction',
    topic: 'Spherical Mirrors & Magnification',
    formulaTitle: 'Mirror Formula & Linear Magnification',
    formulaLatex: '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}, \\quad m = -\\frac{v}{u} = \\frac{h\'}{h}',
    meaning: 'Relates focal length (f), image distance (v), and object distance (u) for concave and convex mirrors.',
    variables: [
      { symbol: 'f', meaning: 'Focal length (negative for concave, positive for convex)', unit: 'cm/m' },
      { symbol: 'u', meaning: 'Object distance (always negative)', unit: 'cm/m' },
      { symbol: 'v', meaning: 'Image distance', unit: 'cm/m' },
      { symbol: 'm', meaning: 'Magnification (negative: real/inverted, positive: virtual/erect)' }
    ],
    exampleUsage: 'u = -20 cm, f = -10 cm => 1/v = 1/-10 - 1/-20 = -1/20 => v = -20 cm. m = -(-20)/(-20) = -1.',
    isBookmarked: true,
    usageCount: 38
  },
  {
    id: 'form-3',
    subject: 'Science',
    chapter: 'Electricity',
    topic: 'Ohm\'s Law & Electrical Power',
    formulaTitle: 'Ohm\'s Law and Joule Heating Law',
    formulaLatex: 'V = IR, \\quad H = I^2Rt, \\quad P = VI = I^2R = \\frac{V^2}{R}',
    meaning: 'Calculates potential difference, heat dissipated, and electrical power in ohmic circuits.',
    variables: [
      { symbol: 'V', meaning: 'Electric Potential Difference', unit: 'Volt (V)' },
      { symbol: 'I', meaning: 'Current', unit: 'Ampere (A)' },
      { symbol: 'R', meaning: 'Resistance', unit: 'Ohm (Ω)' },
      { symbol: 'P', meaning: 'Power', unit: 'Watt (W)' }
    ],
    exampleUsage: 'A 220V appliance draws 2A current. Resistance R = 220/2 = 110 Ω. Power P = 220 × 2 = 440 W.',
    isBookmarked: true,
    usageCount: 29
  },
  {
    id: 'form-4',
    subject: 'Mathematics',
    chapter: 'Arithmetic Progressions',
    topic: 'nth Term and Sum of n Terms',
    formulaTitle: 'AP General Term & Sum Formula',
    formulaLatex: 'a_n = a + (n - 1)d, \\quad S_n = \\frac{n}{2}[2a + (n - 1)d] = \\frac{n}{2}(a + l)',
    meaning: 'Finds the nth term and cumulative sum of an arithmetic progression sequence.',
    variables: [
      { symbol: 'a', meaning: 'First term of sequence' },
      { symbol: 'd', meaning: 'Common difference (an - an-1)' },
      { symbol: 'n', meaning: 'Number of terms' },
      { symbol: 'l', meaning: 'Last term (an)' }
    ],
    exampleUsage: 'For AP 2, 7, 12...: a=2, d=5. 10th term a10 = 2 + 9(5) = 47. Sum S10 = 5(2 + 47) = 245.',
    isBookmarked: false,
    usageCount: 22
  }
];

// ----------------------------------------------------
// 11. Initial Daily Question Challenge
// ----------------------------------------------------
export const INITIAL_DAILY_CHALLENGE: DailyChallenge = {
  id: 'dc-2026-08-23',
  date: '2026-08-23',
  subject: 'Mathematics',
  chapter: 'Quadratic Equations',
  title: 'Daily Master Challenge #48: The Reciprocal Roots Puzzle',
  questionText: 'If the roots of the quadratic equation 3x² + kx + 3 = 0 are reciprocal to each other and equal, what is the positive value of k?',
  type: 'mcq',
  options: ['3', '6', '9', '12'],
  correctAnswer: '6',
  explanation: 'For roots to be equal, D = 0 => k² - 4(3)(3) = 0 => k² - 36 = 0 => k = ±6. The positive value of k is 6.',
  xpReward: 150,
  isCompleted: false
};

// ----------------------------------------------------
// 12. Initial Chapter Test Series
// ----------------------------------------------------
export const INITIAL_CHAPTER_TESTS: ChapterTest[] = [
  {
    id: 'test-1',
    title: 'Chapter Test: Quadratic Equations Full Syllabus Drill',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    durationMinutes: 30,
    totalMarks: 20,
    isCompleted: false,
    questions: [
      {
        id: 'tq-1',
        questionText: 'Which of the following equations has 2 as a root?',
        options: ['x² - 4x + 5 = 0', 'x² + 3x - 12 = 0', '2x² - 7x + 6 = 0', '3x² - 6x - 2 = 0'],
        correctIndex: 2,
        marks: 2,
        negativeMarks: 0.5,
        explanation: 'Substitute x = 2 into 2(2)² - 7(2) + 6 = 2(4) - 14 + 6 = 8 - 14 + 6 = 0. Hence x = 2 is a root.'
      },
      {
        id: 'tq-2',
        questionText: 'If 1/2 is a root of the equation x² + kx - 5/4 = 0, then the value of k is:',
        options: ['2', '-2', '1/4', '1/2'],
        correctIndex: 0,
        marks: 2,
        negativeMarks: 0.5,
        explanation: '(1/2)² + k(1/2) - 5/4 = 0 => 1/4 + k/2 - 5/4 = 0 => k/2 - 1 = 0 => k = 2.'
      },
      {
        id: 'tq-3',
        questionText: 'The discriminant of 2√3 x² - 5x + √3 = 0 is:',
        options: ['1', '49', '25', '-11'],
        correctIndex: 0,
        marks: 2,
        negativeMarks: 0.5,
        explanation: 'D = (-5)² - 4(2√3)(√3) = 25 - 4(2)(3) = 25 - 24 = 1.'
      },
      {
        id: 'tq-4',
        questionText: 'A natural number when increased by 12 equals 160 times its reciprocal. Find the number.',
        options: ['8', '10', '4', '12'],
        correctIndex: 2,
        marks: 4,
        negativeMarks: 1,
        explanation: 'Let number be x. x + 12 = 160/x => x² + 12x - 160 = 0 => (x + 20)(x - 4) = 0. Since x is natural, x = 4.'
      }
    ]
  }
];

// ----------------------------------------------------
// 13. Initial Friend Challenges
// ----------------------------------------------------
export const INITIAL_FRIEND_CHALLENGES: FriendChallenge[] = [
  {
    id: 'fc-1',
    title: 'Weekend XP Sprint: Conquer 1000 XP in 48 Hours',
    challengeType: 'most_xp',
    targetGoal: 1000,
    durationDays: 2,
    startDate: '2026-08-22',
    endDate: '2026-08-24',
    status: 'active',
    xpReward: 300,
    participants: [
      {
        id: 'user-1',
        name: 'Ananya Deshmukh',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        progress: 850,
        rank: 1
      },
      {
        id: 'user-current',
        name: 'Aarav Sharma (You)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        progress: 680,
        rank: 2,
        isCurrentUser: true
      },
      {
        id: 'user-2',
        name: 'Kabir Singhania',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        progress: 520,
        rank: 3
      }
    ]
  }
];

// ----------------------------------------------------
// 14. Initial Weekly Champions Archive
// ----------------------------------------------------
export const INITIAL_WEEKLY_CHAMPIONS: WeeklyChampionRecord[] = [
  {
    id: 'wc-1',
    weekRange: 'Aug 10 - Aug 17, 2026',
    topStudents: [
      {
        rank: 1,
        name: 'Ananya Deshmukh',
        school: 'National Public School, Bengaluru',
        xpEarned: 3200,
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        title: 'Weekly Grandmaster 🏆'
      },
      {
        rank: 2,
        name: 'Aarav Sharma',
        school: 'Delhi Public School, R.K. Puram',
        xpEarned: 2850,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: 'Weekly Silver Ace 🥈'
      },
      {
        rank: 3,
        name: 'Kabir Singhania',
        school: 'Bombay Scottish School, Mumbai',
        xpEarned: 2600,
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        title: 'Weekly Bronze Striker 🥉'
      }
    ]
  }
];

// ----------------------------------------------------
// 15. Initial XP Shop Cosmetic Catalog
// ----------------------------------------------------
export const INITIAL_XP_SHOP_ITEMS: XPShopItem[] = [
  {
    id: 'item-theme-futuristic',
    title: 'Cyberpunk Neon Theme',
    category: 'theme',
    costXP: 500,
    isUnlocked: true,
    isEquipped: true,
    description: 'Electrifying dark navy canvas with glowing cyan, electric blue, and bright violet accents.',
    previewColor: '#080B1F',
    iconName: 'Sparkles'
  },
  {
    id: 'item-frame-gold-crown',
    title: 'Grandmaster Gold Crown Frame',
    category: 'frame',
    costXP: 1200,
    isUnlocked: false,
    isEquipped: false,
    description: 'Prestigious shimmering gold aura for your profile avatar.',
    previewColor: '#F59E0B',
    previewClass: 'ring-4 ring-amber-400 shadow-[0_0_15px_#F59E0B]',
    iconName: 'Crown'
  },
  {
    id: 'item-frame-neon-cyan',
    title: 'Cyber Cyan Pulse Frame',
    category: 'frame',
    costXP: 600,
    isUnlocked: true,
    isEquipped: true,
    description: 'High-tech glowing cyan ring that pulses with energy.',
    previewColor: '#22D3EE',
    previewClass: 'ring-4 ring-cyan-400 shadow-[0_0_15px_#22D3EE]',
    iconName: 'Zap'
  },
  {
    id: 'item-badge-formula-master',
    title: 'Formula Wizard Special Title',
    category: 'badge',
    costXP: 800,
    isUnlocked: false,
    isEquipped: false,
    description: 'Unlock exclusive "Formula Wizard" title next to your name on the Leaderboard.',
    previewColor: '#8B5CF6',
    iconName: 'BookOpen'
  },
  {
    id: 'item-effect-confetti',
    title: 'Cosmic Starburst Submit Effect',
    category: 'effect',
    costXP: 1000,
    isUnlocked: false,
    isEquipped: false,
    description: 'Multi-colored holographic starburst burst on every test submission and quiz completion.',
    previewColor: '#EC4899',
    iconName: 'PartyPopper'
  }
];

// ----------------------------------------------------
// 16. Initial Pomodoro Focus Sessions
// ----------------------------------------------------
export const INITIAL_POMODORO_SESSIONS: PomodoroSessionRecord[] = [
  {
    id: 'pomo-1',
    subject: 'Mathematics',
    topic: 'Quadratic Equations Numerical Drill',
    durationMinutes: 25,
    completedAt: '2026-08-23T06:30:00Z',
    xpAwarded: 50
  },
  {
    id: 'pomo-2',
    subject: 'Science',
    topic: 'Optics Ray Diagram Drawing',
    durationMinutes: 25,
    completedAt: '2026-08-22T19:00:00Z',
    xpAwarded: 50
  }
];

// ----------------------------------------------------
// 17. Curriculum Syllabus Catalog
// ----------------------------------------------------
export const CURRICULUM_CATALOG: Record<string, { subject: string; chapters: { id: string; number: number; title: string; difficulty: 'Easy' | 'Medium' | 'Hard' }[] }[]> = {
  'Class 10': [
    {
      subject: 'Mathematics',
      chapters: [
        { id: 'math-c1', number: 1, title: 'Real Numbers', difficulty: 'Easy' },
        { id: 'math-c2', number: 2, title: 'Polynomials', difficulty: 'Medium' },
        { id: 'math-c3', number: 3, title: 'Pair of Linear Equations in Two Variables', difficulty: 'Medium' },
        { id: 'math-c4', number: 4, title: 'Quadratic Equations', difficulty: 'Medium' },
        { id: 'math-c5', number: 5, title: 'Arithmetic Progressions', difficulty: 'Easy' },
        { id: 'math-c6', number: 6, title: 'Triangles', difficulty: 'Hard' },
        { id: 'math-c7', number: 7, title: 'Coordinate Geometry', difficulty: 'Medium' },
        { id: 'math-c8', number: 8, title: 'Introduction to Trigonometry', difficulty: 'Hard' },
        { id: 'math-c9', number: 9, title: 'Some Applications of Trigonometry', difficulty: 'Hard' },
        { id: 'math-c10', number: 10, title: 'Circles', difficulty: 'Medium' },
        { id: 'math-c11', number: 11, title: 'Areas Related to Circles', difficulty: 'Medium' },
        { id: 'math-c12', number: 12, title: 'Surface Areas and Volumes', difficulty: 'Hard' },
        { id: 'math-c13', number: 13, title: 'Statistics', difficulty: 'Easy' },
        { id: 'math-c14', number: 14, title: 'Probability', difficulty: 'Easy' },
      ]
    },
    {
      subject: 'Science',
      chapters: [
        { id: 'sci-c1', number: 1, title: 'Chemical Reactions and Equations', difficulty: 'Medium' },
        { id: 'sci-c2', number: 2, title: 'Acids, Bases and Salts', difficulty: 'Medium' },
        { id: 'sci-c3', number: 3, title: 'Metals and Non-metals', difficulty: 'Medium' },
        { id: 'sci-c4', number: 4, title: 'Carbon and its Compounds', difficulty: 'Hard' },
        { id: 'sci-c5', number: 5, title: 'Life Processes', difficulty: 'Hard' },
        { id: 'sci-c6', number: 6, title: 'Control and Coordination', difficulty: 'Medium' },
        { id: 'sci-c7', number: 7, title: 'How do Organisms Reproduce?', difficulty: 'Medium' },
        { id: 'sci-c8', number: 8, title: 'Heredity', difficulty: 'Medium' },
        { id: 'sci-c9', number: 9, title: 'Light - Reflection and Refraction', difficulty: 'Hard' },
        { id: 'sci-c10', number: 10, title: 'Human Eye and the Colourful World', difficulty: 'Easy' },
        { id: 'sci-c11', number: 11, title: 'Electricity', difficulty: 'Hard' },
        { id: 'sci-c12', number: 12, title: 'Magnetic Effects of Electric Current', difficulty: 'Hard' },
        { id: 'sci-c13', number: 13, title: 'Our Environment', difficulty: 'Easy' },
      ]
    },
    {
      subject: 'Social Science',
      chapters: [
        { id: 'sst-c1', number: 1, title: 'The Rise of Nationalism in Europe', difficulty: 'Medium' },
        { id: 'sst-c2', number: 2, title: 'Nationalism in India', difficulty: 'Medium' },
        { id: 'sst-c3', number: 3, title: 'Resources and Development', difficulty: 'Easy' },
        { id: 'sst-c4', number: 4, title: 'Power Sharing', difficulty: 'Easy' },
        { id: 'sst-c5', number: 5, title: 'Money and Credit', difficulty: 'Medium' },
      ]
    },
    {
      subject: 'English',
      chapters: [
        { id: 'eng-c1', number: 1, title: 'A Letter to God', difficulty: 'Easy' },
        { id: 'eng-c2', number: 2, title: 'Nelson Mandela: Long Walk to Freedom', difficulty: 'Medium' },
        { id: 'eng-c3', number: 3, title: 'Two Stories about Flying', difficulty: 'Easy' },
        { id: 'eng-c4', number: 4, title: 'From the Diary of Anne Frank', difficulty: 'Medium' },
      ]
    },
    {
      subject: 'Hindi',
      chapters: [
        { id: 'hin-c1', number: 1, title: 'सूरदास के पद', difficulty: 'Medium' },
        { id: 'hin-c2', number: 2, title: 'राम-लक्ष्मण-परशुराम संवाद', difficulty: 'Hard' },
        { id: 'hin-c3', number: 3, title: 'नेताजी का चश्मा', difficulty: 'Easy' },
        { id: 'hin-c4', number: 4, title: 'बालगोबिन भगत', difficulty: 'Easy' },
      ]
    }
  ],
  'Class 12': [
    {
      subject: 'Mathematics',
      chapters: [
        { id: 'm12-c1', number: 1, title: 'Relations and Functions', difficulty: 'Medium' },
        { id: 'm12-c2', number: 2, title: 'Inverse Trigonometric Functions', difficulty: 'Medium' },
        { id: 'm12-c3', number: 3, title: 'Matrices', difficulty: 'Easy' },
        { id: 'm12-c4', number: 4, title: 'Determinants', difficulty: 'Medium' },
        { id: 'm12-c5', number: 5, title: 'Continuity and Differentiability', difficulty: 'Hard' },
        { id: 'm12-c6', number: 6, title: 'Application of Derivatives', difficulty: 'Hard' },
        { id: 'm12-c7', number: 7, title: 'Integrals', difficulty: 'Hard' },
      ]
    },
    {
      subject: 'Physics',
      chapters: [
        { id: 'phy12-c1', number: 1, title: 'Electric Charges and Fields', difficulty: 'Hard' },
        { id: 'phy12-c2', number: 2, title: 'Electrostatic Potential and Capacitance', difficulty: 'Medium' },
        { id: 'phy12-c3', number: 3, title: 'Current Electricity', difficulty: 'Medium' },
        { id: 'phy12-c4', number: 4, title: 'Moving Charges and Magnetism', difficulty: 'Hard' },
      ]
    }
  ]
};

// ----------------------------------------------------
// 18. Gamification Achievements & Badges List
// ----------------------------------------------------
export const ACHIEVEMENTS_LIST = [
  {
    id: 'badge-1',
    title: 'First Step to Glory',
    description: 'Solve your first DPP practice test or doubt on EduSpark.',
    iconName: 'Zap',
    xpReward: 50,
    unlocked: true,
    unlockedDate: '2026-08-15',
    category: 'Getting Started'
  },
  {
    id: 'badge-2',
    title: 'Streak Titan (7 Days)',
    description: 'Maintain an uninterrupted 7-day study streak.',
    iconName: 'Flame',
    xpReward: 200,
    unlocked: true,
    unlockedDate: '2026-08-20',
    category: 'Consistency'
  },
  {
    id: 'badge-3',
    title: 'Century Solver (100 Questions)',
    description: 'Successfully solve 100 math and science questions with step-by-step verified answers.',
    iconName: 'Award',
    xpReward: 500,
    unlocked: true,
    unlockedDate: '2026-08-22',
    category: 'Mastery'
  },
  {
    id: 'badge-4',
    title: 'Viva Prodigy',
    description: 'Score 90%+ in an AI Mock Viva oral examination.',
    iconName: 'Mic',
    xpReward: 300,
    unlocked: false,
    category: 'Oral Exam'
  },
  {
    id: 'badge-5',
    title: 'Spaced Memory Master',
    description: 'Complete 4 revision intervals on the Ebbinghaus forgetting curve without missing a day.',
    iconName: 'RotateCcw',
    xpReward: 400,
    unlocked: false,
    category: 'Memory & Retention'
  },
  {
    id: 'badge-6',
    title: 'Formula Wizard',
    description: 'Master 50 formulas in the Formula Vault with self-tests.',
    iconName: 'BookOpen',
    xpReward: 350,
    unlocked: false,
    category: 'Formulas'
  }
];


