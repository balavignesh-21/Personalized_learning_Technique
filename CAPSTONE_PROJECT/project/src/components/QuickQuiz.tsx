import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { QuizResult } from '../types';

interface QuickQuizProps {
  onComplete: (result: Omit<QuizResult, 'id' | 'userId' | 'completedAt'>) => void;
  onCancel: () => void;
}

const sampleQuestions = [
  {
    id: 1,
    question: "What is the primary benefit of spaced repetition in learning?",
    options: [
      "It makes studying more fun",
      "It helps with long-term retention",
      "It reduces study time immediately",
      "It eliminates the need for review"
    ],
    correct: 1,
    topic: "Learning Strategies"
  },
  {
    id: 2,
    question: "Which learning technique is most effective for kinesthetic learners?",
    options: [
      "Reading textbooks",
      "Listening to lectures",
      "Hands-on practice",
      "Watching videos"
    ],
    correct: 2,
    topic: "Learning Styles"
  },
  {
    id: 3,
    question: "What does 'metacognition' refer to in learning?",
    options: [
      "Learning multiple subjects at once",
      "Using technology to learn",
      "Thinking about your thinking",
      "Learning from mistakes"
    ],
    correct: 2,
    topic: "Cognitive Science"
  },
  {
    id: 4,
    question: "Which memory technique involves creating vivid mental images?",
    options: [
      "Rote memorization",
      "Visualization",
      "Repetition",
      "Outlining"
    ],
    correct: 1,
    topic: "Memory Techniques"
  },
  {
    id: 5,
    question: "What is the 'testing effect' in learning?",
    options: [
      "The stress caused by exams",
      "Improved retention through retrieval practice",
      "The time spent preparing for tests",
      "The difficulty level of assessments"
    ],
    correct: 1,
    topic: "Learning Psychology"
  }
];

export default function QuickQuiz({ onComplete, onCancel }: QuickQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (currentQuestion < sampleQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    sampleQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / sampleQuestions.length) * 100);
  };

  const handleComplete = () => {
    const score = calculateScore();
    const timeSpent = Math.round((Date.now() - startTime) / 60000); // minutes
    
    onComplete({
      score,
      topic: "Quick Assessment",
      timeSpent,
      attempts: 1
    });
  };

  if (showResult) {
    const score = calculateScore();
    const timeSpent = Math.round((Date.now() - startTime) / 60000);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className={`rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 ${
            score >= 70 ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            {score >= 70 ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-orange-600" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
          <p className="text-gray-600 mb-6">Here are your results:</p>
          
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Your Score</p>
              <p className={`text-3xl font-bold ${
                score >= 70 ? 'text-green-600' : 'text-orange-600'
              }`}>{score}%</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Time Taken</p>
              <p className="text-lg font-semibold text-gray-800">{timeSpent} minutes</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Correct Answers</p>
              <p className="text-lg font-semibold text-gray-800">
                {Math.round(score / 20)} out of {sampleQuestions.length}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
          >
            Continue to Recommendations
          </button>
        </div>
      </div>
    );
  }

  const question = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Quick Knowledge Assessment</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {sampleQuestions.length}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <span className="text-sm font-medium text-blue-600 mb-2 block">{question.topic}</span>
            <h3 className="text-lg font-medium text-gray-800">{question.question}</h3>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800 group-hover:text-blue-600">
                    {option}
                  </span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center text-sm text-gray-500">
          <CheckCircle className="h-4 w-4 mr-2" />
          Your responses help us understand your current knowledge level
        </div>
      </div>
    </div>
  );
}