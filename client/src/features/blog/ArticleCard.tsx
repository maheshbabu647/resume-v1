import { Link } from 'react-router-dom'
import { categoryFor, CATEGORY_COLOR } from './blogCategories'
import type { PostCardData } from './blogCategories'
import styles from './ArticleCard.module.css'

export function ArticleCard({ post }: { post: PostCardData }) {
  const cat = categoryFor(post)
  const col = CATEGORY_COLOR[cat]
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })

  return (
    <Link to={`/blog/${post.slug}`} className={styles.articleCard} aria-label={`Read: ${post.title}`}>
      <div className={styles.articleCover} style={{ background: `linear-gradient(135deg, ${col}25, ${col}05)`, border: `1px solid ${col}20` }}>
        <div className={styles.articleCoverInner}>
          <div className={styles.articleCategoryBadge} style={{ background: `${col}20`, color: col }}>{cat}</div>
          <div className={styles.articleReadTime} style={{ color: col }}>
            {post.readingTime}<span>min</span>
          </div>
        </div>
      </div>
      <h3 className={styles.articleTitle}>{post.title}</h3>
      <p className={styles.articleExcerpt}>{post.excerpt}</p>
      <div className={styles.articleFooter}>
        <div className={styles.articleAvatar} style={{ background: `linear-gradient(135deg, ${col}, ${col}80)` }}>C</div>
        <span className={styles.articleAuthor}>CareerForgePro Team</span>
        <span className={styles.metaDot} />
        <span className={styles.articleDate}>{formattedDate}</span>
      </div>
    </Link>
  )
}
