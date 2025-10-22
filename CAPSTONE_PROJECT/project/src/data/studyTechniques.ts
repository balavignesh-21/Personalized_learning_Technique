import { StudyTechnique } from '../types';

export const studyTechniques: StudyTechnique[] = [
  {
    id: '1',
    name: 'Interactive Flashcards',
    description: 'Digital flashcards with spaced repetition algorithms',
    type: 'visual',
    effectiveness: 0.85,
    difficulty: 'beginner',
    estimatedTime: 15,
    tags: ['memory', 'vocabulary', 'quick-review']
  },
  {
    id: '2',
    name: 'Video Lectures',
    description: 'Engaging video content with visual demonstrations',
    type: 'visual',
    effectiveness: 0.78,
    difficulty: 'beginner',
    estimatedTime: 30,
    tags: ['comprehensive', 'demonstration', 'passive-learning']
  },
  {
    id: '3',
    name: 'Audio Podcasts',
    description: 'Educational podcasts and audio explanations',
    type: 'auditory',
    effectiveness: 0.72,
    difficulty: 'beginner',
    estimatedTime: 25,
    tags: ['multitasking', 'storytelling', 'discussion']
  },
  {
    id: '4',
    name: 'Practice Quizzes',
    description: 'Interactive quizzes with immediate feedback',
    type: 'reading',
    effectiveness: 0.88,
    difficulty: 'intermediate',
    estimatedTime: 20,
    tags: ['assessment', 'active-recall', 'feedback']
  },
  {
    id: '5',
    name: 'Mind Mapping',
    description: 'Visual representation of information and concepts',
    type: 'visual',
    effectiveness: 0.82,
    difficulty: 'intermediate',
    estimatedTime: 35,
    tags: ['organization', 'creativity', 'connections']
  },
  {
    id: '6',
    name: 'Hands-on Projects',
    description: 'Practical application through real-world projects',
    type: 'kinesthetic',
    effectiveness: 0.92,
    difficulty: 'advanced',
    estimatedTime: 120,
    tags: ['application', 'creativity', 'problem-solving']
  },
  {
    id: '7',
    name: 'Group Discussions',
    description: 'Collaborative learning through peer interaction',
    type: 'auditory',
    effectiveness: 0.79,
    difficulty: 'intermediate',
    estimatedTime: 45,
    tags: ['collaboration', 'communication', 'perspectives']
  },
  {
    id: '8',
    name: 'Note-taking Systems',
    description: 'Structured note-taking methods and templates',
    type: 'reading',
    effectiveness: 0.76,
    difficulty: 'beginner',
    estimatedTime: 25,
    tags: ['organization', 'summary', 'retention']
  },
  {
    id: '9',
    name: 'Simulation Games',
    description: 'Interactive simulations and educational games',
    type: 'kinesthetic',
    effectiveness: 0.84,
    difficulty: 'intermediate',
    estimatedTime: 40,
    tags: ['engagement', 'problem-solving', 'fun']
  },
  {
    id: '10',
    name: 'Research Papers',
    description: 'In-depth reading and analysis of academic sources',
    type: 'reading',
    effectiveness: 0.75,
    difficulty: 'advanced',
    estimatedTime: 60,
    tags: ['analysis', 'critical-thinking', 'depth']
  }
];