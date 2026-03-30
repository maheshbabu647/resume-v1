import type { CustomizationConfig, SpacingConfig, SizingConfig } from './template.types'

export const DEFAULT_SPACING: SpacingConfig = {
  sectionGap:   1.2,
  entryGap:     0.75,
  pagePadding:  36,
  bulletGap:    0.2,
}

export const DEFAULT_SIZING: SizingConfig = {
  baseFontSize:     10.5,
  nameFontSize:     20,
  sectionTitleSize: 13,
  entryTitleSize:   11.5,
  metaFontSize:     10,
  lineHeight:       1.4,
}

export function buildCSSVars(config: CustomizationConfig): React.CSSProperties {
  const { stylePack, spacing, sizing } = config
  return {
    '--accent-color':       stylePack.accentColor,
    '--font-family':        stylePack.fontFamily,
    '--font-size-name':     `${sizing.nameFontSize}pt`,
    '--font-size-title':    `${sizing.sectionTitleSize}pt`,
    '--font-size-section':  `${sizing.sectionTitleSize}pt`,
    '--font-size-entry':    `${sizing.entryTitleSize}pt`,
    '--font-size-base':     `${sizing.baseFontSize}pt`,
    '--font-size-meta':     `${sizing.metaFontSize}pt`,
    '--line-height':        String(sizing.lineHeight),
    '--page-padding':       `${spacing.pagePadding}px`,
    '--section-gap':        `${spacing.sectionGap}rem`,
    '--entry-gap':          `${spacing.entryGap}rem`,
    '--bullet-gap':         `${spacing.bulletGap}rem`,
  } as React.CSSProperties
}
