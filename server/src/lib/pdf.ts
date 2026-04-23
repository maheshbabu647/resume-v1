import puppeteer, { type Browser } from 'puppeteer'
import sanitizeHtml from 'sanitize-html'
import { AppError } from './AppError'

let browser: Browser | null = null

// ─── Allowed HTML tags / attributes for resume content ───────────────────────
// We keep rich formatting but strip all scripts, iframes, and external resource
// references (src/href pointing to http/https) to prevent SSRF.

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'html', 'head', 'body', 'style', 'title',
    'img', 'figure', 'figcaption',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['class', 'id', 'style'],
    a:   ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
  },
  allowedSchemes: ['data', 'mailto'],       // no http / https in src / href
  allowedSchemesAppliedToAttributes: ['src', 'href', 'action'],
  allowedStyles: {
    '*': {
      // Permit all CSS properties - resume styling is purely visual
      color:             [/.*/],
      'background-color':[/.*/],
      'font-size':       [/.*/],
      'font-weight':     [/.*/],
      'font-family':     [/.*/],
      'text-align':      [/.*/],
      'text-decoration': [/.*/],
      margin:            [/.*/],
      'margin-top':      [/.*/],
      'margin-right':    [/.*/],
      'margin-bottom':   [/.*/],
      'margin-left':     [/.*/],
      padding:           [/.*/],
      'padding-top':     [/.*/],
      'padding-right':   [/.*/],
      'padding-bottom':  [/.*/],
      'padding-left':    [/.*/],
      border:            [/.*/],
      'border-top':      [/.*/],
      'border-bottom':   [/.*/],
      'border-left':     [/.*/],
      'border-right':    [/.*/],
      width:             [/.*/],
      'max-width':       [/.*/],
      height:            [/.*/],
      display:           [/.*/],
      'flex-direction':  [/.*/],
      'flex-wrap':       [/.*/],
      'flex-grow':       [/.*/],
      'flex-shrink':     [/.*/],
      gap:               [/.*/],
      'align-items':     [/.*/],
      'justify-content': [/.*/],
      'line-height':     [/.*/],
      'letter-spacing':  [/.*/],
      'word-break':      [/.*/],
      'page-break-after':[/.*/],
      'page-break-inside':[/.*/],
      position:          [/.*/],
      top:               [/.*/],
      left:              [/.*/],
      right:             [/.*/],
      bottom:            [/.*/],
      overflow:          [/.*/],
      'list-style':      [/.*/],
      'list-style-type': [/.*/],
      opacity:           [/.*/],
    },
  },
}

export const sanitizeResumeHtml = (html: string): string =>
  sanitizeHtml(html, SANITIZE_OPTIONS)

const getBrowser = async (): Promise<Browser> => {
  if (browser && browser.connected) return browser
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })
  browser.on('disconnected', () => { browser = null })
  return browser
}

export const htmlToPDF = async (html: string): Promise<Buffer> => {
  const safe = sanitizeResumeHtml(html)
  const b    = await getBrowser()
  const page = await b.newPage()
  try {
    // Block all external network requests to prevent SSRF
    await page.setRequestInterception(true)
    page.on('request', (request) => {
      const url = request.url()
      // Allow data: URIs and about:blank (initial page load); abort everything else
      if (url.startsWith('data:') || url === 'about:blank') {
        request.continue()
      } else {
        request.abort()
      }
    })

    await page.setContent(safe, { waitUntil: 'networkidle2', timeout: 15_000 })
    const buf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } })
    return Buffer.from(buf)
  } catch (err) {
    throw new AppError('EXPORT_FAILED', 500, 'PDF generation failed.')
  } finally {
    await page.close()
  }
}

export const closeBrowser = async (): Promise<void> => {
  if (browser) { await browser.close(); browser = null }
}

