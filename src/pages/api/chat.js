import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Cine-bot API is running',
      status: 'active',
      version: 'gemini-flash-1.5'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // a structured prompt for movie-related queries
    const systemPrompt = `
You are Cine-bot, an AI assistant specialized in movies, web series, and TV shows. 
Your responses should be informative, engaging, and focused on entertainment content.

When providing information about movies/shows, always structure your response in this format when applicable:

**Title:** [Movie/Show Name]
**Director:** [Director Name]
**Year:** [Release Year]
**Genre:** [Genre(s)]
**Cast:** [Main actors/actresses]
**Plot Summary:** [Brief plot description]
**Rating/Reception:** [If known]
**Interesting Facts:** [Any trivia or notable information]

If the user asks for recommendations, provide a list with brief descriptions.
If the user asks general questions about cinema, provide informative answers.
Always maintain an enthusiastic and knowledgeable tone about entertainment content.

Current user message: "${message}"
`;

    // Build conversation context
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = 'Previous conversation:\n';
      conversationHistory.slice(-4).forEach(msg => {
        conversationContext += `${msg.role}: ${msg.content}\n`;
      });
      conversationContext += '\n';
    }

    const fullPrompt = conversationContext + systemPrompt;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Parse the response to extract structured data
    const structuredData = parseMovieResponse(aiResponse);

    return res.status(200).json({
      success: true,
      response: aiResponse,
      structuredData: structuredData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    let errorMessage = 'Sorry, I encountered an error while processing your request.';
    let statusCode = 500;

    if (error.message.includes('API key')) {
      errorMessage = 'API configuration error. Please check the API key.';
      statusCode = 500;
    } else if (error.message.includes('quota')) {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.message.includes('blocked')) {
      errorMessage = 'Request was blocked. Please rephrase your question.';
      statusCode = 400;
    }

    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Helper function to parse movie/show information from AI response
function parseMovieResponse(response) {
  const structuredData = {
    titles: [],
    directors: [],
    years: [],
    genres: [],
    cast: [],
    hasStructuredInfo: false
  };

  try {
    // Extract titles
    const titleMatches = response.match(/\*\*Title:\*\*\s*(.+?)(?=\n|\*\*|$)/gi);
    if (titleMatches) {
      structuredData.titles = titleMatches.map(match => 
        match.replace(/\*\*Title:\*\*\s*/i, '').trim()
      );
      structuredData.hasStructuredInfo = true;
    }

    // Extract directors
    const directorMatches = response.match(/\*\*Director:\*\*\s*(.+?)(?=\n|\*\*|$)/gi);
    if (directorMatches) {
      structuredData.directors = directorMatches.map(match => 
        match.replace(/\*\*Director:\*\*\s*/i, '').trim()
      );
    }

    // Extract years
    const yearMatches = response.match(/\*\*Year:\*\*\s*(.+?)(?=\n|\*\*|$)/gi);
    if (yearMatches) {
      structuredData.years = yearMatches.map(match => 
        match.replace(/\*\*Year:\*\*\s*/i, '').trim()
      );
    }

    // Extract genres
    const genreMatches = response.match(/\*\*Genre:\*\*\s*(.+?)(?=\n|\*\*|$)/gi);
    if (genreMatches) {
      structuredData.genres = genreMatches.map(match => 
        match.replace(/\*\*Genre:\*\*\s*/i, '').trim()
      );
    }

    // Extract cast
    const castMatches = response.match(/\*\*Cast:\*\*\s*(.+?)(?=\n|\*\*|$)/gi);
    if (castMatches) {
      structuredData.cast = castMatches.map(match => 
        match.replace(/\*\*Cast:\*\*\s*/i, '').trim()
      );
    }

    // If no structured format found, try to extract movie/show names from the response
    if (!structuredData.hasStructuredInfo) {
      // Look for quoted titles or capitalized movie names
      const possibleTitles = response.match(/"([^"]+)"/g);
      if (possibleTitles) {
        structuredData.titles = possibleTitles.map(title => title.replace(/"/g, ''));
      }
    }

  } catch (parseError) {
    console.error('Error parsing response:', parseError);
  }

  return structuredData;
}