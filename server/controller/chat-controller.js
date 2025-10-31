// controller/chat-controller.js

import vertex_ai from '../config/cloudai-config.js';
import AIUsageTracker from '../util/ai-usage-tracker.js';

// Get the generative model from your config
const model = vertex_ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Handles a conversation turn with the AI.
 * Expects a 'history' array in the request body, containing the conversation so far.
 */
export const handleChat = async (req, res) => {
  try {
    const { history, sessionId } = req.body;

    // Validate that history is a non-empty array
    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({
        status: 400,
        error: 'Conversation history is required and must be a non-empty array.'
      });
    }

    // The entire conversation history is sent to the model for context
    const request = {
      contents: history,
    };

    // Call the model
    const result = await model.generateContent(request);

    // Extract the response text
    const responseText = result.response.candidates[0].content.parts[0].text;

    // Track AI usage
    const tokens = AIUsageTracker.extractTokenCounts(result);
    await AIUsageTracker.logUsage({
      service: 'chat',
      model: 'gemini-2.5-flash',
      inputTokens: tokens.inputTokens,
      outputTokens: tokens.outputTokens,
      user: req.user || null,
      sessionId: sessionId || null,
      success: true
    });

    res.status(200).json({
      status: 200,
      reply: responseText
    });

  } catch (error) {
    console.error('Gemini chat error:', error);
    
    // Track failed usage
    await AIUsageTracker.logUsage({
      service: 'chat',
      model: 'gemini-2.5-flash',
      inputTokens: 0,
      outputTokens: 0,
      user: req.user || null,
      sessionId: req.body.sessionId || null,
      success: false,
      errorMessage: error.message
    });
    
    res.status(500).json({
      status: 500,
      error: 'An error occurred while communicating with the AI.'
    });
  }
};



// resumeRouter.get('/field', async(req, res)=>{
    
//   const model = vertex_ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

//     const prompt = `Generate 5 professional and impactful resume bullet points for a Ml Engineer. Focus on achievements, use action verbs, and include quantifiable metrics where possible.`;

//     const result = await model.generateContent(prompt);
//     const responseText = result.response.candidates[0].content.parts[0].text;
//     console.log(responseText)
//     res.json({ bulletPoints: responseText });
//   })

// export default resumeRouter
