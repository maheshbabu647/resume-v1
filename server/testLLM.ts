import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent("Hello")
    console.log("Success 2.5-flash:", result.response.text())
  } catch (e: any) { console.error("2.5-flash err:", e.message) }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
    const result = await model.generateContent("Hello")
    console.log("Success 2.0-flash-lite:", result.response.text())
  } catch (e: any) { console.error("2.0-flash-lite err:", e.message) }
}
run().catch(console.error)
