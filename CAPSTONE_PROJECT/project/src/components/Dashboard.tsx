import React from 'react';
import { BarChart, TrendingUp, Clock, Target, BookOpen } from 'lucide-react';
import { UserProfile, QuizResult, LearningSession } from '../types';

interface DashboardProps {
  userProfile: UserProfile;
  quizResults: QuizResult[];
  sessions: LearningSession[];
}

export default function Dashboard({ userProfile, quizResults, sessions }: DashboardProps) {
  const recentQuizzes = quizResults.slice(-5);
  const averageScore = quizResults.length > 0 
    ? Math.round(quizResults.reduce((sum, quiz) => sum + quiz.score, 0) / quizResults.length)
    : 0;

  const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  const averageRating = sessions.length > 0
    ? (sessions.reduce((sum, session) => sum + session.rating, 0) / sessions.length).toFixed(1)
    : '0';

  const learningStyleData = [
    { name: 'Visual', value: Math.round(userProfile.learningStyle.visual * 100), color: 'bg-purple-500' },
    { name: 'Auditory', value: Math.round(userProfile.learningStyle.auditory * 100), color: 'bg-blue-500' },
    { name: 'Reading/Writing', value: Math.round(userProfile.learningStyle.readingWriting * 100), color: 'bg-green-500' },
    { name: 'Kinesthetic', value: Math.round(userProfile.learningStyle.kinesthetic * 100), color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Analytics Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Average Score</p>
                <p className="text-2xl font-bold">{averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Study Time</p>
                <p className="text-2xl font-bold">{Math.round(totalStudyTime / 60)}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Technique Rating</p>
                <p className="text-2xl font-bold">{averageRating}/5</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Completed Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-800">Learning Style Profile</h3>
          </div>
          
          <div className="space-y-4">
            {learningStyleData.map((style) => (
              <div key={style.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{style.name}</span>
                  <span className="text-sm text-gray-600">{style.value}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className={`${style.color} rounded-full h-3 transition-all duration-500`}
                    style={{ width: `${style.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Dominant Style:</span> {userProfile.dominantStyle}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">Recent Quiz Performance</h3>
          </div>
          
          {recentQuizzes.length > 0 ? (
            <div className="space-y-3">
              {recentQuizzes.map((quiz, index) => (
                <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{quiz.topic}</p>
                    <p className="text-sm text-gray-600">{new Date(quiz.completedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${quiz.score >= 80 ? 'text-green-600' : quiz.score >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                      {quiz.score}%
                    </p>
                    <p className="text-xs text-gray-500">{quiz.timeSpent}min</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No quiz results yet</p>
              <p className="text-sm text-gray-500">Complete a quiz to see your performance here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}