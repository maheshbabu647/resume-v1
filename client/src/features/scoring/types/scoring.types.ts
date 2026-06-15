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

// ─── JD-Spec (mirrors server POST /ai/jd-spec) ────────────────────────────────
// The weighted, resume-independent spec extracted by the LLM ONCE per JD. The
// deterministic client formula (atsMatchEngine) scores a resume against it live.

export type SkillType = "hard" | "soft";
export type Seniority = "intern" | "junior" | "mid" | "senior" | "lead" | "executive";

export interface JdSpecSkill {
  term: string;
  aliases: string[];
  weight: number;                     // integer 1..3
  type: SkillType;
}

export interface JdSpecResponsibility {
  phrase: string;
  keywords: string[];
}

export interface JDSpec {
  jobTitle: string;
  titleTerms: string[];
  seniority: Seniority;
  minYears: number | null;
  requiredSkills: JdSpecSkill[];
  preferredSkills: JdSpecSkill[];
  domainKeywords: JdSpecSkill[];
  responsibilities: JdSpecResponsibility[];
  certifications: string[];
  inputHash: string;
  cachedAt?: number;
}

// ─── Live ATS Match result (computed client-side from JDSpec + resume) ─────────

export type MatchZone = "skills" | "experience" | "other";

export interface AtsSkillMatch {
  term: string;
  weight: number;
  type: SkillType;
  matched: boolean;
  matchValue: number;                 // 0..1 incl. placement modifier
  foundIn: MatchZone[];
}

export interface AtsComponents {
  required: number;                   // each 0..1
  preferred: number;
  title: number;
  context: number;
}

export type AtsLabel =
  | "Weak match" | "Partial match" | "Decent match" | "Strong match" | "Excellent match";

export interface AtsMatchResult {
  score: number;                      // 0..100
  label: AtsLabel;
  components: AtsComponents;
  titleMatched: boolean;
  requiredSkills: AtsSkillMatch[];
  preferredSkills: AtsSkillMatch[];
  domainKeywords: AtsSkillMatch[];
  missing: AtsSkillMatch[];           // unmatched required+preferred, weight desc
  matchedCount: number;               // over required+preferred
  totalCount: number;
  seniority: Seniority;
  jobTitle: string;
  responsibilities: JdSpecResponsibility[];
}

// ─── Advanced Resume Strength (content-only, no template credit) ───────────────

export type StrengthDimension =
  | "impact" | "language" | "specificity" | "density" | "substance";

export interface StrengthCheck {
  checkId: string;
  dimension: StrengthDimension;
  message: string;
  pointsLost: number;
  affectedItems?: string[];
}

export interface ResumeStrengthScore {
  totalScore: number;                 // 0..100
  label: "Needs Work" | "Fair" | "Good" | "Strong" | "Excellent";
  dimensionScores: Record<StrengthDimension, number>;
  dimensionMax: Record<StrengthDimension, number>;
  failedChecks: StrengthCheck[];
  passedChecks: string[];
}
