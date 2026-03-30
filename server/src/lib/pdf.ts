import puppeteer, { type Browser } from 'puppeteer'
import { AppError } from './AppError'

let browser: Browser | null = null

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
  const b    = await getBrowser()
  const page = await b.newPage()
  try {
    // networkidle2 is safer if there are trailing requests that don't finish immediately
    await page.setContent(html, { waitUntil: 'networkidle2', timeout: 15_000 })
    const buf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } })
    return Buffer.from(buf)
  } catch (err) {
    console.error('[PDF] Error:', err)
    throw new AppError('EXPORT_FAILED', 500, 'PDF generation failed.')
  } finally {
    await page.close()
  }
}

export const closeBrowser = async (): Promise<void> => {
  if (browser) { await browser.close(); browser = null }
}
