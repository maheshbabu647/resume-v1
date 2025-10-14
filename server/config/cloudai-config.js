import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv'
dotenv.config()

const vertex_ai = new VertexAI({
    project: process.env.GCP_PROJECT_ID,
    location: process.env.GCP_PROJECT_LOCATION
})

export default vertex_ai