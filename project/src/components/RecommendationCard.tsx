import React from 'react';
import { Clock, Star, ArrowRight, Lightbulb } from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onSelect: (recommendation: Recommendation) => void;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-orange-100 text-orange-700',
  advanced: 'bg-red-100 text-red-700'
};

const typeColors = {
  visual: 'bg-purple-100 text-purple-700',
  auditory: 'bg-blue-100 text-blue-700',
  reading: 'bg-green-100 text-green-700',
  kinesthetic: 'bg-orange-100 text-orange-700',
  mixed: 'bg-gray-100 text-gray-700'
};

export default function RecommendationCard({ recommendation, onSelect }: RecommendationCardProps) {
  const { technique, confidence, reasoning, personalizedTips } = recommendation;
  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-purple-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
              {technique.name}
            </h3>
            <div className="flex gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[technique.type]}`}>
                {technique.type}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[technique.difficulty]}`}>
                {technique.difficulty}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3">{technique.description}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Confidence Match</span>
          <span className="text-sm text-gray-600">{confidencePercentage}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-2 transition-all duration-500"
            style={{ width: `${confidencePercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">Why This Works for You</span>
        </div>
        <p className="text-sm text-gray-600">{reasoning}</p>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Personalized Tips</h4>
        <ul className="space-y-1">
          {personalizedTips.slice(0, 2).map((tip, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {technique.estimatedTime}min
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {Math.round(technique.effectiveness * 100)}% effective
          </div>
        </div>

        <button
          onClick={() => onSelect(recommendation)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
        >
          Try This
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}