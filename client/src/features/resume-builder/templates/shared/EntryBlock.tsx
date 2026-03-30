import React from 'react'

interface EntryBlockProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  metaLeft?: React.ReactNode
  metaRight?: React.ReactNode
  children?: React.ReactNode
}

export const EntryBlock: React.FC<EntryBlockProps> = ({
  title,
  subtitle,
  metaLeft,
  metaRight,
  children
}) => {
  return (
    <div className="template-entry">
      <div className="template-entry-header">
        <div className="template-entry-header-left">
          <h3 className="template-entry-title">{title}</h3>
          {subtitle && <p className="template-entry-subtitle">{subtitle}</p>}
          {metaLeft && <div className="template-entry-meta-left">{metaLeft}</div>}
        </div>
        <div className="template-entry-header-right">
          {metaRight && <div className="template-entry-meta-right">{metaRight}</div>}
        </div>
      </div>
      {children && <div className="template-entry-body">{children}</div>}
    </div>
  )
}
