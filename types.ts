// Fix: Define interfaces based on usage in components like Dashboard.tsx
export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface Quiz {
    title: string;
    questions: QuizQuestion[];
    passingScore: number; // Percentage (e.g., 75)
}

export interface Assignment {
    title: string;
    description: string;
}

export interface Module {
    id: string;
    title: string;
    duration: string;
    videoUrl: string;
    description: string;
    quiz: Quiz;
    assignment?: Assignment;
}

export interface Course {
    id: number;
    title: string;
    category: string;
    duration: string;
    progress: number;
    imageUrl: string;
    description: string;
    modules: Module[];
    finalAssessment: Quiz;
    difficulty: string;
}

export interface User {
    name: string;
    email: string;
    avatarUrl: string;
    rollNo?: string;
    yearOfPassing?: number;
    institute?: string;
    bio?: string;
}

export interface ProgressData {
    month: string;
    completed: number;
}