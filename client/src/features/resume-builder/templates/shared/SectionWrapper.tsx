import React from 'react'

interface SectionWrapperProps {
  title: string
  children: React.ReactNode
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, children }) => {
  return (
    <section className="template-section">
      <h2 className="template-section-title">{title}</h2>
      <div className="template-section-content">
        {children}
      </div>
    </section>
  )
}
