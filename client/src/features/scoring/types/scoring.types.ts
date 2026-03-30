export interface ResumeQualityScore {
  totalScore: number;           // 0–100
  label: "Needs Work" | "Fair" | "Good" | "Strong" | "Excellent";
  dimensionScores: {
    completeness: number;       // 0–25
    bulletQuality: number;      // 0–35
    structure: number;          // 0–20
    atsSafety: number;          // 0–10
    keywordDensity: number;     // 0–10
  };
  failedChecks: FailedCheck[];
  passedChecks: string[];       // checkIds of all passing checks
}

export type ScoreDimension = 
  | "completeness" 
  | "bulletQuality" 
  | "structure" 
  | "atsSafety" 
  | "keywordDensity";

export interface FailedCheck {
  checkId: string;              
  dimension: ScoreDimension;
  message: string;              // Exact user-facing string 
  pointsLost: number;
  affectedItems?: string[];     // e.g. ["Software Engineer at Acme — bullet 2"]
}

export interface JDFitScore {
  fitScore: number;
  label: "Weak match" | "Partial match" | "Decent match" | "Strong match" | "Excellent match";
  requiredSkills: SkillMatch[];
  preferredSkills: SkillMatch[];
  seniorityLevel: "intern" | "junior" | "mid" | "senior" | "lead" | "executive";
  keyResponsibilities: string[];      // max 5, verbatim from JD
  semanticOverlapScore: number;       // 0–100
  missingKeywords: MissingKeyword[];
  improvementSuggestions: Suggestion[];
  inputHash: string;                  // SHA-256 of (serializedResume + preprocessedJD)
  cachedAt?: number;                  // Unix timestamp if served from cache
}

export interface SkillMatch {
  skill: string;
  presentInResume: boolean;
  foundAs: string | null;
}

export interface MissingKeyword {
  keyword: string;
  importance: "required" | "preferred";
  context: string;                    // 1 sentence showing how it's used in the JD
}

export interface Suggestion {
  rank: 1 | 2 | 3;
  suggestion: string;                 // Specific. Max 2 sentences.
  impact: "high" | "medium" | "low";
}
