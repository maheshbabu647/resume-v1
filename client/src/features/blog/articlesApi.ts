// ============================================================
// articlesApi.ts — Article fetching (public + admin)
// Mirrors server/src/types/article.types.ts
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/apiClient'

export type ArticleStatus = 'draft' | 'published' | 'archived'
export type ArticleContentFormat = 'markdown' | 'html'

export interface ArticleListItem {
  _id: string
  slug: string
  title: string
  shortTitle: string
  excerpt: string
  metaDescription: string
  ogImage?: string
  coverImage?: string
  status: ArticleStatus
  publishedAt?: string
  readingTime?: number
  tags: string[]
  series?: string
  seriesDay?: number
  authorId: string
  createdAt: string
  updatedAt: string
}

export interface ArticleDetail extends ArticleListItem {
  content: string
  contentFormat: ArticleContentFormat
}

export interface PaginatedArticles {
  articles: ArticleListItem[]
  total: number
  page: number
  limit: number
}

export interface ListArticlesParams {
  page?: number
  limit?: number
  status?: ArticleStatus
  tag?: string
  series?: string
}

export interface ArticleInput {
  slug?: string
  title?: string
  shortTitle?: string
  excerpt?: string
  content?: string
  contentFormat?: ArticleContentFormat
  metaDescription?: string
  ogImage?: string
  coverImage?: string
  readingTime?: number
  tags?: string[]
  series?: string
  seriesDay?: number
  status?: 'draft' | 'published'
  publishedAt?: string
}

// ── Public ──────────────────────────────────────────────────

export async function fetchPublishedArticles(params: ListArticlesParams = {}): Promise<PaginatedArticles> {
  const { data } = await apiClient.get('/articles', { params })
  return data.data
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetail> {
  const { data } = await apiClient.get(`/articles/${slug}`)
  return data.data
}

export function usePublishedArticles(params: ListArticlesParams = {}) {
  return useQuery({
    queryKey: ['articles', 'published', params],
    queryFn: () => fetchPublishedArticles(params),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ['articles', 'detail', slug],
    queryFn: () => fetchArticleBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      // Don't retry 404s — the slug simply doesn't exist in the DB
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status === 404) return false
      return failureCount < 1
    },
  })
}

// ── Admin ───────────────────────────────────────────────────

export async function fetchAdminArticles(params: ListArticlesParams = {}): Promise<PaginatedArticles> {
  const { data } = await apiClient.get('/admin/articles', { params })
  return data.data
}

export async function fetchAdminArticleById(id: string): Promise<ArticleDetail> {
  const { data } = await apiClient.get(`/admin/articles/${id}`)
  return data.data
}

export function useAdminArticles(params: ListArticlesParams = {}) {
  return useQuery({
    queryKey: ['articles', 'admin', params],
    queryFn: () => fetchAdminArticles(params),
  })
}

export function useAdminArticle(id: string | undefined) {
  return useQuery({
    queryKey: ['articles', 'admin-detail', id],
    queryFn: () => fetchAdminArticleById(id!),
    enabled: !!id && id !== 'new',
  })
}

function useInvalidateArticles() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ['articles'] })
}

export function useCreateArticle() {
  const invalidate = useInvalidateArticles()
  return useMutation({
    mutationFn: async (body: ArticleInput) => {
      const { data } = await apiClient.post('/admin/articles', body)
      return data.data as ArticleDetail
    },
    onSuccess: invalidate,
  })
}

export function useUpdateArticle() {
  const invalidate = useInvalidateArticles()
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: ArticleInput }) => {
      const { data } = await apiClient.patch(`/admin/articles/${id}`, body)
      return data.data as ArticleDetail
    },
    onSuccess: invalidate,
  })
}

export function usePublishArticle() {
  const invalidate = useInvalidateArticles()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(`/admin/articles/${id}/publish`)
      return data.data as ArticleDetail
    },
    onSuccess: invalidate,
  })
}

export function useArchiveArticle() {
  const invalidate = useInvalidateArticles()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(`/admin/articles/${id}/archive`)
      return data.data as ArticleDetail
    },
    onSuccess: invalidate,
  })
}

export function useDeleteArticle() {
  const invalidate = useInvalidateArticles()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/articles/${id}`)
    },
    onSuccess: invalidate,
  })
}
