import React, { useState, useEffect } from 'react';
import { Clock, Star, CheckCircle, ArrowLeft } from 'lucide-react';
import { Recommendation, LearningSession } from '../types';

interface StudySessionProps {
  recommendation: Recommendation;
  onComplete: (session: Omit<LearningSession, 'id' | 'userId' | 'completedAt'>) => void;
  onBack: () => void;
}

export default function StudySession({ recommendation, onComplete, onBack }: StudySessionProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
  };

  const handleFinish = () => {
    if (rating === 0) {
      alert('Please rate your experience before finishing');
      return;
    }

    onComplete({
      techniqueId: recommendation.technique.id,
      duration: timeElapsed,
      rating,
      notes
    });
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Completed!</h2>
              <p className="text-gray-600">How was your experience with {recommendation.technique.name}?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rate this learning technique (1-5 stars)
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-lg transition-colors ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="h-8 w-8" fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good!' : rating === 3 ? 'Good!' : rating === 2 ? 'Fair' : 'Needs Improvement'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any insights, challenges, or thoughts about this technique..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={onBack}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Back to Recommendations
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Complete Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Recommendations
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{recommendation.technique.name}</h1>
              <p className="text-gray-600">{recommendation.technique.description}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {formatTime(timeElapsed)}
              </div>
              <p className="text-sm text-gray-500">Time Elapsed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Personalized Tips</h3>
              <ul className="space-y-2">
                {recommendation.personalizedTips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Estimated Duration</h3>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-lg font-semibold text-blue-600">
                  {recommendation.technique.estimatedTime} minutes
                </span>
              </div>
              <p className="text-sm text-gray-600">Recommended study time for optimal results</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Why This Works</h3>
              <p className="text-sm text-gray-600">{recommendation.reasoning}</p>
              <div className="mt-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {Math.round(recommendation.confidence * 100)}% match
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {!isActive && timeElapsed === 0 && (
              <button
                onClick={handleStart}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-lg"
              >
                Start Learning Session
              </button>
            )}

            {isActive && (
              <button
                onClick={handlePause}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-lg"
              >
                Pause Session
              </button>
            )}

            {!isActive && timeElapsed > 0 && (
              <div className="flex gap-4">
                <button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Resume Session
                </button>
                <button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Complete Session
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Study Area</h3>
          <div className="bg-gray-50 rounded-xl p-6 min-h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Ready to Learn</h4>
              <p className="text-gray-600 max-w-md">
                This is your dedicated study space. Use the timer above to track your progress 
                and apply the personalized tips provided for maximum effectiveness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}