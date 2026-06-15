// ============================================================
// AdminInsightsListPage.tsx — Admin article manager (/admin/insights)
// Lists every article (draft / published / archived) with
// publish, archive and delete actions. Matches the
// CareerForgePro indigo+coral design language.
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  useAdminArticles,
  usePublishArticle,
  useArchiveArticle,
  useDeleteArticle,
  type ArticleStatus,
} from '@/features/blog/articlesApi'
import { INSIGHT_CATEGORIES } from './InsightsEditorPage'
import styles from './AdminInsightsList.module.css'

const STATUS_FILTERS: Array<{ id: ArticleStatus | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Drafts' },
  { id: 'published', label: 'Published' },
  { id: 'archived', label: 'Archived' },
]

function categoryFor(tags: string[]) {
  return INSIGHT_CATEGORIES.find((c) => tags.includes(c.label))
}

export default function AdminInsightsListPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'all'>('all')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useAdminArticles({
    page,
    limit: 20,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  })

  const publishArticle = usePublishArticle()
  const archiveArticle = useArchiveArticle()
  const deleteArticle = useDeleteArticle()

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}" permanently? This cannot be undone.`)) {
      deleteArticle.mutate(id)
    }
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Insights — Admin | CareerForge</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Insights</h1>
            <p className={styles.subtitle}>
              {data ? `${data.total} article${data.total !== 1 ? 's' : ''}` : 'Write, publish and manage blog articles.'}
            </p>
          </div>
          <Link to="/admin/insights/new" className={styles.newBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New article
          </Link>
        </div>

        {/* Status filters */}
        <div className={styles.filters}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              className={`${styles.filterChip} ${statusFilter === f.id ? styles.filterChipActive : ''}`}
              onClick={() => { setStatusFilter(f.id); setPage(1) }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className={styles.stateBox}>Loading articles…</div>
        ) : isError ? (
          <div className={styles.stateBox}>Couldn't load articles. Is the server running?</div>
        ) : !data || data.articles.length === 0 ? (
          <div className={styles.stateBox}>
            <p className={styles.emptyTitle}>No articles {statusFilter !== 'all' ? `in ${statusFilter}` : 'yet'}.</p>
            <Link to="/admin/insights/new" className={styles.emptyCta}>Write your first article →</Link>
          </div>
        ) : (
          <div className={styles.list}>
            {data.articles.map((a) => {
              const cat = categoryFor(a.tags)
              const date = new Date(a.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              return (
                <div key={a._id} className={styles.row} onClick={() => navigate(`/admin/insights/${a._id}`)}>
                  <span className={styles.catDot} style={{ background: cat?.col ?? 'var(--muted-2)' }} title={cat?.label} />
                  <div className={styles.rowMain}>
                    <div className={styles.rowTitle}>{a.title}</div>
                    <div className={styles.rowMeta}>
                      {cat && <span style={{ color: cat.col, fontWeight: 600 }}>{cat.label}</span>}
                      {cat && <span className={styles.metaDot} />}
                      <span>Updated {date}</span>
                      {a.readingTime ? (<><span className={styles.metaDot} /><span>{a.readingTime} min read</span></>) : null}
                    </div>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[`status_${a.status}`]}`}>{a.status}</span>
                  <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                    {a.status !== 'published' && (
                      <button
                        className={`${styles.actionBtn} ${styles.actionPublish}`}
                        onClick={() => publishArticle.mutate(a._id)}
                        disabled={publishArticle.isPending}
                      >
                        Publish
                      </button>
                    )}
                    {a.status === 'published' && (
                      <>
                        <a className={styles.actionBtn} href={`/blog/${a.slug}`} target="_blank" rel="noopener noreferrer">View</a>
                        <button
                          className={styles.actionBtn}
                          onClick={() => archiveArticle.mutate(a._id)}
                          disabled={archiveArticle.isPending}
                        >
                          Archive
                        </button>
                      </>
                    )}
                    <button
                      className={`${styles.actionBtn} ${styles.actionDelete}`}
                      onClick={() => handleDelete(a._id, a.title)}
                      disabled={deleteArticle.isPending}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
            <button className={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}
