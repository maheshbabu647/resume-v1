/**
 * Content-quality word lists for the advanced (content-only) resume strength score.
 * These detect filler that dilutes signal — the opposite of strong, specific writing.
 */

// Generic self-description clichés ATS taxonomies discount and recruiters skim past.
export const BUZZWORDS = [
  'team player', 'hard worker', 'hard-working', 'detail-oriented', 'detail oriented',
  'go-getter', 'self-starter', 'self starter', 'results-driven', 'results driven',
  'results-oriented', 'goal-oriented', 'think outside the box', 'outside the box',
  'synergy', 'synergies', 'go above and beyond', 'best of breed', 'value add', 'value-add',
  'fast learner', 'quick learner', 'people person', 'highly motivated', 'motivated individual',
  'dynamic', 'proactive', 'passionate', 'driven professional', 'track record of success',
  'proven track record', 'wear many hats', 'roll up my sleeves', 'rockstar', 'ninja', 'guru',
]

// Empty intensifiers / hedges that add length without information.
export const FILLER_WORDS = [
  'very', 'really', 'quite', 'just', 'actually', 'basically', 'literally', 'simply',
  'successfully', 'effectively', 'efficiently', 'various', 'numerous', 'several',
  'a lot of', 'lots of', 'etc', 'and more', 'among others', 'as well as', 'in order to',
  'responsible for handling', 'tasked with', 'duties included',
]

// Leftover template / placeholder text that signals an unfinished resume.
export const PLACEHOLDER_MARKERS = [
  'lorem ipsum', 'describe your', 'your responsibilities', 'e.g.', 'eg.', 'tbd', 'xxxx',
  'job title', 'company name', 'add a bullet', 'placeholder', 'enter your', 'click to edit',
]

// First-person markers — resumes should be written in implied first person (no "I"/"my").
export const FIRST_PERSON = ['i', 'me', 'my', 'mine', 'myself']

// Result/outcome verbs — their presence signals impact rather than task description.
export const OUTCOME_VERBS = [
  'increased', 'reduced', 'decreased', 'improved', 'grew', 'saved', 'generated', 'boosted',
  'accelerated', 'cut', 'optimized', 'drove', 'delivered', 'achieved', 'exceeded', 'launched',
  'doubled', 'tripled', 'expanded', 'scaled', 'lowered', 'raised', 'eliminated', 'won', 'secured',
]
