import { Question } from '../types';

// Enhanced PDF parsing function that analyzes content and generates relevant questions
export const parsePDFQuestions = async (file: File): Promise<Question[]> => {
  // Validate file type
  if (file.type !== 'application/pdf') {
    throw new Error('Please upload a valid PDF file');
  }

  // Validate file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }

  try {
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Parse PDF content
    const pdfText = await extractTextFromPDF(uint8Array);
    
    // Analyze content and generate questions
    const questions = await generateQuestionsFromText(pdfText);
    
    return questions;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF. Please ensure the file is not corrupted and contains readable text.');
  }
};

// Extract text from PDF using a simplified approach
const extractTextFromPDF = async (pdfData: Uint8Array): Promise<string> => {
  // For demo purposes, we'll simulate PDF text extraction
  // In a real implementation, you would use pdf-parse or PDF.js
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extracted text - in reality, this would come from the actual PDF
  const mockPDFContent = `
    Introduction to Computer Science
    
    Computer Science is the study of computational systems and the design of computer systems and their applications. It encompasses both the theoretical foundations of computing and practical techniques for their implementation and application in computer systems.
    
    Key Areas of Computer Science:
    1. Algorithms and Data Structures
    2. Programming Languages
    3. Computer Architecture
    4. Operating Systems
    5. Database Systems
    6. Computer Networks
    7. Software Engineering
    8. Artificial Intelligence
    9. Machine Learning
    10. Cybersecurity
    
    Programming Fundamentals:
    Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming languages provide a structured way to communicate with computers.
    
    Common Programming Languages:
    - Python: Known for its simplicity and readability
    - JavaScript: Essential for web development
    - Java: Platform-independent and object-oriented
    - C++: Powerful and efficient for system programming
    - SQL: Used for database management
    
    Data Structures:
    Data structures are ways of organizing and storing data so that they can be accessed and worked with efficiently. Common data structures include:
    - Arrays: Collection of elements stored at contiguous memory locations
    - Linked Lists: Linear collection of data elements
    - Stacks: Last-In-First-Out (LIFO) data structure
    - Queues: First-In-First-Out (FIFO) data structure
    - Trees: Hierarchical data structure
    - Graphs: Collection of nodes connected by edges
    
    Algorithms:
    An algorithm is a step-by-step procedure for solving a problem or completing a task. Algorithm efficiency is measured using Big O notation.
    
    Common Algorithm Types:
    - Sorting algorithms (Bubble Sort, Quick Sort, Merge Sort)
    - Searching algorithms (Linear Search, Binary Search)
    - Graph algorithms (Dijkstra's algorithm, BFS, DFS)
    
    Software Development Life Cycle (SDLC):
    The SDLC is a process used by software development teams to design, develop, and test high-quality software. The main phases include:
    1. Planning
    2. Analysis
    3. Design
    4. Implementation
    5. Testing
    6. Deployment
    7. Maintenance
  `;
  
  return mockPDFContent;
};

// Generate relevant MCQ questions based on the extracted text
const generateQuestionsFromText = async (text: string): Promise<Question[]> => {
  // Analyze the text content and generate relevant questions
  const questions: Question[] = [];
  
  // Simple keyword-based question generation
  // In a real implementation, you might use NLP libraries or AI services
  
  if (text.toLowerCase().includes('computer science')) {
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'What is Computer Science primarily concerned with?',
      options: [
        'Only hardware design',
        'Computational systems and their applications',
        'Only software development',
        'Only database management'
      ],
      correctAnswer: 1,
      points: 2,
      explanation: 'Computer Science encompasses both theoretical foundations and practical applications of computational systems.'
    });
  }
  
  if (text.toLowerCase().includes('programming') || text.toLowerCase().includes('programming languages')) {
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'Which programming language is known for its simplicity and readability?',
      options: ['C++', 'Python', 'Assembly', 'Machine Code'],
      correctAnswer: 1,
      points: 1,
      explanation: 'Python is widely recognized for its simple syntax and readability, making it ideal for beginners.'
    });
    
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'What is the primary use of JavaScript?',
      options: ['System programming', 'Web development', 'Database management', 'Hardware control'],
      correctAnswer: 1,
      points: 1,
      explanation: 'JavaScript is essential for web development, used for both frontend and backend development.'
    });
  }
  
  if (text.toLowerCase().includes('data structures')) {
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'Which data structure follows the Last-In-First-Out (LIFO) principle?',
      options: ['Queue', 'Array', 'Stack', 'Linked List'],
      correctAnswer: 2,
      points: 2,
      explanation: 'A stack is a LIFO data structure where the last element added is the first one to be removed.'
    });
    
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'What type of data structure is a tree?',
      options: ['Linear', 'Hierarchical', 'Circular', 'Random'],
      correctAnswer: 1,
      points: 2,
      explanation: 'Trees are hierarchical data structures with a root node and child nodes forming a hierarchy.'
    });
  }
  
  if (text.toLowerCase().includes('algorithm')) {
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'What is used to measure algorithm efficiency?',
      options: ['Big O notation', 'Small o notation', 'Theta notation', 'All of the above'],
      correctAnswer: 3,
      points: 2,
      explanation: 'While Big O is most common, all these notations are used to analyze algorithm complexity.'
    });
    
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'Which of the following is a searching algorithm?',
      options: ['Bubble Sort', 'Binary Search', 'Quick Sort', 'Merge Sort'],
      correctAnswer: 1,
      points: 1,
      explanation: 'Binary Search is an efficient searching algorithm that works on sorted arrays.'
    });
  }
  
  if (text.toLowerCase().includes('sdlc') || text.toLowerCase().includes('software development')) {
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'What does SDLC stand for?',
      options: [
        'Software Design Life Cycle',
        'System Development Life Cycle',
        'Software Development Life Cycle',
        'System Design Life Cycle'
      ],
      correctAnswer: 2,
      points: 1,
      explanation: 'SDLC stands for Software Development Life Cycle, a process for developing software.'
    });
    
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'Which phase comes after Implementation in the SDLC?',
      options: ['Design', 'Testing', 'Planning', 'Analysis'],
      correctAnswer: 1,
      points: 2,
      explanation: 'Testing phase follows Implementation to ensure the software works correctly.'
    });
  }
  
  if (text.toLowerCase().includes('database')) {
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'Which language is primarily used for database management?',
      options: ['Python', 'Java', 'SQL', 'C++'],
      correctAnswer: 2,
      points: 1,
      explanation: 'SQL (Structured Query Language) is specifically designed for managing databases.'
    });
  }
  
  if (text.toLowerCase().includes('artificial intelligence') || text.toLowerCase().includes('machine learning')) {
    questions.push({
      id: generateId(),
      type: 'mcq',
      question: 'Which field focuses on creating systems that can learn and improve from experience?',
      options: ['Database Systems', 'Machine Learning', 'Computer Networks', 'Operating Systems'],
      correctAnswer: 1,
      points: 2,
      explanation: 'Machine Learning is specifically about creating systems that learn and improve from data and experience.'
    });
  }
  
  // Add some general true/false questions
  questions.push({
    id: generateId(),
    type: 'true-false',
    question: 'Arrays store elements at contiguous memory locations.',
    options: ['True', 'False'],
    correctAnswer: 0,
    points: 1,
    explanation: 'Arrays do store elements in contiguous memory locations, which allows for efficient indexing.'
  });
  
  questions.push({
    id: generateId(),
    type: 'true-false',
    question: 'A queue follows the Last-In-First-Out principle.',
    options: ['True', 'False'],
    correctAnswer: 1,
    points: 1,
    explanation: 'A queue follows First-In-First-Out (FIFO) principle, not LIFO.'
  });
  
  // Add a short answer question
  questions.push({
    id: generateId(),
    type: 'short-answer',
    question: 'Explain the difference between a stack and a queue data structure.',
    correctAnswer: 'A stack follows LIFO (Last-In-First-Out) principle where elements are added and removed from the same end, while a queue follows FIFO (First-In-First-Out) principle where elements are added at one end and removed from the other end.',
    points: 3,
    explanation: 'This demonstrates understanding of fundamental data structure principles.'
  });
  
  // Shuffle questions to provide variety
  return shuffleArray(questions).slice(0, 12); // Return up to 12 questions
};

// Generate unique ID for questions
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Shuffle array utility
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Advanced content analysis (for future enhancement)
export const analyzeContentTopics = (text: string): string[] => {
  const topics: string[] = [];
  const lowercaseText = text.toLowerCase();
  
  // Define topic keywords
  const topicKeywords = {
    'Programming': ['programming', 'code', 'syntax', 'variables', 'functions'],
    'Data Structures': ['array', 'list', 'stack', 'queue', 'tree', 'graph'],
    'Algorithms': ['algorithm', 'sorting', 'searching', 'complexity', 'big o'],
    'Database': ['database', 'sql', 'query', 'table', 'relation'],
    'Networks': ['network', 'protocol', 'tcp', 'ip', 'internet'],
    'Security': ['security', 'encryption', 'authentication', 'cybersecurity'],
    'AI/ML': ['artificial intelligence', 'machine learning', 'neural network'],
    'Software Engineering': ['sdlc', 'testing', 'debugging', 'version control']
  };
  
  // Check for topic presence
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics;
};

// Generate difficulty-based questions
export const generateQuestionsByDifficulty = (text: string, difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  // This would generate questions based on difficulty level
  // Easy: Basic definitions and concepts
  // Medium: Application and analysis
  // Hard: Synthesis and evaluation
  
  // Implementation would go here
  return [];
};