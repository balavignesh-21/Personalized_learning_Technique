import { LearningStyle, QuizResult, LearningSession } from '../types';

// Mock ML Classification Algorithm for Learning Style Detection
export class LearningStyleClassifier {
  private weights = {
    visual: { timeOnVisuals: 0.3, prefersDiagrams: 0.4, colorCoding: 0.3 },
    auditory: { likesMusic: 0.3, prefersDiscussion: 0.4, readAloud: 0.3 },
    reading: { takesNotes: 0.4, readsInstructions: 0.3, writesToLearn: 0.3 },
    kinesthetic: { needsMovement: 0.4, learnsByDoing: 0.3, usesGestures: 0.3 }
  };

  classify(responses: Record<string, number>): LearningStyle {
    const visual = this.calculateScore('visual', responses);
    const auditory = this.calculateScore('auditory', responses);
    const readingWriting = this.calculateScore('reading', responses);
    const kinesthetic = this.calculateScore('kinesthetic', responses);

    // Normalize scores
    const total = visual + auditory + readingWriting + kinesthetic;
    
    return {
      visual: visual / total,
      auditory: auditory / total,
      readingWriting: readingWriting / total,
      kinesthetic: kinesthetic / total
    };
  }

  private calculateScore(style: keyof typeof this.weights, responses: Record<string, number>): number {
    let score = 0;
    const weights = this.weights[style];
    
    Object.entries(weights).forEach(([key, weight]) => {
      score += (responses[key] || 0) * weight;
    });
    
    return Math.max(0.1, score); // Minimum score to avoid division by zero
  }
}

// Mock Clustering Algorithm for Behavioral Pattern Analysis
export class BehavioralClustering {
  private clusters = [
    { id: 'fast-learner', profile: { avgTime: 15, successRate: 0.8, sessionFreq: 2.5 } },
    { id: 'methodical', profile: { avgTime: 35, successRate: 0.9, sessionFreq: 1.2 } },
    { id: 'struggling', profile: { avgTime: 25, successRate: 0.6, sessionFreq: 0.8 } },
    { id: 'inconsistent', profile: { avgTime: 20, successRate: 0.7, sessionFreq: 1.8 } }
  ];

  clusterUser(quizResults: QuizResult[], sessions: LearningSession[]): string {
    const avgTime = this.calculateAverageTime(quizResults);
    const successRate = this.calculateSuccessRate(quizResults);
    const sessionFreq = this.calculateSessionFrequency(sessions);

    let minDistance = Infinity;
    let closestCluster = this.clusters[0].id;

    this.clusters.forEach(cluster => {
      const distance = this.euclideanDistance(
        { avgTime, successRate, sessionFreq },
        cluster.profile
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCluster = cluster.id;
      }
    });

    return closestCluster;
  }

  private calculateAverageTime(quizResults: QuizResult[]): number {
    if (quizResults.length === 0) return 20;
    return quizResults.reduce((sum, result) => sum + result.timeSpent, 0) / quizResults.length;
  }

  private calculateSuccessRate(quizResults: QuizResult[]): number {
    if (quizResults.length === 0) return 0.7;
    return quizResults.reduce((sum, result) => sum + (result.score >= 70 ? 1 : 0), 0) / quizResults.length;
  }

  private calculateSessionFrequency(sessions: LearningSession[]): number {
    if (sessions.length === 0) return 1;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentSessions = sessions.filter(session => new Date(session.completedAt) > weekAgo);
    return recentSessions.length / 7;
  }

  private euclideanDistance(a: any, b: any): number {
    return Math.sqrt(
      Math.pow(a.avgTime - b.avgTime, 2) +
      Math.pow((a.successRate - b.successRate) * 100, 2) +
      Math.pow(a.sessionFreq - b.sessionFreq, 2)
    );
  }
}

// Performance Prediction Algorithm
export class PerformancePredictor {
  predict(learningStyle: LearningStyle, techniqueType: string, userCluster: string): number {
    const styleWeights = {
      visual: learningStyle.visual,
      auditory: learningStyle.auditory,
      reading: learningStyle.readingWriting,
      kinesthetic: learningStyle.kinesthetic
    };

    const clusterMultipliers = {
      'fast-learner': 1.2,
      'methodical': 1.1,
      'struggling': 0.8,
      'inconsistent': 0.9
    };

    const baseScore = styleWeights[techniqueType as keyof typeof styleWeights] || 0.5;
    const clusterMultiplier = clusterMultipliers[userCluster as keyof typeof clusterMultipliers] || 1;
    
    return Math.min(0.95, baseScore * clusterMultiplier + Math.random() * 0.1);
  }
}