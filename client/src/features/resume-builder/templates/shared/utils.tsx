import React from 'react'

export function sanitizeUrl(url: string | undefined): string {
  if (!url) return '#'
  
  const trimmed = url.trim()
  
  if (/^(javascript:|data:)/i.test(trimmed)) {
    return '#'
  }

  if (!/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return `https://${trimmed}`
  }

  return trimmed
}

export function formatAsList(text: string | undefined): React.ReactNode {
  if (!text) return null

  const lines = text.split('\n').filter(line => line.trim() !== '')

  if (lines.length === 0) return null

  // If only one line and it doesn't look like a bulleted list item, return a p tag
  if (lines.length === 1) {
    const line = lines[0].trim()
    if (!line.startsWith('-') && !line.startsWith('•') && !line.startsWith('*')) {
      return <p>{line}</p>
    }
  }

  return (
    <ul>
      {lines.map((line, index) => {
        // Strip common bullet characters from the start of the line so we don't have double bullets
        const cleanLine = line.replace(/^[\s\-•*]+/, '').trim()
        return <li key={index}>{cleanLine}</li>
      })}
    </ul>
  )
}
