import dotenv from 'dotenv'
dotenv.config()
async function run() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
  const data = await res.json() as any
  if (data.error) console.error(data.error)
  else console.log(data.models?.map((m: any) => m.name).join('\n'))
}
run().catch(console.error)
