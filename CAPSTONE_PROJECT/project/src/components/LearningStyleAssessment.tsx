import React, { useState } from 'react';
import { Brain, CheckCircle, ArrowRight } from 'lucide-react';
import { LearningStyleClassifier } from '../utils/mlAlgorithms';
import { LearningStyle } from '../types';

interface AssessmentProps {
  onComplete: (learningStyle: LearningStyle, responses: Record<string, number>) => void;
  onCancel: () => void;
}

const questions = [
  {
    id: 'timeOnVisuals',
    question: 'I learn better when information is presented with charts, diagrams, or visual aids',
    category: 'Visual'
  },
  {
    id: 'prefersDiagrams',
    question: 'I prefer to see the overall picture before focusing on details',
    category: 'Visual'
  },
  {
    id: 'colorCoding',
    question: 'I use colors, highlights, or visual markers when studying',
    category: 'Visual'
  },
  {
    id: 'likesMusic',
    question: 'I often study better with background music or sounds',
    category: 'Auditory'
  },
  {
    id: 'prefersDiscussion',
    question: 'I learn best through discussions and verbal explanations',
    category: 'Auditory'
  },
  {
    id: 'readAloud',
    question: 'I often read aloud or talk through problems to understand them',
    category: 'Auditory'
  },
  {
    id: 'takesNotes',
    question: 'I learn best by taking detailed written notes',
    category: 'Reading/Writing'
  },
  {
    id: 'readsInstructions',
    question: 'I prefer to read instructions carefully before starting a task',
    category: 'Reading/Writing'
  },
  {
    id: 'writesToLearn',
    question: 'Writing summaries helps me remember information better',
    category: 'Reading/Writing'
  },
  {
    id: 'needsMovement',
    question: 'I need to move around or use my hands while learning',
    category: 'Kinesthetic'
  },
  {
    id: 'learnsByDoing',
    question: 'I learn best through hands-on experience and practice',
    category: 'Kinesthetic'
  },
  {
    id: 'usesGestures',
    question: 'I use gestures and body movement when explaining concepts',
    category: 'Kinesthetic'
  }
];

export default function LearningStyleAssessment({ onComplete, onCancel }: AssessmentProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleResponse = (questionId: string, rating: number) => {
    const newResponses = { ...responses, [questionId]: rating };
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      // All questions answered, analyze results
      setIsAnalyzing(true);
      setTimeout(() => {
        const classifier = new LearningStyleClassifier();
        const learningStyle = classifier.classify(newResponses);
        onComplete(learningStyle, newResponses);
      }, 2000);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Your Learning Style</h3>
          <p className="text-gray-600">Our AI is processing your responses to create a personalized learning profile...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Learning Style Assessment</h2>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
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
              className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <span className="text-sm font-medium text-purple-600 mb-2 block">{question.category}</span>
            <h3 className="text-lg font-medium text-gray-800">{question.question}</h3>
          </div>

          <div className="space-y-3">
            {[
              { value: 5, label: 'Strongly Agree' },
              { value: 4, label: 'Agree' },
              { value: 3, label: 'Neutral' },
              { value: 2, label: 'Disagree' },
              { value: 1, label: 'Strongly Disagree' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleResponse(question.id, value)}
                className="w-full p-4 text-left bg-gray-50 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800 group-hover:text-purple-600">
                    {label}
                  </span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center text-sm text-gray-500">
          <CheckCircle className="h-4 w-4 mr-2" />
          Your responses help us create personalized learning recommendations
        </div>
      </div>
    </div>
  );
}