import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import CourseDetailPage from './components/CourseDetailPage';
import CertificatePage from './components/CertificatePage';
import { User, Course } from './types';
import { courses as coursesData } from './data/courses';

// Custom hook to manage state with localStorage
function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, state]);

  return [state, setState];
}


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile' | 'courseDetail' | 'certificate'>('dashboard');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    
    // Persisted State
    const [courses, setCourses] = useLocalStorageState<Course[]>('courses', coursesData);
    const [enrolledCourseIds, setEnrolledCourseIds] = useLocalStorageState<number[]>('enrolledCourseIds', [1, 2, 4, 5, 6]);
    const [completedModules, setCompletedModules] = useLocalStorageState<Record<number, string[]>>('completedModules', {
        1: ['ai-m1'], 
        2: ['cs-m1'],
        5: ['pm-m1'],
        6: ['dsa-m1'],
    });

    const [user, setUser] = useState<User>({
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        rollNo: 'CS-101',
        yearOfPassing: 2024,
        institute: 'Learnovaaaa University',
        bio: 'Passionate learner exploring the world of AI and web development. Eager to connect with fellow developers and contribute to innovative projects.'
    });

    const handleLogin = () => {
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    const handleViewProfile = () => {
        setCurrentPage('profile');
    };
    
    const handleBackToDashboard = () => {
        setCurrentPage('dashboard');
        setSelectedCourse(null);
    };

    const handleProfileUpdate = (updatedUser: User) => {
        setUser(updatedUser);
        setCurrentPage('dashboard');
    }

    const handleSelectCourse = (course: Course) => {
        setSelectedCourse(course);
        setCurrentPage('courseDetail');
    }

    const handleViewCertificate = (course: Course) => {
        setSelectedCourse(course);
        setCurrentPage('certificate');
    }

    const handleToggleModuleCompletion = (courseId: number, moduleId: string) => {
        setCompletedModules(prev => {
            const currentCourseModules = prev[courseId] || [];
            const isCompleted = currentCourseModules.includes(moduleId);
            const newCompleted = isCompleted 
                ? currentCourseModules.filter(id => id !== moduleId)
                : [...currentCourseModules, moduleId];
            
            // Update course progress based on new completed modules
            const course = courses.find(c => c.id === courseId);
            if (course) {
                const totalModules = course.modules.length;
                let newProgress = totalModules > 0 ? Math.round((newCompleted.length / totalModules) * 100) : 0;
                
                // Ensure progress is 100 only if all modules are complete
                if (newCompleted.length === totalModules) {
                    newProgress = 100;
                }

                setCourses(prevCourses => 
                    prevCourses.map(c => 
                        c.id === courseId ? { ...c, progress: newProgress } : c
                    )
                );
            }

            return { ...prev, [courseId]: newCompleted };
        });
    };

    const handleEnrollCourse = (courseId: number) => {
        if (!enrolledCourseIds.includes(courseId)) {
            setEnrolledCourseIds(prev => [...prev, courseId]);
        }
    };

    const renderPage = () => {
        const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
        const availableCourses = courses.filter(c => !enrolledCourseIds.includes(c.id));

        switch (currentPage) {
            case 'profile':
                return <ProfilePage user={user} onUpdateProfile={handleProfileUpdate} onBack={handleBackToDashboard} />;
            case 'courseDetail':
                return <CourseDetailPage 
                    course={selectedCourse!} 
                    onBack={handleBackToDashboard} 
                    completedModules={completedModules[selectedCourse!.id] || []}
                    onToggleModuleCompletion={handleToggleModuleCompletion}
                />;
            case 'certificate':
                return <CertificatePage user={user} course={selectedCourse!} onBack={handleBackToDashboard} />;
            case 'dashboard':
            default:
                return <Dashboard 
                    user={user} 
                    onLogout={handleLogout} 
                    onViewProfile={handleViewProfile}
                    enrolledCourses={enrolledCourses}
                    availableCourses={availableCourses}
                    onSelectCourse={handleSelectCourse}
                    onEnrollCourse={handleEnrollCourse}
                    onViewCertificate={handleViewCertificate}
                />;
        }
    }

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <>
            {renderPage()}
        </>
    );
};

export default App;