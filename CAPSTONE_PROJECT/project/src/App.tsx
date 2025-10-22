import React, { useState, useEffect } from 'react';
import { Brain, User, BarChart3, BookOpen, Settings, Menu, X } from 'lucide-react';
import LearningStyleAssessment from './components/LearningStyleAssessment';
import Dashboard from './components/Dashboard';
import RecommendationCard from './components/RecommendationCard';
import StudySession from './components/StudySession';
import QuickQuiz from './components/QuickQuiz';
import { UserProfile, LearningStyle, QuizResult, LearningSession, Recommendation } from './types';
import { RecommendationEngine } from './utils/recommendationEngine';
import { useLocalStorage } from './hooks/useLocalStorage';

type View = 'home' | 'assessment' | 'dashboard' | 'recommendations' | 'session' | 'quiz';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [quizResults, setQuizResults] = useLocalStorage<QuizResult[]>('quizResults', []);
  const [learningSessions, setLearningSessions] = useLocalStorage<LearningSession[]>('learningSessions', []);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const recommendationEngine = new RecommendationEngine();

  useEffect(() => {
    if (userProfile) {
      const newRecommendations = recommendationEngine.generateRecommendations(
        userProfile.learningStyle,
        quizResults,
        learningSessions
      );
      setRecommendations(newRecommendations);
    }
  }, [userProfile, quizResults, learningSessions]);

  const handleAssessmentComplete = (learningStyle: LearningStyle, responses: Record<string, number>) => {
    const dominantStyle = Object.entries(learningStyle).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const styleName = dominantStyle === 'readingWriting' ? 'Reading/Writing' : 
                      dominantStyle.charAt(0).toUpperCase() + dominantStyle.slice(1);

    const newProfile: UserProfile = {
      id: 'user-1',
      name: 'Learning Explorer',
      email: 'user@example.com',
      learningStyle,
      dominantStyle: styleName,
      preferences: Object.entries(responses)
        .filter(([_, value]) => value >= 4)
        .map(([key]) => key),
      createdAt: new Date()
    };

    setUserProfile(newProfile);
    setCurrentView('recommendations');
  };

  const handleQuizComplete = (result: Omit<QuizResult, 'id' | 'userId' | 'completedAt'>) => {
    const newResult: QuizResult = {
      id: `quiz-${Date.now()}`,
      userId: userProfile?.id || 'user-1',
      ...result,
      completedAt: new Date()
    };

    setQuizResults([...quizResults, newResult]);
    setCurrentView('recommendations');
  };

  const handleSessionComplete = (session: Omit<LearningSession, 'id' | 'userId' | 'completedAt'>) => {
    const newSession: LearningSession = {
      id: `session-${Date.now()}`,
      userId: userProfile?.id || 'user-1',
      ...session,
      completedAt: new Date()
    };

    setLearningSessions([...learningSessions, newSession]);
    setSelectedRecommendation(null);
    setCurrentView('dashboard');
  };

  const navigation = [
    { name: 'Dashboard', icon: BarChart3, view: 'dashboard' as View },
    { name: 'Recommendations', icon: Brain, view: 'recommendations' as View },
    { name: 'Quick Quiz', icon: BookOpen, view: 'quiz' as View },
    { name: 'Profile', icon: User, view: 'assessment' as View },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'assessment':
        return (
          <LearningStyleAssessment
            onComplete={handleAssessmentComplete}
            onCancel={() => setCurrentView(userProfile ? 'dashboard' : 'home')}
          />
        );

      case 'dashboard':
        if (!userProfile) {
          setCurrentView('home');
          return null;
        }
        return (
          <div className="p-6">
            <Dashboard 
              userProfile={userProfile} 
              quizResults={quizResults} 
              sessions={learningSessions}
            />
          </div>
        );

      case 'recommendations':
        if (!userProfile) {
          setCurrentView('home');
          return null;
        }
        return (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Personalized Learning Recommendations
                </h1>
                <p className="text-gray-600">
                  AI-powered suggestions based on your {userProfile.dominantStyle.toLowerCase()} learning style
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onSelect={(rec) => {
                      setSelectedRecommendation(rec);
                      setCurrentView('session');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'session':
        if (!selectedRecommendation) {
          setCurrentView('recommendations');
          return null;
        }
        return (
          <StudySession
            recommendation={selectedRecommendation}
            onComplete={handleSessionComplete}
            onBack={() => {
              setSelectedRecommendation(null);
              setCurrentView('recommendations');
            }}
          />
        );

      case 'quiz':
        return (
          <QuickQuiz
            onComplete={handleQuizComplete}
            onCancel={() => setCurrentView(userProfile ? 'dashboard' : 'home')}
          />
        );

      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                  <Brain className="h-12 w-12 text-white" />
                </div>
                
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Personalized Learning Recommender
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Discover your unique learning style and get AI-powered recommendations 
                  for study techniques that match how you learn best.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="p-6 bg-purple-50 rounded-2xl">
                    <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">AI-Powered Analysis</h3>
                    <p className="text-gray-600 text-sm">Advanced algorithms analyze your learning patterns</p>
                  </div>
                  
                  <div className="p-6 bg-blue-50 rounded-2xl">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Settings className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Personalized Techniques</h3>
                    <p className="text-gray-600 text-sm">Custom study methods tailored to your style</p>
                  </div>
                  
                  <div className="p-6 bg-green-50 rounded-2xl">
                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Adaptive Learning</h3>
                    <p className="text-gray-600 text-sm">Recommendations improve as you progress</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setCurrentView('assessment')}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-8 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Start Learning Style Assessment
                  </button>
                  
                  {userProfile && (
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className="w-full bg-white text-purple-600 py-4 px-8 rounded-xl text-lg font-semibold border-2 border-purple-200 hover:bg-purple-50 transition-all duration-200"
                    >
                      View Your Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (currentView === 'home' || currentView === 'assessment' || currentView === 'session' || currentView === 'quiz') {
    return <div className="App">{renderContent()}</div>;
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">LearnAI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => setCurrentView(item.view)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      currentView === item.view
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setCurrentView(item.view);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      currentView === item.view
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;