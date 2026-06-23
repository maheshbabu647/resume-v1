/**
 * One-off: insert/update a SINGLE blog post from blog-posts.manifest.ts into the
 * Article collection as a DRAFT (never auto-published), so it can be reviewed in
 * /admin/insights before going live. Companion to migrate-blog-to-db.ts, which
 * does all posts at once and publishes immediately — this is the one-by-one,
 * review-first version requested for the manual blog migration.
 *
 * Run: npx ts-node src/scripts/seed-blog-draft.ts <legacyPostId> <adminEmail>
 *      npx ts-node src/scripts/seed-blog-draft.ts 1 admin@careerforge.pro
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

  if (lines[0]?.startsWith('# ')) start = 1
  while (start < lines.length && (lines[start].trim() === '' || lines[start].trim() === '---' || lines[start].startsWith('**By '))) {
    start++
  }

  return lines.slice(start).join('\n').trim()
}

async function resolveAdminId(emailArg?: string): Promise<string> {
  const email = (emailArg || process.env.ADMIN_EMAIL || '').toLowerCase().trim()
  if (!email) {
    throw new Error('Pass the admin email as the 2nd CLI argument, or set ADMIN_EMAIL in .env.')
  }

  const admin = await User.findOne({ email }).select('_id role').lean()
  if (!admin) {
    throw new Error(`No user found with email: ${email}. Register first, then re-run.`)
  }

  if (admin.role !== 'admin') {
    throw new Error(`User ${email} is not role 'admin' (role: ${admin.role ?? 'none'}). Promote them first.`)
  }

  return admin._id.toString()
}

async function seedDraft(legacyPostId: number, adminId: string) {
  const entry = BLOG_MIGRATION_ENTRIES.find((e) => e.legacyPostId === legacyPostId)
  if (!entry) throw new Error(`No manifest entry for legacyPostId ${legacyPostId}`)

  const mdPath = path.join(repoRoot, entry.markdownFile)
  if (!fs.existsSync(mdPath)) throw new Error(`Missing markdown file: ${entry.markdownFile}`)

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
    status: 'draft' as const,
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
    console.log(`↻ Updated draft: ${entry.slug} (_id: ${existing._id})`)
  } else {
    const created = await Article.create(payload)
    console.log(`✓ Created draft: ${entry.slug} (_id: ${created._id})`)
    console.log(`  Edit at: /admin/insights/${created._id}`)
  }
}

const legacyPostId = Number(process.argv[2])
const emailArg = process.argv[3]

if (!legacyPostId) {
  console.error('Usage: npx ts-node src/scripts/seed-blog-draft.ts <legacyPostId> <adminEmail>')
  process.exit(1)
}

mongoose.connect(uri)
  .then(async () => {
    console.log('📦 Connected to MongoDB')
    const adminId = await resolveAdminId(emailArg)
    await seedDraft(legacyPostId, adminId)
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  })
