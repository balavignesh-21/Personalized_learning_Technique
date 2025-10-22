import { StudyTechnique, LearningStyle, Recommendation, QuizResult, LearningSession } from '../types';
import { studyTechniques } from '../data/studyTechniques';
import { PerformancePredictor, BehavioralClustering } from './mlAlgorithms';

export class RecommendationEngine {
  private performancePredictor = new PerformancePredictor();
  private behavioralClustering = new BehavioralClustering();

  generateRecommendations(
    learningStyle: LearningStyle,
    quizResults: QuizResult[] = [],
    sessions: LearningSession[] = [],
    limit = 5
  ): Recommendation[] {
    const userCluster = this.behavioralClustering.clusterUser(quizResults, sessions);
    const recentPerformance = this.analyzeRecentPerformance(quizResults);
    
    const scoredTechniques = studyTechniques.map(technique => {
      const confidence = this.calculateConfidence(technique, learningStyle, userCluster, recentPerformance);
      const reasoning = this.generateReasoning(technique, learningStyle, userCluster);
      const personalizedTips = this.generatePersonalizedTips(technique, learningStyle, userCluster);

      return {
        id: `rec-${technique.id}`,
        technique,
        confidence,
        reasoning,
        personalizedTips
      };
    });

    return scoredTechniques
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  private calculateConfidence(
    technique: StudyTechnique,
    learningStyle: LearningStyle,
    userCluster: string,
    recentPerformance: { trend: number; consistency: number }
  ): number {
    // Base confidence from learning style alignment
    let confidence = 0;
    
    switch (technique.type) {
      case 'visual':
        confidence = learningStyle.visual;
        break;
      case 'auditory':
        confidence = learningStyle.auditory;
        break;
      case 'reading':
        confidence = learningStyle.readingWriting;
        break;
      case 'kinesthetic':
        confidence = learningStyle.kinesthetic;
        break;
      case 'mixed':
        confidence = Math.max(learningStyle.visual, learningStyle.auditory, learningStyle.readingWriting, learningStyle.kinesthetic);
        break;
    }

    // Adjust for technique effectiveness
    confidence *= technique.effectiveness;

    // Adjust for user cluster
    const clusterAdjustments = {
      'fast-learner': technique.difficulty === 'advanced' ? 1.2 : 1.0,
      'methodical': technique.difficulty === 'intermediate' ? 1.1 : 0.9,
      'struggling': technique.difficulty === 'beginner' ? 1.2 : 0.7,
      'inconsistent': technique.estimatedTime < 30 ? 1.1 : 0.8
    };

    confidence *= clusterAdjustments[userCluster as keyof typeof clusterAdjustments] || 1;

    // Adjust for recent performance
    confidence *= (1 + recentPerformance.trend * 0.2);
    confidence *= (0.8 + recentPerformance.consistency * 0.4);

    return Math.min(0.95, Math.max(0.1, confidence));
  }

  private generateReasoning(technique: StudyTechnique, learningStyle: LearningStyle, userCluster: string): string {
    const dominantStyle = this.getDominantStyle(learningStyle);
    const reasons = [];

    // Learning style alignment
    if (technique.type === dominantStyle || technique.type === 'mixed') {
      reasons.push(`Matches your ${dominantStyle} learning preference`);
    }

    // Cluster-based reasoning
    const clusterReasons = {
      'fast-learner': 'Suitable for your quick learning pace',
      'methodical': 'Aligns with your systematic approach',
      'struggling': 'Designed to build confidence gradually',
      'inconsistent': 'Flexible format fits your schedule'
    };

    if (clusterReasons[userCluster as keyof typeof clusterReasons]) {
      reasons.push(clusterReasons[userCluster as keyof typeof clusterReasons]);
    }

    // Technique-specific benefits
    if (technique.effectiveness > 0.8) {
      reasons.push('Proven high effectiveness rate');
    }

    return reasons.slice(0, 2).join(' • ');
  }

  private generatePersonalizedTips(technique: StudyTechnique, learningStyle: LearningStyle, userCluster: string): string[] {
    const tips = [];
    const dominantStyle = this.getDominantStyle(learningStyle);

    // Style-specific tips
    const styleTips = {
      visual: [
        'Use color coding and diagrams',
        'Create visual summaries',
        'Watch for patterns and connections'
      ],
      auditory: [
        'Read content aloud',
        'Use background music if helpful',
        'Discuss with others or record yourself'
      ],
      reading: [
        'Take detailed notes',
        'Summarize in your own words',
        'Create outlines and lists'
      ],
      kinesthetic: [
        'Take breaks to move around',
        'Use hands-on examples',
        'Apply concepts immediately'
      ]
    };

    tips.push(...(styleTips[dominantStyle as keyof typeof styleTips] || []).slice(0, 2));

    // Cluster-specific tips
    const clusterTips = {
      'fast-learner': ['Challenge yourself with advanced concepts', 'Set time limits for focused practice'],
      'methodical': ['Follow a structured approach', 'Check your understanding at each step'],
      'struggling': ['Start with easier examples', 'Don\'t hesitate to review fundamentals'],
      'inconsistent': ['Set small, achievable goals', 'Use reminders and scheduling']
    };

    tips.push(...(clusterTips[userCluster as keyof typeof clusterTips] || []));

    return tips.slice(0, 3);
  }

  private getDominantStyle(learningStyle: LearningStyle): string {
    const styles = Object.entries(learningStyle);
    const dominant = styles.reduce((a, b) => a[1] > b[1] ? a : b);
    
    return dominant[0] === 'readingWriting' ? 'reading' : dominant[0];
  }

  private analyzeRecentPerformance(quizResults: QuizResult[]): { trend: number; consistency: number } {
    if (quizResults.length < 2) {
      return { trend: 0, consistency: 0.5 };
    }

    const recentResults = quizResults.slice(-5);
    const scores = recentResults.map(r => r.score);
    
    // Calculate trend (improvement/decline)
    let trend = 0;
    for (let i = 1; i < scores.length; i++) {
      trend += (scores[i] - scores[i-1]) / 100;
    }
    trend /= (scores.length - 1);

    // Calculate consistency (how stable the performance is)
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const consistency = Math.max(0, 1 - variance / 1000); // Normalize to 0-1

    return { trend, consistency };
  }
}