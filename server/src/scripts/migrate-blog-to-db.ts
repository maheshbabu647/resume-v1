/**
 * One-time migration: import static blog markdown into Article collection.
 *
 * Requires an admin user — set ADMIN_EMAIL in .env or pass as first CLI arg.
 *
 * Run: npx ts-node src/scripts/migrate-blog-to-db.ts
 *      npx ts-node src/scripts/migrate-blog-to-db.ts admin@careerforge.pro
 */

import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from '../models/User.model'
import { Article } from '../models/Article.model'
import { BLOG_MIGRATION_ENTRIES } from './blog-posts.manifest'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerforge'
const repoRoot = path.resolve(__dirname, '../../..')

const stripMarkdownHeader = (raw: string): string => {
  const lines = raw.split('\n')
  let start = 0

  // Skip title line (# ...) and optional byline / horizontal rules at top
  if (lines[0]?.startsWith('# ')) start = 1
  while (start < lines.length && (lines[start].trim() === '' || lines[start].trim() === '---' || lines[start].startsWith('**By '))) {
    start++
  }

  return lines.slice(start).join('\n').trim()
}

async function resolveAdminId(emailArg?: string): Promise<string> {
  const email = (emailArg || process.env.ADMIN_EMAIL || '').toLowerCase().trim()
  if (!email) {
    throw new Error('Set ADMIN_EMAIL in .env or pass admin email as CLI argument.')
  }

  let admin = await User.findOne({ email }).select('_id role').lean()
  if (!admin) {
    throw new Error(`No user found with email: ${email}. Register first, then re-run.`)
  }

  if (admin.role !== 'admin') {
    await User.updateOne({ _id: admin._id }, { $set: { role: 'admin' } })
    console.log(`ℹ️  Promoted ${email} to admin`)
  }

  return admin._id.toString()
}

async function migrateBlogPosts(adminId: string) {
  let created = 0
  let updated = 0
  let skipped = 0

  for (const entry of BLOG_MIGRATION_ENTRIES) {
    const mdPath = path.join(repoRoot, entry.markdownFile)
    if (!fs.existsSync(mdPath)) {
      console.warn(`⚠️  Missing markdown file: ${entry.markdownFile} — skipping ${entry.slug}`)
      skipped++
      continue
    }

    const raw = fs.readFileSync(mdPath, 'utf-8')
    const content = stripMarkdownHeader(raw)

    const payload = {
      slug: entry.slug,
      title: entry.title,
      shortTitle: entry.shortTitle,
      excerpt: entry.excerpt,
      content,
      contentFormat: 'markdown' as const,
      metaDescription: entry.metaDescription,
      ogImage: entry.ogImage,
      coverImage: entry.ogImage,
      status: 'published' as const,
      publishedAt: new Date(entry.publishedAt),
      readingTime: entry.readingTime,
      tags: entry.tags,
      series: entry.series,
      seriesDay: entry.seriesDay,
      authorId: adminId,
      legacyPostId: entry.legacyPostId,
    }

    const existing = await Article.findOne({
      $or: [{ slug: entry.slug }, { legacyPostId: entry.legacyPostId }],
    })

    if (existing) {
      await Article.updateOne({ _id: existing._id }, { $set: payload })
      updated++
      console.log(`↻ Updated: ${entry.slug}`)
    } else {
      await Article.create(payload)
      created++
      console.log(`✓ Created: ${entry.slug}`)
    }
  }

  console.log(`\n📚 Blog migration done — created: ${created}, updated: ${updated}, skipped: ${skipped}`)
}

mongoose.connect(uri)
  .then(async () => {
    console.log('📦 Connected to MongoDB:', uri)
    const adminId = await resolveAdminId(process.argv[2])
    await migrateBlogPosts(adminId)
    await Article.syncIndexes()
    console.log('🎉 Blog migration complete')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Blog migration failed:', err.message)
    process.exit(1)
  })
