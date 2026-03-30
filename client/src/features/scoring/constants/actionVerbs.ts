/**
 * Appendix A — Approved Action Verb List
 * A bullet passes the `bullet-action-verb` check if its first word (case-insensitive) is in this list.
 */

const LEADERSHIP = [
  'led', 'managed', 'directed', 'supervised', 'coordinated', 'oversaw', 'guided', 'mentored',
  'coached', 'spearheaded', 'championed', 'facilitated', 'delegated', 'orchestrated', 'mobilized',
  'recruited', 'hired', 'onboarded', 'cultivated',
]

const BUILDING = [
  'built', 'developed', 'designed', 'architected', 'created', 'engineered', 'launched', 'deployed',
  'implemented', 'established', 'founded', 'initiated', 'introduced', 'pioneered', 'prototyped',
  'constructed', 'configured', 'integrated', 'shipped', 'delivered',
]

const IMPROVING = [
  'improved', 'optimized', 'increased', 'reduced', 'decreased', 'streamlined', 'automated',
  'accelerated', 'enhanced', 'upgraded', 'transformed', 'modernized', 'refactored', 'restructured',
  'consolidated', 'simplified', 'standardized', 'eliminated', 'cut', 'boosted',
]

const ANALYSIS = [
  'analyzed', 'researched', 'investigated', 'evaluated', 'assessed', 'audited', 'diagnosed',
  'identified', 'mapped', 'modeled', 'forecasted', 'measured', 'monitored', 'tracked', 'benchmarked',
  'tested', 'validated', 'verified', 'reviewed', 'documented',
]

const ACHIEVING = [
  'achieved', 'delivered', 'exceeded', 'surpassed', 'generated', 'drove', 'grew', 'secured',
  'won', 'closed', 'negotiated', 'sold', 'converted', 'retained', 'expanded', 'scaled', 'completed',
  'executed', 'met', 'attained',
]

const COLLABORATION = [
  'collaborated', 'partnered', 'liaised', 'presented', 'communicated', 'published', 'authored',
  'wrote', 'trained', 'educated', 'advised', 'consulted', 'influenced', 'advocated', 'proposed',
  'pitched', 'defined', 'aligned', 'unified',
]

// Expose a flat Set for fast case-insensitive `has()` lookups.
export const APPROVED_ACTION_VERBS = new Set([
  ...LEADERSHIP,
  ...BUILDING,
  ...IMPROVING,
  ...ANALYSIS,
  ...ACHIEVING,
  ...COLLABORATION,
].map(verb => verb.toLowerCase()))

export const WEAK_OPENERS = [
  'responsible', 'helped', 'assisted', 'worked', 'supported', 'was', 'did', 'involved'
]
